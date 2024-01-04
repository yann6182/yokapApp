import { EventEmitter, Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Operation } from 'src/app/models/operations';
import { Totals } from 'src/app/models/Totals';

@Injectable({
  providedIn: 'root'
})
export class SqlService {

  private db!: SQLiteObject;
  soldePrincipalUpdated = new EventEmitter<number>();
  soldeEpargne : number = 0;
  private operationTypes = ['Depot', 'Retrait', 'Emprunt', 'Pret'];

  constructor(private sqlite: SQLite) {
    this.sqlite.create({
      name: 'yokap.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      this.createTables();
    });
  }

  private createTables() {
    this.db.executeSql('CREATE TABLE IF NOT EXISTS operations (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, label TEXT, amount REAL, date TEXT)', [])
      .then(() => console.log('Table des opérations créée'))
      .catch(error => console.error('Erreur lors de la création de la table des opérations', error));

    this.db.executeSql('CREATE TABLE IF NOT EXISTS compte (id INTEGER PRIMARY KEY AUTOINCREMENT, soldePrincipal REAL)', [])
      .then(() => {
        console.log('Table compte créée');
        this.db.executeSql('INSERT INTO compte (soldePrincipal) VALUES (?)', [0])
          .then(() => console.log('Solde principal initialisé'))
          .catch(error => console.error('Erreur lors de l’initialisation du solde principal', error));
      })
      .catch(error => console.error('Erreur lors de la création de la table compte', error));
  }

  addOperation(operation: Operation) {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    operation.date = formattedDate;

    return this.db.executeSql('INSERT INTO operations (type, label, amount, date) VALUES (?, ?, ?, ?)',
      [operation.type, operation.label, operation.amount, operation.date])
      .then(() => {
        this.updateSoldePrincipal();
      });
  }

  private updateSoldePrincipal() {
    this.db.executeSql('SELECT (SELECT IFNULL(SUM(amount), 0) FROM operations WHERE type IN (?, ?)) - (SELECT IFNULL(SUM(amount), 0) FROM operations WHERE type IN (?, ?)) AS soldePrincipal', ['Depot', 'Emprunt', 'Retrait', 'Pret'])
      .then(data => {
        if (data.rows.length > 0) {
          const soldePrincipal = data.rows.item(0).soldePrincipal || 0;
          this.db.executeSql('UPDATE compte SET soldePrincipal = ?', [soldePrincipal])
            .then(() => {
              console.log('Solde principal mis à jour');
              this.soldePrincipalUpdated.emit(soldePrincipal); // Émettre la valeur mise à jour
            })
            .catch(error => console.error('Erreur lors de la mise à jour du solde principal', error));
        }
      });
  }

  getOperations() {
    return this.db.executeSql('SELECT * FROM operations', [])
      .then(data => {
        let operations: Operation[] = [];
        for (let i = 0; i < data.rows.length; i++) {
          operations.push(data.rows.item(i));
        }
        return operations;
      });
  }

  getSoldePrincipal() {
    return this.db.executeSql('SELECT soldePrincipal FROM compte', [])
      .then(data => {
        if (data.rows.length > 0) {
          return data.rows.item(0).soldePrincipal;
        }
        return 0;
      });
  }
  async getDailyTotals(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    const getDailyTotalsQuery = `
      SELECT type, SUM(amount) as total FROM operations WHERE date = ? GROUP BY type
    `;

    if (this.db) {
      const result = await this.db.executeSql(getDailyTotalsQuery, [today]);
      const dailyTotals = [];
      for (let i = 0; i < result.rows.length; i++) {
        dailyTotals.push(result.rows.item(i));
      }
      return dailyTotals;
    } else {
      console.error('Database is not initialized');
      return [];
    }
  }

  async getWeeklyTotals(): Promise<any[]> {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const getWeeklyTotalsQuery = `
      SELECT type, SUM(amount) as total FROM operations WHERE date >= ? GROUP BY type
    `;

    if (this.db) {
      const result = await this.db.executeSql(getWeeklyTotalsQuery, [startOfWeek.toISOString().split('T')[0]]);
      const weeklyTotals = [];
      for (let i = 0; i < result.rows.length; i++) {
        weeklyTotals.push(result.rows.item(i));
      }
      return weeklyTotals;
    } else {
      console.error('Database is not initialized');
      return [];
    }
  }
  async getYearlyTotals(): Promise<any[]> {
    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const getYearlyTotalsQuery = `
      SELECT type, SUM(amount) as total FROM operations WHERE date >= ? GROUP BY type
    `;
  
    if (this.db) {
      const result = await this.db.executeSql(getYearlyTotalsQuery, [yearStart]);
      const yearlyTotals = [];
      for (let i = 0; i < result.rows.length; i++) {
        yearlyTotals.push(result.rows.item(i));
      }
      return yearlyTotals;
    } else {
      console.error('Database is not initialized');
      return [];
    }
  }

  getTotalsByOperationType(): Promise<Totals> {
    return this.db.executeSql('SELECT type, amount FROM operations', [])
      .then(data => {
        const totalsByType: { [type: string]: number } = {};

        for (let i = 0; i < data.rows.length; i++) {
          let operation = data.rows.item(i);
          if (!totalsByType[operation.type]) {
            totalsByType[operation.type] = 0;
          }
          totalsByType[operation.type] += operation.amount;
        }

        let totals: Totals = this.initializeTotalsToZero();
        Object.keys(totals).forEach(key => {
          totals[key as keyof Totals] = totalsByType[key] || 0;
        });

        return totals;
      }).catch(error => {
        console.error('Erreur lors de la récupération des totaux par type d’opération', error);
        return this.initializeTotalsToZero();
      });
  }



  private initializeTotalsToZero(): Totals {
    let totals: Totals = { Depot: 0, Retrait: 0, Emprunt: 0, Pret: 0, Epargne: 0 };
    return totals;
  }


  async exportData(): Promise<string> {
    try {
      const transactions = await this.getAllTransactionHistory();
      const mainBalance = await this.getMainBalance();
      const totalByType: { [type: string]: number } = {};
  
      // Obtenez les totaux pour chaque type de transaction
      for (const type of this.operationTypes) {
        totalByType[type] = await this.getTotalByType(type);
      }
  
      // Retournez les données dans le format JSON
      const exportData = JSON.stringify({
        transactions,
        mainBalance,
        totalByType,
      });
  
      return exportData;
    } catch (error) {
      console.error('Erreur lors de la collecte des données d\'exportation', error);
      throw error;
    }
  }

  async getAllTransactionHistory(): Promise<{ type: string, transactions: any[] }[]> {
    try {
      const getAllHistoryQuery = `
        SELECT * FROM transaction_history
      `;
  
      if (this.db) {
        const result = await this.db.executeSql(getAllHistoryQuery, []);
        const history: { type: string, transactions: any[] }[] = [];
  
        for (let i = 0; i < result.rows.length; i++) {
          const transaction = result.rows.item(i);
          const type = transaction.type;
  
          // Ajoutez la propriété 'type' à chaque transaction
          transaction.transactionType = type;
  
          // Vérifiez si le type existe déjà dans l'historique
          const existingType = history.find(item => item.type === type);
  
          if (existingType) {
            // Ajoutez la transaction à un type existant
            existingType.transactions.push(transaction);
          } else {
            // Ajoutez un nouveau type avec la transaction
            history.push({ type, transactions: [transaction] });
          }
        }
  
        return history;
      } else {
        console.error('Database is not initialized');
        return [];
      }
    } catch (error) {
      console.error('Error fetching all transaction history:', error);
      return [];
    }
  }

  async getMainBalance(): Promise<number> {
    const incomeTotal = await this.calculateTotal('income');
    const loanTotal = await this.calculateTotal('loan');
    const retraittotal = await this.calculateTotal('withdrawal');
    const empruntTotal = await this.calculateTotal('borrow');
    // Solde principal = total income - total loan
    const mainBalance = (incomeTotal +empruntTotal )-(retraittotal+loanTotal);
  
    return mainBalance;
  }

  async calculateTotal(type: string): Promise<number> {
    const calculateTotalQuery = `
      SELECT SUM(amount) as total FROM operations WHERE type = ?
    `;

    if (this.db) {
      const result = await this.db.executeSql(calculateTotalQuery, [type]);
      return result.rows.item(0).total || 0;
    } else {
      console.error('Database is not initialized');
      return 0;
    }
  }

  async getTotalByType(type: string): Promise<number> {
    const getTotalQuery = `
      SELECT SUM(amount) as total FROM operations WHERE type = ?
    `;

    if (this.db) {
      const result = await this.db.executeSql(getTotalQuery, [type]);
      return result.rows.item(0).total || 0;
    } else {
      console.error('Database is not initialized');
      return 0;
    }
  }
  
    
  
    


}









