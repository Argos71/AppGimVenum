import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPage } from './sign-up.page'; // 👈 Asegúrate de que este archivo tenga standalone: true
import { SignUpPageRoutingModule } from './sign-up-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignUpPageRoutingModule,
    SignUpPage // ✅ IMPORTA el componente standalone
  ]
  // declarations: [SignUpPage] ❌ Elimina esto si es standalone
})
export class SignUpPageModule {}
