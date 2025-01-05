import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TripPage } from './trip.page';

const routes: Routes = [
  {
    path: '',
    component: TripPage
  },  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets.module').then( m => m.TicketsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripPageRoutingModule {}
