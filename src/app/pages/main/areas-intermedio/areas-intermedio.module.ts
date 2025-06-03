import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreasIntermedioPageRoutingModule } from './areas-intermedio-routing.module';

import { AreasIntermedioPage } from './areas-intermedio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreasIntermedioPageRoutingModule,
    AreasIntermedioPage
  ],
  //declarations: [AreasIntermedioPage]
})
export class AreasIntermedioPageModule {}
