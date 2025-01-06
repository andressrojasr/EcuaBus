import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTravelsPage } from './create-travels.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTravelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTravelsPageRoutingModule {}
