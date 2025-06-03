import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaBrazoPageRoutingModule } from './area-brazo-routing.module';

import { AreaBrazoPage } from './area-brazo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaBrazoPageRoutingModule,
    AreaBrazoPage
  ],
 // declarations: [AreaBrazoPage]
})
export class AreaBrazoPageModule {}
