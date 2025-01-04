import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCollectorPageRoutingModule } from './create-collector-routing.module';

import { CreateCollectorPage } from './create-collector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCollectorPageRoutingModule
  ],
  declarations: [CreateCollectorPage]
})
export class CreateCollectorPageModule {}
