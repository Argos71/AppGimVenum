import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-plan-nutricional',
  templateUrl: './plan-nutricional.page.html',
  styleUrls: ['./plan-nutricional.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule], 
})


export class PlanNutricionalPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  afAuth = inject(AngularFireAuth);

  planNutricional: any = null;
  userName: string = '';
  showTips: boolean = false;

  constructor() { }

  async ngOnInit() {
    const user = await this.afAuth.currentUser;
    if (user) {
      const path = `users/${user.uid}`;
      const userData = await this.firebaseSvc.getDocument(path);
      this.planNutricional = userData?.['planNutricional'];
      this.userName = userData?.['nombre'] || 'Usuario';
      console.log('Usuario:', user.uid);
      console.log('Datos del usuario:', userData);
      console.log('Plan nutricional:', this.planNutricional);
    } else {
      console.log('No hay usuario logueado');
    }
  }

  toggleTips() {
    this.showTips = !this.showTips;
  }

}
