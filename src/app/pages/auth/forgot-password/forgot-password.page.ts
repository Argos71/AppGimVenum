import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [
    LogoComponent,
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    CustomInputComponent,
  ],
})


export class ForgotPasswordPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(private router: Router) {} // <- aquí se inyecta el router correctamente

  firebaseSvc = inject(FirebaseService);

  utilsSvc = inject(UtilsService);

  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']); // <- uso correcto de this.router
  }

  goToSignUp() {
    this.router.navigate(['/auth/sign-up']); // <- uso correcto de this.router
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          this.utilsSvc.presentToast({
            message: 'Correo Enviado con exito',
            duration: 1500,
            color: 'danger',
            position: 'middle',
            icon: 'mail-outline',
          });

          this.utilsSvc.routerLink('/auth');
          this.form.reset();

        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
