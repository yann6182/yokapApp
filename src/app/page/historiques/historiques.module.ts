import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


import { IonicModule } from '@ionic/angular';

import { HistoriquesPageRoutingModule } from './historiques-routing.module';

import { HistoriquesPage } from './historiques.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    HistoriquesPageRoutingModule
  ],
  declarations: [HistoriquesPage]
})
export class HistoriquesPageModule {}
