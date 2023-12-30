import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';

@Injectable({
  providedIn: 'root',
})
export class OperationService {

  constructor(private sqliteService: SqliteService) {}

  async addOperation(type: string, label: string, amount: number): Promise<void> {
    const date = new Date().toISOString();
    await this.sqliteService.addOperation(type, label, amount, date);

    // Mettre à jour le solde principal si nécessaire
    if (type === 'deposit' || type === 'loan') {
      await this.updateMainBalance(amount);
    } else if (type === 'withdrawal' || type === 'borrow') {
      await this.updateMainBalance(-amount);
    }

    // Mettre à jour le total si nécessaire
    if (type !== 'savings') {
      await this.updateTotal(type);
    }
    this.updateSoldes();

  }

  async getOperations(): Promise<any[]> {
    return this.sqliteService.getOperations();
  }

  private async updateTotal(type: string): Promise<void> {
    const operations = await this.getOperations();

    if (type === 'income') {
      // Mise à jour du total des entrées (income)
      const total = this.calculateTotalForType(operations, type);
      console.log(`Mise à jour du total pour ${type}: ${total}`);
    } else {
      // Déduction du montant des sorties ou prêts du total des entrées
      const total = this.calculateTotalForType(operations, type);
      const newTotal = this.calculateTotalForType(operations, 'income') - total;
      console.log(`Déduction du montant pour ${type} du total des entrées: ${newTotal}`);
    }
  }

  async borrowCredit(amount: number): Promise<void> {
    const incomeTotal = await this.calculateTotal('income');

    if (incomeTotal >= amount) {
      await this.addOperation('borrow', 'Borrow Credit', amount);
    } else {
      throw new Error('Not enough income for this credit borrowing.');
    }
  }

  async loan(amount: number): Promise<void> {
    const incomeTotal = await this.calculateTotal('income');

    if (incomeTotal >= amount) {
      await this.addOperation('loan', 'Loan', amount);
    } else {
      throw new Error('Not enough income for this loan.');
    }
  }

  async savings(amount: number): Promise<void> {
    await this.addOperation('savings', 'Savings', amount);
  }

  async getDailyTotals(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    await this.updateDailyTotal(today);
    return this.calculateTotalsForDate(today);
  }

  async getWeeklyTotals(): Promise<any[]> {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    await this.updateWeeklyTotal(startOfWeek.toISOString().split('T')[0]);
    return this.calculateTotalsForDate(startOfWeek.toISOString().split('T')[0]);
  }

  async withdrawal(amount: number): Promise<void> {
    const incomeTotal = await this.calculateTotal('income');

    if (incomeTotal >= amount) {
      await this.addOperation('withdrawal', 'Withdrawal', amount);
    } else {
      throw new Error('Not enough income and savings for this withdrawal.');
    }
  }

   async updateDailyTotal(date: string): Promise<void> {
    const operations = await this.getOperations();
    const dailyOperations = operations.filter(operation => operation.date.split('T')[0] === date);

    for (const type of this.getUniqueTypes(dailyOperations)) {
      const total = this.calculateTotalForType(dailyOperations, type);
      // Mettre à jour le total quotidien dans la base de données ou où vous stockez vos totaux
      // Exemple : this.updateDailyTotalInDatabase(type, date, total);
    }
  }

 async updateWeeklyTotal(startOfWeekDate: string): Promise<void> {
    const operations = await this.getOperations();
    const weeklyOperations = operations.filter(operation => new Date(operation.date) >= new Date(startOfWeekDate));

    for (const type of this.getUniqueTypes(weeklyOperations)) {
      const total = this.calculateTotalForType(weeklyOperations, type);
      // Mettre à jour le total hebdomadaire dans la base de données ou où vous stockez vos totaux
      // Exemple : this.updateWeeklyTotalInDatabase(type, startOfWeekDate, total);
    }
  }

 calculateTotalForType(operations: any[], type: string): number {
    return operations
      .filter(operation => operation.type === type)
      .reduce((acc, operation) => acc + operation.amount, 0);
  }

   getUniqueTypes(operations: any[]): string[] {
    return Array.from(new Set(operations.map(operation => operation.type)));
  }

   async calculateTotal(type: string): Promise<number> {
    const operations = await this.getOperations();
    return this.calculateTotalForType(operations, type);
  }

  private async calculateTotalsForDate(date: string): Promise<any[]> {
    const operations = await this.getOperations();
    const types = this.getUniqueTypes(operations);

    return types.map(type => ({
      type,
      total: this.calculateTotalForDate(operations, type, date),
    }));
  }

  private calculateTotalForDate(operations: any[], type: string, date: string): number {
    return operations
      .filter(operation => operation.type === type && operation.date.split('T')[0] === date)
      .reduce((acc, operation) => acc + operation.amount, 0);
  }

  async updateMainBalance(amount: number): Promise<void> {
    // Mise à jour du solde principal dans le service SQLite
  }
  // operation.service.ts

  async getTotalByType(): Promise<any[]> {
    const types = ['income', 'withdrawal', 'borrow', 'loan', 'savings'];
    const totals = await Promise.all(types.map(type => this.calculateTotal(type)));
    return types.map((type, index) => ({ type, total: totals[index] }));
  }
  

  
  async getMainBalance(): Promise<number> {
    // Utilisez une requête SQL ou toute autre méthode pour récupérer le solde principal depuis la base de données
    const mainBalance = await this.calculateTotal('mainBalance'); // Vous devrez adapter cela à votre structure de données
  
    return mainBalance;
  }
  
}
