import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateBusPage } from './create-bus.page';

const routes: Routes = [
  {
    path: '',
    component: CreateBusPage
  },  {
    path: 'bus-map',
    loadChildren: () => import('./bus-map/bus-map.module').then( m => m.BusMapPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateBusPageRoutingModule {}
