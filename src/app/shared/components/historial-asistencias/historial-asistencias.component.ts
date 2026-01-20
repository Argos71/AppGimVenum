import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { collection, getDocs } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

@Component({
  standalone: true,
  selector: 'app-historial-asistencias',
  templateUrl: './historial-asistencias.component.html',
  styleUrls: ['./historial-asistencias.component.scss'],
  imports: [
    HeaderComponent,
    CommonModule,
    IonicModule,
  ],
})
export class HistorialAsistenciasComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  asistencias: any[] = [];

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.getAsistencias();
  }

  async getAsistencias() {
    const path = `users/${this.user.uid}/asistencias`;
    try {
      const ref = collection(getFirestore(), path);
      const snapshot = await getDocs(ref);
      const asistenciasRaw = snapshot.docs.map(doc => {
        const data = doc.data();
        const [day, month, year] = data['FechaAsistencia'].split('/');
        const fecha = new Date(`${year}-${month}-${day}`);
        const diaSemana = fecha.toLocaleDateString('es-BO', { weekday: 'long' });
        return {
          id: doc.id,
          ...data,
          diaCompleto: `${diaSemana}, ${data['FechaAsistencia']}`,
          fechaObj: fecha
        };
      });
      this.asistencias = asistenciasRaw.sort((a, b) => b.fechaObj.getTime() - a.fechaObj.getTime());
    } catch (error) {
      console.error('Error al obtener asistencias:', error);
      this.utilsSvc.presentToast({
        message: 'Error al cargar asistencias',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }

}
