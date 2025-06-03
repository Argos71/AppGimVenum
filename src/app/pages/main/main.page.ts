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
import { Router } from '@angular/router';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  standalone: true,
  selector: 'app-sign-up',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LogoComponent,
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    CustomInputComponent,
  ],
})
export class MainPage {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    edad: new FormControl('', [Validators.required, Validators.minLength(1)]),
    FechaIncripcion: new FormControl('', [Validators.required]),
    FechaFinalizacion: new FormControl('', [Validators.required]),
    mesesInscripcion: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    peso: new FormControl('', [Validators.required, Validators.minLength(1)]),
    estatura: new FormControl('', [Validators.required, Validators.minLength(1)]),
    planNutricional: new FormControl('', [Validators.required]),
    tipoMembresia: new FormControl('', [Validators.required]),

  });
  constructor(private router: Router) {} // <- aquí se inyecta el router correctamente

  firebaseSvc = inject(FirebaseService);

  utilsSvc = inject(UtilsService);

  //REDIRECCIONES DE BOTONES
  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']); // <- uso correcto de this.router
  }

  goToSignUp() {
    this.router.navigate(['/auth/sign-up']); // <- uso correcto de this.router
  }

  //CALCULAR FECHA DE FINALIZACION
  calcularFechaFinalizacion() {
  const fechaInscripcion = this.form.get('FechaIncripcion')?.value;
  const meses = this.form.get('mesesInscripcion')?.value;

  if (fechaInscripcion && meses) {
    const fecha = new Date(fechaInscripcion);
    fecha.setMonth(fecha.getMonth() + Number(meses));
    // Formatear a yyyy-mm-dd para que el input date lo acepte
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const dd = String(fecha.getDate()).padStart(2, '0');
    const fechaFinal = `${yyyy}-${mm}-${dd}`;

    this.form.get('FechaFinalizacion')?.setValue(fechaFinal);
  } else {
    this.form.get('FechaFinalizacion')?.setValue('');
  }
}

  //sUBMIT
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signUp(this.form.value as User)
        .then(async res => {
          await this.firebaseSvc.updateUser(this.form.value.nombre);
          
          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);
          this.setUserInfo(uid);
          
          
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

  //=====Establecer informacion de usuario=========
  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      delete this.form.value.password;

      this.firebaseSvc
        .setDocument(path, this.form.value)
        .then(async res => {
          
          this.utilsSvc.saveInLocalStorage('user', this.form.value)
          this.utilsSvc.routerLink('/main/home');
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
