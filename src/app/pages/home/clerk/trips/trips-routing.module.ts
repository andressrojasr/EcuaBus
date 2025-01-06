import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripsPage } from './trips.page';

const routes: Routes = [
  {
    path: '',
    component: TripsPage
  },  {
    path: 'create-travels',
    loadChildren: () => import('./create-travels/create-travels.module').then( m => m.CreateTravelsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsPageRoutingModule {}
