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
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
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
export class AuthPage {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
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
        .signIn(this.form.value as User)
        .then((res) => {

          this.getUserInfo(res.user.uid);

        })
        .catch((error) => {
          console.log(error);

          this.utilsSvc.presentToast({
            message: 'Las credenciales ingresadas son invalidas',
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

  //=====Obtener informacion de usuario=========
  async getUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      
      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          
          this.utilsSvc.saveInLocalStorage('user', user);
          this.utilsSvc.routerLink('/main/home');
          this.form.reset();

           this.utilsSvc.presentToast({
            message: `Te damos la bienvenida ${user?.nombre || 'usuario'}`,
            duration: 1500,
            color: 'danger',
            position: 'middle',
            icon: 'person-circle-outline',
          });

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
