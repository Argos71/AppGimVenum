import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'contacts',
    loadChildren: () => import('./contacts/contacts.module').then( m => m.ContactsPageModule)
  },
  {
    path: 'plan-nutricional',
    loadChildren: () => import('./plan-nutricional/plan-nutricional.module').then( m => m.PlanNutricionalPageModule)
  },
  {
    path: 'categoria-entrenamientos',
    loadChildren: () => import('./categoria-entrenamientos/categoria-entrenamientos.module').then( m => m.CategoriaEntrenamientosPageModule)
  },
    {
    path: 'area-pecho',
    loadChildren: () => import('./area-pecho/area-pecho.module').then( m => m.AreaPechoPageModule)
  },
  {
    path: 'area-pierna',
    loadChildren: () => import('./area-pierna/area-pierna.module').then( m => m.AreaPiernaPageModule)
  },
  {
    path: 'area-brazo',
    loadChildren: () => import('./area-brazo/area-brazo.module').then( m => m.AreaBrazoPageModule)
  },
  {
    path: 'area-abdomen',
    loadChildren: () => import('./area-abdomen/area-abdomen.module').then( m => m.AreaAbdomenPageModule)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./reportes/reportes.page').then( m => m.ReportesPage)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
