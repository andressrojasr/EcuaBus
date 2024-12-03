import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaquillerosPage } from './taquilleros.page';

const routes: Routes = [
  {
    path: '',
    component: TaquillerosPage
  },  {
    path: 'create-taquillero',
    loadChildren: () => import('./create-taquillero/create-taquillero.module').then( m => m.CreateTaquilleroPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaquillerosPageRoutingModule {}
