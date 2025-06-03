import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaAbdomenPageRoutingModule } from './area-abdomen-routing.module';

import { AreaAbdomenPage } from './area-abdomen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaAbdomenPageRoutingModule,
    AreaAbdomenPage
  ],
 // declarations: [AreaAbdomenPage]
})
export class AreaAbdomenPageModule {}
