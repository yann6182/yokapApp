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
      this.operations = data;
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
