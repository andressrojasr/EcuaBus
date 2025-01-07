import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BooleteryPageRoutingModule } from './booletery-routing.module';

import { BooleteryPage } from './booletery.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    BooleteryPageRoutingModule
  ],
  declarations: [BooleteryPage]
})
export class BooleteryPageModule {}
