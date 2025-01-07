import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCollectorPageRoutingModule } from './create-collector-routing.module';

import { CreateCollectorPage } from './create-collector.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule,
    CreateCollectorPageRoutingModule
  ],
  declarations: [CreateCollectorPage]
})
export class CreateCollectorPageModule {}
