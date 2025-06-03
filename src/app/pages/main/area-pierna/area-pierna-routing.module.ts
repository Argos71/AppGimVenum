import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaPiernaPage } from './area-pierna.page';

const routes: Routes = [
  {
    path: '',
    component: AreaPiernaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaPiernaPageRoutingModule {}
