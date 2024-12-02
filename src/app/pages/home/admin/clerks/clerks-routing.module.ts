import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClerksPage } from './clerks.page';

const routes: Routes = [
  {
    path: '',
    component: ClerksPage
  },  {
    path: 'create-clerk',
    loadChildren: () => import('./create-clerk/create-clerk.module').then( m => m.CreateClerkPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClerksPageRoutingModule {}
