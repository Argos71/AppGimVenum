import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriaEntrenamientosPageRoutingModule } from './categoria-entrenamientos-routing.module';

import { CategoriaEntrenamientosPage } from './categoria-entrenamientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriaEntrenamientosPageRoutingModule,
    CategoriaEntrenamientosPage
  ],
  //declarations: [CategoriaEntrenamientosPage]
})
export class CategoriaEntrenamientosPageModule {}
