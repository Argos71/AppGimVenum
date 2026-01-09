import { Component, inject, Input, OnInit } from '@angular/core';
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
  selector: 'app-ediusu',
  standalone: true, // <- IMPORTANTE
  templateUrl: './ediusu.component.html',
  styleUrls: ['./ediusu.component.scss'],
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    CustomInputComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ], // <- IMPORTANTE
})
export class EdiusuComponent implements OnInit {
  @Input() user: User | null = null;

  form = new FormGroup({
    // Identificador único del usuario (no requiere validación)
    uid: new FormControl(''),

    

    email: new FormControl('', [
      Validators.required,
      // Prohíbe emails vacíos

      Validators.email,
      // Prohíbe formatos inválidos (ej: texto@, texto.com)
    ]),

    password: new FormControl('', Validators.required),
    // Prohíbe contraseñas vacías

    nombre: new FormControl('', [
      Validators.required,
      // Prohíbe nombres vacíos

      Validators.minLength(4),
      // Prohíbe nombres con menos de 4 caracteres
    ]),

    edad: new FormControl('', [
      Validators.required,
      // Prohíbe edad vacía

      Validators.pattern('^[0-9]{1,3}$'),
      // Prohíbe letras, decimales y números mayores a 3 dígitos
      // (permite valores entre 0 y 999 como texto)
    ]),

    FechaInscripcion: new FormControl('', Validators.required),
    // Prohíbe fechas de inscripción vacías

    FechaFinalizacion: new FormControl('', Validators.required),
    // Prohíbe fechas de finalización vacías

    genero: new FormControl('', Validators.required),
    // Prohíbe no seleccionar un género

    peso: new FormControl('', [
      Validators.required,
      // Prohíbe peso vacío

      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
      // Prohíbe letras y símbolos
      // Permite números enteros o decimales con hasta 2 decimales (ej: 70 o 70.50)
    ]),

    estatura: new FormControl('', [
      Validators.required,
      // Prohíbe estatura vacía

      Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
      // Prohíbe letras y símbolos
      // Permite decimales con hasta 2 cifras (ej: 1.75)
    ]),

    planNutricional: new FormControl('', Validators.required),
    // Prohíbe no seleccionar un plan nutricional

    mesesInscripcion: new FormControl('', [
      Validators.required,
      // Prohíbe meses de inscripción vacíos

      Validators.pattern('^[0-9]+$'),
      // Prohíbe letras y decimales
      // Permite únicamente números enteros positivos
    ]),

    tipoMembresia: new FormControl('', Validators.required),
    // Prohíbe valores fuera del tipo definido (Inscrito | Administrador)
  });

  constructor(private router: Router) {} // <- aquí se inyecta el router correctamente

  firebaseSvc = inject(FirebaseService);

  utilsSvc = inject(UtilsService);

  ngOnInit() {
    if (this.user) {
      // Populate form with existing user data for editing
      this.form.patchValue({
        uid: this.user.uid || '',
        email: this.user.email || '',
        nombre: this.user.nombre || '',
        edad: this.user.edad || '',
        FechaInscripcion: this.user.FechaInscripcion || '',
        FechaFinalizacion: this.user.FechaFinalizacion || '',
        genero: this.user.genero || '',
        peso: this.user.peso || '',
        estatura: this.user.estatura || '',
        planNutricional: this.user.planNutricional || '',
        mesesInscripcion: this.user.mesesInscripcion || '',
        tipoMembresia: this.user.tipoMembresia || ''
      });
      // Password is not populated for security reasons when editing
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }


  goToSignUp() {
    this.router.navigate(['/auth/sign-up']); // <- uso correcto de this.router
  }

  //CALCULAR FECHA DE FINALIZACION
  calcularFechaFinalizacion() {
    const fechaInscripcion = this.form.get('FechaInscripcion')?.value;
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

      if (this.user) {
        // Update existing user
        let path = `users/${this.user.uid}`;
        delete this.form.value.password;

        this.firebaseSvc
          .updateDocument(path, this.form.value)
          .then(async (res) => {
            this.utilsSvc.presentToast({
              message: 'Usuario actualizado exitosamente',
              duration: 2000,
              color: 'success',
              position: 'middle',
              icon: 'checkmark-circle-outline',
            });
            // Close modal after successful update
            this.utilsSvc.dismissModal();
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
      } else {
        // Create new user
        this.firebaseSvc
          .signUp(this.form.value as User)
          .then(async (res) => {
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
        .then(async (res) => {
          this.utilsSvc.saveInLocalStorage('user', this.form.value);
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
