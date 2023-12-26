import { Component, OnInit } from '@angular/core';
import { OperationService } from '../services/operation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage  {

  dailyTotals: any[] = [];
  weeklyTotals: any[] = [];

  constructor(private operationService: OperationService) {}

  ionViewWillEnter() {
    this.loadTotals();
  }

  async loadTotals() {
    this.dailyTotals = await this.operationService.getDailyTotals();
    this.weeklyTotals = await this.operationService.getWeeklyTotals();
    // Ajoutez d'autres appels de méthode pour les totaux mensuels, annuels, etc.
  }
  
}
