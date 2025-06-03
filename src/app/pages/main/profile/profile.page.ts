import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonTitle } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular'; // <== IMPORTANTE
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SharedModule } from '../../../shared/shared.module';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonicModule, SharedModule], // <== Asegúrate de importar esto
})

export class ProfilePage implements OnInit {
  week: { name: string; date: string; isToday: boolean }[] = [];
  dayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  //Variables a exportar del la BD
  usuarioNombre: string = '';
  usuarioMembresia: string = '';
  usuarioPeso: number = 0;
  usuarioTalla: number = 0;
  usuarioInscripcion: string = '';
  usuarioMesesIns: string = '';
  usuarioFinalizacion: string = '';
  usuarioEdad: string = '';
  usuarioGenero: string = '';
  usuarioEmail: string = '';

  UsuarioImc: number = 0;
  UsuarioVasos: number = 0;

  //Constructor
  constructor(
    private menuCtrl: MenuController,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}
  ngOnInit(
  ) {
    //Fecha
    const today = new Date();
    const currentDayIndex = today.getDay();

    // Primer día de la semana (domingo)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayIndex);

    // Llenar array con 7 días (de domingo a sábado)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
      });

      this.week.push({
        name: this.dayNames[date.getDay()],
        date: formattedDate,
        isToday: date.toDateString() === today.toDateString(), // resaltar si es hoy
      });
    }

    //Calculadora de IMC

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const uid = user.uid;
        const path = `users/${uid}`;
        this.firebaseSvc.getDocument(path).then((userData: User) => {
          this.usuarioNombre = userData?.nombre || 'Usuario';
          this.usuarioMembresia = userData?.tipoMembresia || 'Usuario';
          this.usuarioPeso = Number(userData?.peso);
          this.usuarioTalla = Number(userData?.estatura);
          this.usuarioInscripcion = userData?.FechaInscripcion || 'Usuario';
          this.usuarioMesesIns = userData?.mesesInscripcion || 'Usuario'; 
          this.usuarioFinalizacion = userData?.FechaFinalizacion || 'Usuario';
          this.usuarioEdad = userData.edad;
          this.usuarioGenero = userData.genero;
          this.usuarioEmail = userData.email;


          this.calcularIMC();
          this.calcularVasos();
        });
      }
    });
  }
  //Calculadora de IMC
  calcularIMC() {
    const alturaMetros = this.usuarioTalla / 100;
    this.UsuarioImc = +(
      this.usuarioPeso /
      (alturaMetros * alturaMetros)
    ).toFixed(2);
  }

  calcularVasos() {
    const mlPorDia = this.usuarioPeso * 35;
    this.UsuarioVasos = Math.round(mlPorDia / 250);
  }

 
  goCategoria() {
    this.router.navigate(['/main/categoria-entrenamientos']); // <- uso correcto de this.router
  }

  goContactos() {
    this.router.navigate(['/main/contacts']); // <- uso correcto de this.router
  }
  goToSignUp() {
    this.router.navigate(['/main']); // <- uso correcto de this.router
  }
  goProfile() {
  location.replace('/main/profile');
}


   goAyuda() {
    
    this.router.navigate(['/main/profile']); // <- uso correcto de this.router
  }
   goConfiguracion() {
    this.router.navigate(['/main/profile']); // <- uso correcto de this.router
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }
async openLeftMenu() {
  try {
    const isOpen = await this.menuCtrl.isOpen('left-menu');
    if (!isOpen) {
      await this.menuCtrl.close(); // cierra cualquier otro menú
      await this.menuCtrl.open('left-menu');
    }
  } catch (error) {
    console.error('Error al abrir el menú izquierdo:', error);
  }
}

async openRightMenu() {
  try {
    const isOpen = await this.menuCtrl.isOpen('right-menu');
    if (!isOpen) {
      await this.menuCtrl.close();
      await this.menuCtrl.open('right-menu');
    }
  } catch (error) {
    console.error('Error al abrir el menú derecho:', error);
  }
}



  
  //borrador
  verPerfil() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('srcapppagesmainprofile');
  }

  verAreas() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('srcapppagesmainprofile');
  }

  verUsuarios() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('/admin/usuarios');
  }

  editarUsuarios() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('/admin/editar-usuarios');
  }

  sacarReportes() {
    this.menuCtrl.close();
    this.utilsSvc.routerLink('/admin/reportes');
  }

  //fin borrador

  
  
  async signOut() {
    await this.menuCtrl.close(); // 👈 Cierra el menú
    this.firebaseSvc.signOut();
  }

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
