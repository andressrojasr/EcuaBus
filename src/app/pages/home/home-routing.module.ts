import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './admin/admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },  {
    path: 'taquilleros',
    loadChildren: () => import('./taquilleros/taquilleros.module').then( m => m.TaquillerosPageModule)
  },
  {
    path: 'clerk',
    loadChildren: () => import('./clerk/clerk.module').then( m => m.ClerkPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
