import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SqlService } from 'src/app/service/providers/sql.service';
import { Chart, registerables } from 'chart.js';
import { Totals } from 'src/app/models/Totals';
import { UserSettingService } from 'src/app/service/autres/user-setting.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('pieChart') pieChart: ElementRef | any;
  pieChartInstance: Chart<'pie', number[], string> | undefined;
  soldePrincipal: number = 0;
  totals!: Totals;
  private refreshInterval: any;
  soldeepargne!: string|number;
  showSoldePrincipal: boolean = true;
  userName!: string;

  constructor(private sqlserv: SqlService, private navCtrl: NavController,private userserv:UserSettingService) {
    // Enregistrer les composants de Chart.js
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.refreshSoldes();
    this.refreshInterval = setInterval(() => this.refreshSoldes(), 5000);
    this.userName = this.userserv.getUserName();
  }

  ngAfterViewInit() {
    this.initializeChart();
  }
  //visibilité du solde
  toggleSoldePrincipalVisibility() {
    this.showSoldePrincipal = !this.showSoldePrincipal;
  }

  async refreshSoldes() {
    try {
      this.soldePrincipal = await this.sqlserv.getSoldePrincipal();
      this.totals = await this.sqlserv.getTotalsByOperationType();
      this.updateChart();
    } catch (err) {
      console.error('Erreur lors de la récupération des soldes', err);
    }
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  initializeChart() {
    this.pieChartInstance = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Dépôt', 'Retrait', 'Emprunt', 'Prêt', 'Épargne'],
        datasets: [{
          label: 'Répartition des opérations',
          data: [0, 0, 0, 0, 0], // Valeurs initiales
          backgroundColor: [
            'red', 'blue', 'yellow', 'green', 'purple' // Couleurs pour chaque catégorie
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  updateChart() {
    if (this.totals && this.pieChartInstance) {
      this.pieChartInstance.data.datasets[0].data = [
        this.totals.Depot,
        this.totals.Retrait,
        this.totals.Emprunt,
        this.totals.Pret,
        this.totals.Epargne
      ];
      this.pieChartInstance.update();
    }
  }



  goToProfile() {
    this.navCtrl.navigateForward('/profil');
  }

}
