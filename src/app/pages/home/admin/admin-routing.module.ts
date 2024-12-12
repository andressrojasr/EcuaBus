import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'bus',
    loadChildren: () => import('./bus/bus.module').then( m => m.BusPageModule)
  },
  {
    path: 'partners',
    loadChildren: () => import('./partners/partners.module').then( m => m.PartnersPageModule)
  },
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then( m => m.DriversPageModule)
  },  {
    path: 'clerks',
    loadChildren: () => import('./clerks/clerks.module').then( m => m.ClerksPageModule)
  },
  {
    path: 'taquilleros',
    loadChildren: () => import('./taquilleros/taquilleros.module').then( m => m.TaquillerosPageModule)
  },
  {
    path: 'frecuencies',
    loadChildren: () => import('./frecuencies/frecuencies.module').then( m => m.FrecuenciesPageModule)
  },
  {
    path: 'cooperative',
    loadChildren: () => import('./cooperative/cooperative.module').then( m => m.CooperativePageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
