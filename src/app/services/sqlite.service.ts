import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private database: SQLiteObject | undefined;

  constructor(private sqlite: SQLite) {
    this.initDatabase();
  }

  private initDatabase() {
    this.sqlite.create({
      name: 'yokap.db',
      location: 'default',
    }).then((db: SQLiteObject) => {
      this.database = db;
      this.createTables();
    }).catch((error) => {
      console.error('Erreur lors de la création de la base de données', error);
    });
  }

  private createTables() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        label TEXT,
        amount REAL,
        date TEXT
      )
    `;

    if (this.database) {
      this.database.executeSql(createTableQuery, [])
        .then(() => console.log('Table "operations" créée avec succès'))
        .catch(error => console.error('Erreur lors de la création de la table "operations"', error));
    } else {
      console.error('Database is not initialized');
    }
  }

  async addOperation(type: string, label: string, amount: number): Promise<void> {
    const date = new Date().toISOString();
    const addOperationQuery = `
      INSERT INTO operations (type, label, amount, date) VALUES (?, ?, ?, ?)
    `;

    if (this.database) {
      await this.database.executeSql(addOperationQuery, [type, label, amount, date])
          .then(() => console.log('Opération ajoutée avec succès'))
          .catch(error => console.error('Erreur lors de l\'ajout de l\'opération', error));
  } else {
      console.error('Database is not initialized');
  }
  }

  async getOperations(): Promise<any[]> {
    const getOperationsQuery = `
      SELECT * FROM operations
    `;

    if (this.database) {
      return this.database.executeSql(getOperationsQuery, [])
      .then(data => {
        const operations = [];
        for (let i = 0; i < data.rows.length; i++) {
          operations.push(data.rows.item(i));
        }
        return operations;
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des opérations', error);
        return [];
      });
    } else {
      console.error('Database is not initialized');
      return [];
    }
  }
}
