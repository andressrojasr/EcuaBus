import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriversPage } from './drivers.page';

const routes: Routes = [
  {
    path: '',
    component: DriversPage
  },  {
    path: 'create-driver',
    loadChildren: () => import('./create-driver/create-driver.module').then( m => m.CreateDriverPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriversPageRoutingModule {}
