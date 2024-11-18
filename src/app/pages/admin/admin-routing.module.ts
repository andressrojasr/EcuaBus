import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },  {
    path: 'cooperativas',
    loadChildren: () => import('./cooperativas/cooperativas.module').then( m => m.CooperativasPageModule)
  },
  {
    path: 'admin-cooperativas',
    loadChildren: () => import('./admin-cooperativas/admin-cooperativas.module').then( m => m.AdminCooperativasPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
