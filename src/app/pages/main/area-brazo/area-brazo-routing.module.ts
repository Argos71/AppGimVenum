import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaBrazoPage } from './area-brazo.page';

const routes: Routes = [
  {
    path: '',
    component: AreaBrazoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaBrazoPageRoutingModule {}
