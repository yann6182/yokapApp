import { Component, OnInit } from '@angular/core';
import { SqlService } from 'src/app/service/providers/sql.service';
import { Operation } from 'src/app/models/operations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.page.html',
  styleUrls: ['./reglages.page.scss'],
})
export class ReglagesPage implements OnInit {

  operations: Operation[] = [];
  solde: number = 0;

  constructor(private sqlserv: SqlService,private translate:TranslateService) {}

  ngOnInit() {
    this.loadOperations();
  }

  async loadOperations() {
    // Charger les opérations
    this.sqlserv.getOperations().then(ops => {
      this.operations = ops;

    }).catch(err => {
      console.error('Erreur lors du chargement des opérations', err);
    });

    // Récupérer le solde principal
    try {
      this.solde = await this.sqlserv.getSoldePrincipal();
    } catch (err) {
      console.error('Erreur lors de la récupération du solde principal', err);
    }
  }



  changeLanguage(language: string) {
    this.translate.use(language);
  }
}
