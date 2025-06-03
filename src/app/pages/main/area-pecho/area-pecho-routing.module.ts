import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaPechoPage } from './area-pecho.page';

const routes: Routes = [
  {
    path: '',
    component: AreaPechoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaPechoPageRoutingModule {}
