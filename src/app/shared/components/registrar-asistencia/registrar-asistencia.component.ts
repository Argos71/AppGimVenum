import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { collection, getDocs } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-registrar-asistencia',
  standalone: true,
  templateUrl: './registrar-asistencia.component.html',
  styleUrls: ['./registrar-asistencia.component.scss'],
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class RegistrarAsistenciaComponent implements OnInit, OnDestroy {

  id: string = '';
  fechaActual: string = '';
  horaActual: string = '';
  private reloj!: any;

  form = new FormGroup({
    id: new FormControl(''),
    HoraAsistencia: new FormControl (''),
    FechaAsistencia: new FormControl(''),
  });

  
  constructor() { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  // ==========================
  // AGREGADO
  // ==========================

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');
    
    this.actualizarFechaHora();

    this.reloj = setInterval(() => {
      this.actualizarFechaHora();
    }, 1000);

  }

  ngOnDestroy() {
    if (this.reloj) {
      clearInterval(this.reloj);
    }
  }

  actualizarFechaHora() {
    const ahora = new Date();

    this.fechaActual = ahora.toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.horaActual = ahora.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

goRegistrarAsis() {
    this.utilsSvc.presentModal({ component: RegistrarAsistenciaComponent });
  }

  async registrarAsistencia() {

  const ahora = new Date();

  const fecha = ahora.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const hora = ahora.toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const path = `users/${this.user.uid}/asistencias`;

  try {

    // 1️⃣ Obtener asistencias existentes
    const ref = collection(getFirestore(), path);
    const snapshot = await getDocs(ref);

    const nextId = snapshot.size + 1;

    // 2️⃣ Setear valores en el formulario
    this.form.setValue({
      id: nextId.toString(), // ✔ SOLUCIÓN
      HoraAsistencia: hora,
      FechaAsistencia: fecha,
    });

    // 3️⃣ Guardar en Firebase
    await this.submit();

  } catch (error) {
    console.error(error);

    this.utilsSvc.presentToast({
      message: 'Error al registrar asistencia',
      duration: 2500,
      color: 'danger',
      position: 'middle',
      icon: 'alert-circle-outline',
    });
  }
}



  //sUBMIT
  async submit() {
    if (this.form.valid) {
      
      let path = `users/${this.user.uid}/asistencias`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
          
        this.utilsSvc.dismissModal({ success: true  });

        this.utilsSvc.presentToast({
            message: 'Asistencia registrada con éxito',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'checkmark-circle-outline',
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

  //=====Establecer informacion de usuario=========
  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      //delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
          
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
