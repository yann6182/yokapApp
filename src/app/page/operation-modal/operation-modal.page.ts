import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Operation } from 'src/app/models/operations';
import { SqlService } from 'src/app/service/providers/sql.service';

@Component({
  selector: 'app-operation-modal',
  templateUrl: './operation-modal.page.html',
  styleUrls: ['./operation-modal.page.scss'],
})
export class OperationModalPage {
  operationTypes!: string[];
  operation: Operation = { type: '', label: '', amount: 0, date: '' };
  soldePrincipal!: number;

  constructor(
    private modalController: ModalController,
    private sqlserv: SqlService,
    private navParams: NavParams,
    private alertController: AlertController,
  ) {
    this.operation.type = this.navParams.get('operationType');
    this.soldePrincipal = this.navParams.get('soldePrincipal') || 0;
    console.log(this.soldePrincipal)
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async saveOperation() {
    if (!this.operation.label || this.operation.amount === undefined || this.operation.amount < 0) {
      await this.presentAlert('Erreur', 'Veuillez remplir tous les champs correctement.');
      return;
    }

    // Vérification spécifique pour les opérations de type "Pret" ou "Retrait"
    if ((this.operation.type === 'Pret' || this.operation.type === 'Retrait') && this.operation.amount > await this.sqlserv.getSoldePrincipal()) {
      await this.presentAlert('Erreur', 'Le montant de l\'opération est supérieur au solde principal.');
      return;
    }

    const newOperation = {
      type: this.operation.type,
      label: this.operation.label,
      amount: this.operation.amount,
      date: new Date().toLocaleString(),
    };

    this.sqlserv
      .addOperation(newOperation)
      .then(() => {
        console.log('Opération enregistrée avec succès');
        this.modalController.dismiss();
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement de l\'opération', error);
        this.presentAlert('Erreur', 'Une erreur est survenue lors de l\'enregistrement de l\'opération.');
      });
  }


  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
