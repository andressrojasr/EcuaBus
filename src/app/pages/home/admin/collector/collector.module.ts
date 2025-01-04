import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectorPageRoutingModule } from './collector-routing.module';

import { CollectorPage } from './collector.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    CollectorPageRoutingModule
  ],
  declarations: [CollectorPage]
})
export class CollectorPageModule {}
