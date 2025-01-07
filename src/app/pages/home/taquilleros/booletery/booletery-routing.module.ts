import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BooleteryPage } from './booletery.page';

const routes: Routes = [
  {
    path: '',
    component: BooleteryPage
  },  {
    path: 'trip',
    loadChildren: () => import('./trip/trip.module').then( m => m.TripPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooleteryPageRoutingModule {}
