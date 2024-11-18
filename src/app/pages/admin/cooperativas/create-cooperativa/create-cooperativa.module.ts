import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCooperativaPageRoutingModule } from './create-cooperativa-routing.module';

import { CreateCooperativaPage } from './create-cooperativa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCooperativaPageRoutingModule
  ],
  declarations: [CreateCooperativaPage]
})
export class CreateCooperativaPageModule {}
