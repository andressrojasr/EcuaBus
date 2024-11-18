import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAdminCooperativasPage } from './create-admin-cooperativas.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAdminCooperativasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAdminCooperativasPageRoutingModule {}
