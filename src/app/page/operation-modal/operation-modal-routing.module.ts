import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperationModalPage } from './operation-modal.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: OperationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule,],
  exports: [RouterModule],
})
export class OperationModalPageRoutingModule {}
