import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Operation } from 'src/app/models/operations';
import { SqlService } from 'src/app/service/providers/sql.service';
import { OperationModalPage } from '../operation-modal/operation-modal.page';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.page.html',
  styleUrls: ['./operations.page.scss'],
})
export class OperationsPage  {
  operations: Operation[] | any;
  soldePrincipal: number = 0;


  constructor(private sqlsev: SqlService,private modalController: ModalController,private actionSheetController: ActionSheetController) {}


  ionViewWillEnter() {
    this.loadOperations();
    this.getSolde();
  }

  async openModal() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Operation ',
      buttons: [
        {
          text: 'Depot',
          handler: () => {
            this.presentModal('Depot');
          },
        },
        {
          text: 'Retrait',
          handler: () => {
            this.presentModal('Retrait');
          },
        },
        {
          text: 'Pret',
          handler: () => {
            this.presentModal('Pret');
          },
        },
        {
          text: 'Emprunt',
          handler: () => {
            this.presentModal('Emprunt');
          },
        },
        {
          text: 'Epargne',
          handler: () => {
            this.presentModal('Epargne');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async presentModal(operationType: string) {
    const modal = await this.modalController.create({
      component: OperationModalPage,
      componentProps: {
        soldePrincipal: this.soldePrincipal,
        operationType: operationType,
      },
    });

    modal.onDidDismiss().then(() => {
      this.loadOperations();
    });

    return await modal.present();
  }


  loadOperations() {
    this.sqlsev.getOperations().then(data => {
      this.operations = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }).catch(err => {
      console.error('Erreur lors du chargement des opérations', err);
    });
   }

  async getSolde() {
    try {
      this.soldePrincipal = await this.sqlsev.getSoldePrincipal();
    } catch (err) {
      console.error('Erreur lors de la récupération du solde principal', err);
    }
  }
}

