import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorsPageRoutingModule } from './errors-routing.module';

import { ErrorsPage } from './errors.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ErrorsPageRoutingModule
  ],
  declarations: [ErrorsPage]
})
export class ErrorsPageModule {}
