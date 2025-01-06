import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TravelsPageRoutingModule } from './travels-routing.module';

import { TravelsPage } from './travels.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelsPageRoutingModule,

    SharedModule,
  ],
  declarations: [TravelsPage]
})
export class TravelsPageModule {}
