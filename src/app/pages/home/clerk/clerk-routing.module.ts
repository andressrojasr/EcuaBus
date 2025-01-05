import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClerkPage } from './clerk.page';

const routes: Routes = [
  {
    path: '',
    component: ClerkPage
  },  {
    path: 'trips',
    loadChildren: () => import('./trips/trips.module').then( m => m.TripsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClerkPageRoutingModule {}
