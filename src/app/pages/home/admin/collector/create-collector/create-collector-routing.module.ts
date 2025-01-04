import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCollectorPage } from './create-collector.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCollectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCollectorPageRoutingModule {}
