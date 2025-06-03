import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreasIntermedioPage } from './areas-intermedio.page';

const routes: Routes = [
  {
    path: '',
    component: AreasIntermedioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreasIntermedioPageRoutingModule {}
