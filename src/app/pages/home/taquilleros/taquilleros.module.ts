import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaquillerosPageRoutingModule } from './taquilleros-routing.module';

import { TaquillerosPage } from './taquilleros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaquillerosPageRoutingModule
  ],
  declarations: [TaquillerosPage]
})
export class TaquillerosPageModule {}
