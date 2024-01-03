import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HistoriquesPage } from './historiques.page';

const routes: Routes = [
  {
    path: '',
    component: HistoriquesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),IonicModule],
  exports: [RouterModule],
})
export class HistoriquesPageRoutingModule {}
