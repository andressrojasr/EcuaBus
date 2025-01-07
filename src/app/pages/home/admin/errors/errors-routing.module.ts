import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsPage } from './errors.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsPageRoutingModule {}
