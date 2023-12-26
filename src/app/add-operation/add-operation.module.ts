import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOperationPageRoutingModule } from './add-operation-routing.module';

import { AddOperationPage } from './add-operation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOperationPageRoutingModule
  ],
  declarations: [AddOperationPage]
})
export class AddOperationPageModule {}
