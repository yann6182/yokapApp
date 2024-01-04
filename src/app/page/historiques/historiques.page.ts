import { Component, OnInit } from '@angular/core';
import { Operation } from 'src/app/models/operations';
import { SqlService } from 'src/app/service/providers/sql.service';

@Component({
  selector: 'app-historiques',
  templateUrl: './historiques.page.html',
  styleUrls: ['./historiques.page.scss'],
})
export class HistoriquesPage  {
  operations :Operation [] = []

  constructor(private sqlserv:SqlService) { }

  ionViewWillEnter() {
    this.loadOperations();
  }

  loadOperations() {
    this.sqlserv.getOperations().then(data => {
      this.operations = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }).catch(err => {
      console.error('Erreur lors du chargement des opérations', err);
    });
   }

  getIconName(type: string): string {
    switch (type.toLowerCase()) {
      case 'depot':
        return 'arrow-up';
      case 'emprunt':
        return 'arrow-down';
      case 'retrait':
        return 'arrow-back';
      case 'pret':
        return 'cash';
      case 'epargne':
        return 'wallet';
      default:
        return 'help-circle';
    }
  }



}
