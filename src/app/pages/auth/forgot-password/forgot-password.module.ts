import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

import { ForgotPasswordPage } from './forgot-password.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ForgotPasswordPageRoutingModule,
    ForgotPasswordPage     // Aquí IMPORTAR el componente standalone
  ],
  // Quitar declarations
  // declarations: [ForgotPasswordPage]  <-- eliminar esta línea
})
export class ForgotPasswordPageModule {}
