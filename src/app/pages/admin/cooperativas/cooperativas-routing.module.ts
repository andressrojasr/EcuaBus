import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CooperativasPage } from './cooperativas.page';

const routes: Routes = [
  {
    path: '',
    component: CooperativasPage
  },  {
    path: 'create-cooperativa',
    loadChildren: () => import('./create-cooperativa/create-cooperativa.module').then( m => m.CreateCooperativaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CooperativasPageRoutingModule {}
