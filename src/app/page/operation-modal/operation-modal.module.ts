import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperationModalPageRoutingModule } from './operation-modal-routing.module';

import { OperationModalPage } from './operation-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperationModalPageRoutingModule
  ],
  declarations: [OperationModalPage]
})
export class OperationModalPageModule {}
