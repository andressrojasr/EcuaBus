import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminCooperativasPageRoutingModule } from './admin-cooperativas-routing.module';

import { AdminCooperativasPage } from './admin-cooperativas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminCooperativasPageRoutingModule
  ],
  declarations: [AdminCooperativasPage]
})
export class AdminCooperativasPageModule {}
