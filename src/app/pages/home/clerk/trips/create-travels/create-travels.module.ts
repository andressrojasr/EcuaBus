import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTravelsPageRoutingModule } from './create-travels-routing.module';

import { CreateTravelsPage } from './create-travels.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateTravelsPageRoutingModule,

    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [CreateTravelsPage]
})
export class CreateTravelsPageModule {}
