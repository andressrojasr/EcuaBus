import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelsPage } from './travels.page';

const routes: Routes = [
  {
    path: '',
    component: TravelsPage
  },  {
    path: 'create-travels',
    loadChildren: () => import('./create-travels/create-travels.module').then( m => m.CreateTravelsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelsPageRoutingModule {}
