import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTaquilleroPage } from './create-taquillero.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTaquilleroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTaquilleroPageRoutingModule {}
