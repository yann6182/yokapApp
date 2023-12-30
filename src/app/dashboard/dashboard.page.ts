import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  operationTypes: string[] = ['Epargne', 'Depot', 'Retrait', 'Pret', 'Emprunt'];
  soldes: any;
  soldesSubscription: Subscription | any;

  dailyTotals: any[] = [];
  weeklyTotals: any[] = [];
  incomeTotal: number = 0;
  mainBalance: number = 0;
  totalByType: number = 0;

  constructor(private sqliteService: SqliteService) {}

  ngOnInit(): void {
    this.soldesSubscription = this.sqliteService.soldes$.subscribe(soldes => {
      this.soldes = soldes;
      this.loadTotals(); // Charger les totaux à chaque mise à jour des soldes
    });
  }
  ionViewWillEnter() {
    this.loadTotals();
  }

  ngOnDestroy() {
    this.soldesSubscription.unsubscribe();
  }

  async loadTotals() {
    this.dailyTotals = await this.sqliteService.getDailyTotals();
    this.weeklyTotals = await this.sqliteService.getWeeklyTotals();
    this.totalByType = await this.sqliteService.getTotalByType('income');
    this.incomeTotal = await this.sqliteService.calculateTotal('income');
    this.mainBalance = await this.sqliteService.getMainBalance();
    // Ajoutez d'autres appels de méthode pour les totaux mensuels, annuels, etc.
  }
}
