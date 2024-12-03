import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTaquilleroPageRoutingModule } from './create-taquillero-routing.module';

import { CreateTaquilleroPage } from './create-taquillero.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    CreateTaquilleroPageRoutingModule
  ],
  declarations: [CreateTaquilleroPage]
})
export class CreateTaquilleroPageModule {}
