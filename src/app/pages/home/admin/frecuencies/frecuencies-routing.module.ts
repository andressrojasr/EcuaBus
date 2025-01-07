import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrecuenciesPage } from './frecuencies.page';

const routes: Routes = [
  {
    path: '',
    component: FrecuenciesPage
  }, 
  {
    path: 'create-frecuency',
    loadChildren: () => import('./create-frecuency/create-frecuency.module').then( m => m.CreateFrecuencyPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrecuenciesPageRoutingModule {}
