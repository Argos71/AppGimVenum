import { Component, inject } from '@angular/core';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SharedModule } from '../../../../shared/shared.module';
import { User } from 'src/app/models/user.model';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EdiusuComponent } from 'src/app/shared/components/ediusu/ediusu.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [IonicModule, SharedModule, ReactiveFormsModule],
})
export class UsuariosPage {
  firebaseSvc = inject(FirebaseService);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);
  utilsSvc = inject(UtilsService);

  // Form control para búsqueda
  searchControl = new FormControl('');

  // Observable con la lista de usuarios (sin filtrar)
  users$: Observable<User[]>;

  // Observable con la lista filtrada (bind en template)
  filteredUsers$: Observable<User[]>;

  constructor() {
    // Obtener lista original
    this.users$ = this.firebaseSvc.firestore
      .collection<User>('users')
      .valueChanges({ idField: 'uid' }) as Observable<User[]>;

    // Combinar usuarios con texto de búsqueda (startWith para emitir inicialmente)
    this.filteredUsers$ = combineLatest([
      this.users$,
      this.searchControl.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([users, q]) => this.filterUsers(users || [], q || ''))
    );
  }

  // Calcula IMC (BMI) retornando string formateado o '-' si no hay datos
  imc(user: User): string {
    const peso = Number(user?.peso);
    const est = Number(user?.estatura);
    if (!peso || !est) return '-';
    const altura = est / 100;
    if (altura <= 0) return '-';
    const result = peso / (altura * altura);
    return result ? result.toFixed(1) : '-';
  }

  // Formatea fecha esperada como ISO o timestamp string
  fmtDate(raw?: string): string {
    if (!raw) return '-';
    // Intentar parsear como número
    const asNum = Number(raw);
    const d = !isNaN(asNum) ? new Date(asNum) : new Date(raw);
    if (d.toString() === 'Invalid Date') return raw;
    return d.toLocaleDateString('es-CO');
  }

  private normalize(s: string) {
    return (s || '').toString().toLowerCase().trim();
  }

  private filterUsers(users: User[], q: string) {
    const term = this.normalize(q);
    if (!term) return users;
    return users.filter((u) => {
      // Buscar en campos clave
      return (
        this.normalize(u.nombre).includes(term) ||
        this.normalize(u.email).includes(term) ||
        this.normalize(u.uid).includes(term) ||
        this.normalize(u.tipoMembresia).includes(term) ||
        this.normalize(u.planNutricional).includes(term)
      );
    });
  }

  // Agregar usuario
  async addUser() {
    const modal = await this.modalCtrl.create({
      component: EdiusuComponent,
      componentProps: { user: null }
    });
    await modal.present();
  }

  // Editar usuario
  async editUser(user: User) {
    const modal = await this.modalCtrl.create({
      component: EdiusuComponent,
      componentProps: { user: user }
    });
    await modal.present();
  }

  // Eliminar usuario
  async deleteUser(user: User) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Eliminar a ${user.nombre || user.email}? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const loading = await this.utilsSvc.loading();
            await loading.present();
            try {
              await this.firebaseSvc.deleteDocument(`users/${user.uid}`);
              this.utilsSvc.presentToast({
                message: 'Usuario eliminado',
                duration: 2000,
                color: 'success',
                position: 'middle',
                icon: 'checkmark-circle-outline',
              });
            } catch (error: any) {
              this.utilsSvc.presentToast({
                message: error.message || 'Error al eliminar',
                duration: 2500,
                color: 'danger',
                position: 'middle',
                icon: 'alert-circle-outline',
              });
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
