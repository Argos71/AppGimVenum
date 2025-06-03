import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaPiernaPageRoutingModule } from './area-pierna-routing.module';

import { AreaPiernaPage } from './area-pierna.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaPiernaPageRoutingModule,
    AreaPiernaPage
  ],
  //declarations: [AreaPiernaPage]
})
export class AreaPiernaPageModule {}
