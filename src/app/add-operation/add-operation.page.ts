import { Component } from '@angular/core';
import { OperationService } from '../services/operation.service';

@Component({
  selector: 'app-add-operation',
  templateUrl: 'add-operation.page.html',
  styleUrls: ['add-operation.page.scss'],
})
export class AddOperationPage {
  operationType: string|any;
  operationLabel: string|any;
  operationAmount: number|any;

  constructor(private operationService: OperationService) {}

  onAddOperation() {
    if (this.operationType && this.operationLabel && this.operationAmount) {
      this.operationService.addOperation(this.operationType, this.operationLabel, this.operationAmount)
        .then(() => {
          // Opération ajoutée avec succès, effectuer des actions supplémentaires si nécessaire
          console.log('Opération ajoutée avec succès');
        })
        .catch(error => {
          console.error('Erreur lors de l\'ajout de l\'opération', error);
        });
    } else {
      console.error('Veuillez remplir tous les champs du formulaire.');
    }
  }
}
