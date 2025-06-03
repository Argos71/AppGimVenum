import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriaEntrenamientosPage } from './categoria-entrenamientos.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriaEntrenamientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriaEntrenamientosPageRoutingModule {}
