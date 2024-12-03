import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaquillerosPageRoutingModule } from './taquilleros-routing.module';

import { TaquillerosPage } from './taquilleros.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    TaquillerosPageRoutingModule
  ],
  declarations: [TaquillerosPage]
})
export class TaquillerosPageModule {}
