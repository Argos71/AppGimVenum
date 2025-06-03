import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaPechoPageRoutingModule } from './area-pecho-routing.module';

import { AreaPechoPage } from './area-pecho.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaPechoPageRoutingModule,
    AreaPechoPage
  ],
  //declarations: [AreaPechoPage]
})
export class AreaPechoPageModule {}
