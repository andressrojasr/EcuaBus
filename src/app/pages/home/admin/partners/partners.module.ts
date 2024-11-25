import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartnersPageRoutingModule } from './partners-routing.module';

import { PartnersPage } from './partners.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartnersPageRoutingModule,
    SharedModule
  ],
  declarations: [PartnersPage]
})
export class PartnersPageModule {}
