import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusPage } from './bus.page';

const routes: Routes = [
  {
    path: '',
    component: BusPage
  },  {
    path: 'create-bus',
    loadChildren: () => import('./create-bus/create-bus.module').then( m => m.CreateBusPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusPageRoutingModule {}
