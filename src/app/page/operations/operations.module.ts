import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { OperationsPageRoutingModule } from './operations-routing.module';

import { OperationsPage } from './operations.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    OperationsPageRoutingModule
  ],
  declarations: [OperationsPage]
})
export class OperationsPageModule {}
