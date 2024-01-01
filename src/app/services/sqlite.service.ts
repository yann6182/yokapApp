import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  operationTypes: string[] = ['withdrawal', 'income', 'borrow', 'savings', 'deposit','loan'];

  private database: SQLiteObject | undefined;
  soldes$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private sqlite: SQLite, public alertController: AlertController) {
    this.initDatabase();
    
  }

  private initDatabase() {
    this.sqlite
      .create({
        name: 'yokap1.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.createTables();
        this.initializeMainBalance(); // Ajoutez cette ligne
      })
      .catch((error) => {
        console.error('Erreur lors de la création de la base de données', error);
      });
  }

  async getAllTransactionHistory(): Promise<{ type: string, transactions: any[] }[]> {
    try {
      const getAllHistoryQuery = `
        SELECT * FROM transaction_history
      `;
  
      if (this.database) {
        const result = await this.database.executeSql(getAllHistoryQuery, []);
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
  

  private initializeMainBalance() {
    const insertMainBalanceQuery = `
      INSERT OR IGNORE INTO main_balance (balance) VALUES (0)
    `;

    if (this.database) {
      this.database
        .executeSql(insertMainBalanceQuery, [])
        .then(() => console.log('Solde principal initialisé avec succès'))
        .catch((error) => console.error('Erreur lors de linitialisation du solde principal', error));
    } else {
      console.error('Database is not initialized');
    }
  }

  private createTables() {
    const createOperationsTableQuery = `
      CREATE TABLE IF NOT EXISTS operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        label TEXT,
        amount REAL,
        date TEXT
      )
    `;

    const createTransactionHistoryTableQuery = `
      CREATE TABLE IF NOT EXISTS transaction_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operation_id INTEGER,
        type TEXT,
        label TEXT,
        amount REAL,
        date TEXT,
        FOREIGN KEY (operation_id) REFERENCES operations (id)
      )
    `;

    const createMainBalanceTableQuery = `
      CREATE TABLE IF NOT EXISTS main_balance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        balance REAL
      )
    `;

    if (this.database) {
      this.database
        .transaction((tx) => {
          tx.executeSql(createOperationsTableQuery, []);
          tx.executeSql(createTransactionHistoryTableQuery, []);
          tx.executeSql(createMainBalanceTableQuery, []);
        })
        .then(() => {
          console.log('Tables créées avec succès');
        })
        .catch((error) => {
          console.error('Erreur lors de la création des tables', error);
        });
    } else {
      console.error('Database is not initialized');
    }
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async addOperation(type: string, label: string, amount: number, date: string): Promise<void> {
    const addOperationQuery = `
      INSERT INTO operations (type, label, amount, date) VALUES (?, ?, ?, ?)
    `;
    const addTransactionHistoryQuery = `
      INSERT INTO transaction_history (operation_id, type, label, amount, date) VALUES (?, ?, ?, ?, ?)
    `;
   
    if (this.database) {
      // Check if the amount is greater than the main balance before adding the operation
      if ((type === 'withdrawal' || type === 'loan') && amount > (await this.getMainBalance())) {
        console.error('Erreur: Montant supérieur au solde principal');
        this.presentAlert('Erreur d\'opération', 'Le montant est supérieur au solde principal. Opération annulée.');
        return;
      }
   
      await this.database.transaction((tx) => {
        tx.executeSql(
          addOperationQuery,
          [type, label, amount, date],
          (tx: any, result: any) => {
            const operationId = result.insertId;
            tx.executeSql(
              addTransactionHistoryQuery,
              [operationId, type, label, amount, date],
              async () => {
                console.log('Opération ajoutée avec succès');
   
                // Update the main balance
                const updatedBalance = (type === 'deposit' || type === 'borrow') ? (await this.getMainBalance()) + amount : (await this.getMainBalance()) - amount;
                this.updateMainBalance(updatedBalance);
                this.presentAlert('Opération réussie', 'Opération ajoutée avec succès');
              },
              (error: any) => {
                console.error('Erreur lors de l\'ajout de l\'historique de l\'opération', error);
                this.presentAlert('Erreur lors de l\'ajout', 'Erreur lors de l\'ajout de l\'historique de l\'opération');
              }
            );
          },
          (error: any) => {
            console.error('Erreur lors de l\'ajout de l\'opération', error);
            this.presentAlert('Erreur lors de l\'ajout', 'Erreur lors de l\'ajout de l\'opération');
          }
        );
      });
    } else {
      console.error('Database is not initialized');
    }
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

  

  async getTransactionHistoryByType(type: string): Promise<any[]> {
    try {
      const getHistoryQuery = `
        SELECT * FROM transaction_history WHERE type = ?
      `;
  
      if (this.database) {
        const result = await this.database.executeSql(getHistoryQuery, [type]);
        const history = [];
  
        for (let i = 0; i < result.rows.length; i++) {
          history.push(result.rows.item(i));
        }
  
        return history;
      } else {
        console.error('Database is not initialized');
        return [];
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
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

  async updateMainBalance(amount: number): Promise<void> {
    const currentBalance = await this.getMainBalance();
    const newBalance = currentBalance + amount;
  
    const updateBalanceQuery = `
      UPDATE main_balance SET balance = ?
    `;
  
    if (this.database) {
      await this.database.executeSql(updateBalanceQuery, [newBalance])
        .then(() => {
          console.log('Solde principal mis à jour avec succès');
          // Si vous souhaitez effectuer des actions supplémentaires après la mise à jour du solde, vous pouvez les ajouter ici.
        })
        .catch(error => console.error('Erreur lors de la mise à jour du solde principal', error));
    } else {
      console.error('Database is not initialized');
    }
  }
  async getSoldes(): Promise<any> {
    // Vous devrez adapter cela en fonction de votre structure de données
    return { mainBalance: await this.getMainBalance(), /* autres soldes si nécessaire */ };
  }
  async updateBalances(type: string, amount: number): Promise<void> {
    const currentBalance = await this.getMainBalance();
    const newBalance = currentBalance + amount;

    const updateBalanceQuery = `
      UPDATE main_balance SET balance = ?
    `;

    if (this.database) {
      await this.database.executeSql(updateBalanceQuery, [newBalance])
        .then(() => console.log('Solde principal mis à jour avec succès'))
        .catch(error => console.error('Erreur lors de la mise à jour du solde principal', error));
    } else {
      console.error('Database is not initialized');
    }

    // Mettez à jour les autres soldes si nécessaire

    // Émettez les nouveaux soldes
    this.soldes$.next({ mainBalance: newBalance, /* autres soldes si nécessaire */ });
  }
  
 async getTotalByType(type: string): Promise<number> {
    const getTotalQuery = `
      SELECT SUM(amount) as total FROM operations WHERE type = ?
    `;

    if (this.database) {
      const result = await this.database.executeSql(getTotalQuery, [type]);
      return result.rows.item(0).total || 0;
    } else {
      console.error('Database is not initialized');
      return 0;
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
  

  async getDailyTotals(): Promise<any[]> {
    const today = new Date().toISOString().split('T')[0];
    const getDailyTotalsQuery = `
      SELECT type, SUM(amount) as total FROM operations WHERE date = ? GROUP BY type
    `;

    if (this.database) {
      const result = await this.database.executeSql(getDailyTotalsQuery, [today]);
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

    if (this.database) {
      const result = await this.database.executeSql(getWeeklyTotalsQuery, [startOfWeek.toISOString().split('T')[0]]);
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

  async calculateTotal(type: string): Promise<number> {
    const calculateTotalQuery = `
      SELECT SUM(amount) as total FROM operations WHERE type = ?
    `;

    if (this.database) {
      const result = await this.database.executeSql(calculateTotalQuery, [type]);
      return result.rows.item(0).total || 0;
    } else {
      console.error('Database is not initialized');
      return 0;
    }
  }
}
