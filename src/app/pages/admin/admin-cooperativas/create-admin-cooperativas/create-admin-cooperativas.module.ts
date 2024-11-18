import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAdminCooperativasPageRoutingModule } from './create-admin-cooperativas-routing.module';

import { CreateAdminCooperativasPage } from './create-admin-cooperativas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAdminCooperativasPageRoutingModule
  ],
  declarations: [CreateAdminCooperativasPage]
})
export class CreateAdminCooperativasPageModule {}
