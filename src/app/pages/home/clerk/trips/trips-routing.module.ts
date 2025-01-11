import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripsPage } from './trips.page';

const routes: Routes = [
  {
    path: '',
    component: TripsPage
  },  {
    path: 'create-trip',
    loadChildren: () => import('./create-trip/create-trip.module').then( m => m.CreateTripPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripsPageRoutingModule {}
