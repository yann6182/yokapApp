import { Component, OnInit } from '@angular/core';
import { Totals } from 'src/app/models/Totals';
import { UserSettingService } from 'src/app/service/autres/user-setting.service';
import { SqlService } from 'src/app/service/providers/sql.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  totals!: Totals;



  constructor(private sqlService: SqlService) {}

  ngOnInit() {
    this.sqlService.getTotalsByOperationType().then(totals => {
      this.totals = totals;
    }).catch(error => {
      console.error('Erreur lors de la récupération des totaux', error);
    });

  }
}
