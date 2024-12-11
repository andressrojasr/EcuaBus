import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateFrecuencyPageRoutingModule } from './create-frecuency-routing.module';

import { CreateFrecuencyPage } from './create-frecuency.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    CreateFrecuencyPageRoutingModule
  ],
  declarations: [CreateFrecuencyPage]
})
export class CreateFrecuencyPageModule {}
