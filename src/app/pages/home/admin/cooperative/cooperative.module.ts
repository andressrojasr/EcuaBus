import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CooperativePageRoutingModule } from './cooperative-routing.module';

import { CooperativePage } from './cooperative.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    CooperativePageRoutingModule
  ],
  declarations: [CooperativePage]
})
export class CooperativePageModule {}
