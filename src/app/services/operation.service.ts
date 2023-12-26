import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';


@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private sqliteService: SqliteService) {}

  async addOperation(type: string, label: string, amount: number): Promise<void> {
    await this.sqliteService.addOperation(type, label, amount);
  }

  async getOperations(): Promise<any[]> {
    return this.sqliteService.getOperations();
  }

  async getDailyTotals(): Promise<any[]> {
    const operations = await this.getOperations();
    const today = new Date().toISOString().split('T')[0];
    const types = Array.from(new Set(operations.map(operation => operation.type)));

    const dailyTotals = types.map(type => ({
      type,
      total: operations
        .filter(operation => operation.type === type && operation.date.split('T')[0] === today)
        .reduce((acc, operation) => acc + operation.amount, 0),
    }));

    return dailyTotals;
  }

  async getWeeklyTotals(): Promise<any[]> {
    const operations = await this.getOperations();
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const types = Array.from(new Set(operations.map(operation => operation.type)));

    const weeklyTotals = types.map(type => ({
      type,
      total: operations
        .filter(operation => operation.type === type && new Date(operation.date) >= startOfWeek)
        .reduce((acc, operation) => acc + operation.amount, 0),
    }));

    return weeklyTotals;
  }
}
