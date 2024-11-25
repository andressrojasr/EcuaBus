import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePartnerPage } from './create-partner.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePartnerPageRoutingModule {}
