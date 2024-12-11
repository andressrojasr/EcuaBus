import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateFrecuencyPage } from './create-frecuency.page';

const routes: Routes = [
  {
    path: '',
    component: CreateFrecuencyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateFrecuencyPageRoutingModule {}
