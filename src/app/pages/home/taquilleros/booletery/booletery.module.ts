import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BooleteryPageRoutingModule } from './booletery-routing.module';

import { BooleteryPage } from './booletery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BooleteryPageRoutingModule
  ],
  declarations: [BooleteryPage]
})
export class BooleteryPageModule {}
