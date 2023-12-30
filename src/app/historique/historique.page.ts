import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.page.html',
  styleUrls: ['./historique.page.scss'],
})
export class HistoriquePage implements OnInit, OnDestroy {

  operationTypes: string[] = ['Epargne', 'Depot', 'Retrait', 'Pret', 'Emprunt'];
  historique: any[] = [];
  historiqueSubscription: Subscription | any;

  constructor(private sqliteService: SqliteService) {}

  ngOnInit(): void {
    this.historiqueSubscription = this.sqliteService.soldes$.subscribe(() => {
      // Mettez à jour l'historique en fonction des changements dans les soldes
      this.loadHistorique();
    });

    // Chargez initialement l'historique
    this.loadHistorique();
  }
  ionViewWillEnter() {
    this.loadHistorique();
  }
  ngOnDestroy() {
    this.historiqueSubscription.unsubscribe();
  }

  async loadHistorique() {
    // Supposons que vous souhaitez afficher l'historique pour le type 'income'
    const typeToDisplay = 'income';

    try {
      this.historique = await this.sqliteService.getTransactionHistoryByType(typeToDisplay);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des transactions', error);
    }
  }

}
