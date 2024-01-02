import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { Subscription } from 'rxjs';

import { Chart } from 'chart.js';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  public themeColor = [
    { name: 'Default', class: 'default' },
    { name: 'Dark', class: 'dark-theme' },
    { name: 'Purple', class: 'purple' },
    { name: 'Medium', class: 'mediumTheme' }
   ];

  @ViewChild('barChart') barChart!: ElementRef;

 
  public selectTheme;
  
  dynamicTheme() {
    this.theme.activeTheme(this.selectTheme);
  }


  async createBarChart() {
    const ctx = this.barChart.nativeElement.getContext('2d');
    const { labels, data } = await this.sqliteService.getChartData();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Statistiques',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  operationTypes: string[] = ['Epargne', 'Depot', 'Retrait', 'Pret', 'Emprunt'];
  soldes: any;
  soldesSubscription: Subscription | any;

  dailyTotals: any[] = [];
  weeklyTotals: any[] = [];
  incomeTotal: number = 0;
  mainBalance: number = 0;
  totalByType: number = 0;

  constructor(private sqliteService: SqliteService, private theme: ThemeService) {
    this.selectTheme = 'default';
    this.dynamicTheme()
  }

  ngOnInit(): void {
    this.soldesSubscription = this.sqliteService.soldes$.subscribe(soldes => {
      this.soldes = soldes;
      this.loadTotals(); // Charger les totaux à chaque mise à jour des soldes
    });
  }
  ionViewWillEnter() {
    this.loadTotals();
    this.createBarChart();

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
