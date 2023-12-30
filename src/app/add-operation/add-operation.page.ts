import { Component } from '@angular/core';
import { SqliteService } from '../services/sqlite.service'; // Assurez-vous d'importer le service SQLite approprié

@Component({
  selector: 'app-add-operation',
  templateUrl: 'add-operation.page.html',
  styleUrls: ['add-operation.page.scss'],
})
export class AddOperationPage {
  operationType: string | undefined;
  operationLabel: string | undefined;
  operationAmount: number | undefined;

  constructor(private sqliteService: SqliteService) {}

  async onAddOperation() {
    if (this.operationType && this.operationLabel && this.operationAmount) {
      try {
        const currentDate = new Date().toISOString();
        switch (this.operationType) {
          case 'income':
          case 'withdrawal':
          case 'borrow':
          case 'loan':
          case 'savings':
          case 'deposit': // Ajout du cas pour le type 'deposit'
            await this.sqliteService.addOperation(this.operationType, this.operationLabel, this.operationAmount, currentDate);
            break;
          default:
            console.error('Invalid operation type');
            return;
        }

        console.log('Opération ajoutée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'opération', error);
      }
    } else {
      console.error('Veuillez remplir tous les champs du formulaire.');
    }
    
  }
}
