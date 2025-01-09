import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusMapPage } from './bus-map.page';

const routes: Routes = [
  {
    path: '',
    component: BusMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusMapPageRoutingModule {}
