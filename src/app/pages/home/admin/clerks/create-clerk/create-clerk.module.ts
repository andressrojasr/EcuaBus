import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateClerkPageRoutingModule } from './create-clerk-routing.module';

import { CreateClerkPage } from './create-clerk.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateClerkPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateClerkPage]
})
export class CreateClerkPageModule {}
