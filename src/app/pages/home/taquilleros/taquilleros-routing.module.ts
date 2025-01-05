import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaquillerosPage } from './taquilleros.page';

const routes: Routes = [
  {
    path: '',
    component: TaquillerosPage
  },  {
    path: 'booletery',
    loadChildren: () => import('./booletery/booletery.module').then( m => m.BooleteryPageModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./tickets/tickets.module').then( m => m.TicketsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaquillerosPageRoutingModule {}
