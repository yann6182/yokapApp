import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Operation } from 'src/app/models/operations';
import { SqlService } from 'src/app/service/providers/sql.service';
import { OperationModalPage } from '../operation-modal/operation-modal.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.page.html',
  styleUrls: ['./operations.page.scss'],
})
export class OperationsPage  {
  operations: Operation[] | any;
  soldePrincipal: number = 0;


  constructor(private sqlsev: SqlService,
              private modalController: ModalController,
              private actionSheetController: ActionSheetController,
              private translateService:TranslateService) {}


  ionViewWillEnter() {
    this.loadOperations();
    this.getSolde();
  }

  async openModal() {
    const actionSheet = await this.actionSheetController.create({
      header: this.translateService.instant('operations.header'), // Traduction pour l'en-tête
      buttons: [
        {
          text: this.translateService.instant('operations.deposit'),
          handler: () => {
            this.presentModal('Depot');
          },
        },
        {
          text: this.translateService.instant('operations.withdrawal'),
          handler: () => {
            this.presentModal('Retrait');
          },
        },
        {
          text: this.translateService.instant('operations.loan'),
          handler: () => {
            this.presentModal('Pret');
          },
        },
        {
          text: this.translateService.instant('operations.borrowing'),
          handler: () => {
            this.presentModal('Emprunt');
          },
        },
        {
          text: this.translateService.instant('operations.savings'),
          handler: () => {
            this.presentModal('Epargne');
          },
        },
        {
          text: this.translateService.instant('buttons.cancel'),
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

