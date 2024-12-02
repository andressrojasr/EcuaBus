import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClerksPageRoutingModule } from './clerks-routing.module';

import { ClerksPage } from './clerks.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClerksPageRoutingModule,
    SharedModule
  ],
  declarations: [ClerksPage]
})
export class ClerksPageModule {}
