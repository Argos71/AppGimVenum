import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaAbdomenPage } from './area-abdomen.page';

const routes: Routes = [
  {
    path: '',
    component: AreaAbdomenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaAbdomenPageRoutingModule {}
