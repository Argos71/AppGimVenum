import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreasPrincipiantePageRoutingModule } from './areas-principiante-routing.module';

import { AreasPrincipiantePage } from './areas-principiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreasPrincipiantePageRoutingModule,
    AreasPrincipiantePage
  ],
 // declarations: [AreasPrincipiantePage]
})
export class AreasPrincipiantePageModule {}
