import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Seleccione fuente de la imagen',
      promptLabelPhoto: 'Usar cámara',
      promptLabelPicture: 'Seleccionar de galería',
      promptLabelCancel: 'Cancelar',
    });
  }

  async presentModal(opts?: ModalOptions) {
    // Wrapper compatible: delega en presentModalComponent para no romper llamadas existentes
    // Devuelve la misma información que onWillDismiss del modal (si existe)
    return await this.presentModalComponent(opts as ModalOptions);
  }

  //==========Loading============
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  //==========Toast===========
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //=================Enruta a cualquier pagina disponible
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //=================Guarda un elemento en localstorage====
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //============Obtiene un elemento desde localstorage====
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  //============ Modal ============
  async presentModalComponent(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  
}
