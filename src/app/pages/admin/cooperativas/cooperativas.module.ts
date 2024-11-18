import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CooperativasPageRoutingModule } from './cooperativas-routing.module';

import { CooperativasPage } from './cooperativas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CooperativasPageRoutingModule
  ],
  declarations: [CooperativasPage]
})
export class CooperativasPageModule {}
