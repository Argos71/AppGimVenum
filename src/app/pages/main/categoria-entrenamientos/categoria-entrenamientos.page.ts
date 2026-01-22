import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';

@Component({
  selector: 'app-categoria-entrenamientos',
  templateUrl: './categoria-entrenamientos.page.html',
  styleUrls: ['./categoria-entrenamientos.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule, RouterModule],
})
export class CategoriaEntrenamientosPage {

  @ViewChild('arContainer', { static: false }) arContainer!: ElementRef;

  selectedCategory: string | null = null;
  isARActive = false;
  mindAR!: MindARThree;

  areas = [
    { name: 'Abdomen', route: '/main/area-abdomen', icon: 'body-outline' },
    { name: 'Brazo', route: '/main/area-brazo', icon: 'barbell-outline' },
    { name: 'Pecho', route: '/main/area-pecho', icon: 'heart-outline' },
    { name: 'Pierna', route: '/main/area-pierna', icon: 'footsteps-outline' }
  ];

  selectCategory(category: string) { this.selectedCategory = category; }
  goBack() { this.selectedCategory = null; }

  async startAR() {
    this.isARActive = true;

    setTimeout(async () => {
      if (!this.arContainer) return;

      this.mindAR = new MindARThree({
        container: this.arContainer.nativeElement,
        imageTargetSrc: 'assets/targets/qr-abdomen.mind',
        maxTrack: 1,
      });

      const { scene, camera, renderer } = this.mindAR;

      // Ajustar canvas generado
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.zIndex = '9998';
      renderer.domElement.style.pointerEvents = 'auto';

      const targets = [
        { video: 'abdomen.mp4' },
        { video: 'brazo.mp4' },
        { video: 'pecho.mp4' },
        { video: 'pierna.mp4' }
      ];

      targets.forEach((t, index) => {
        const anchor = this.mindAR.addAnchor(index);
        const video = document.createElement('video');
        video.src = `assets/videos/${t.video}`;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;

        anchor.onTargetFound = () => video.play();
        anchor.onTargetLost = () => video.pause();

        const texture = new THREE.VideoTexture(video);
        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 0.6),
          new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        );
        plane.position.set(0, 0.35, 0);
        anchor.group.add(plane);
      });

      await this.mindAR.start();
      renderer.setAnimationLoop(() => renderer.render(scene, camera));
    }, 50);
  }

  stopAR() {
    this.isARActive = false;

    if (this.mindAR) {
      this.mindAR.renderer.setAnimationLoop(null);
      this.mindAR.stop();
      this.mindAR.scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) Array.isArray(obj.material) ? obj.material.forEach(m => m.dispose()) : obj.material.dispose();
        if (obj.texture) obj.texture.dispose();
      });

      while (this.arContainer.nativeElement.firstChild) {
        this.arContainer.nativeElement.removeChild(this.arContainer.nativeElement.firstChild);
      }

      this.mindAR.renderer.dispose();
      this.mindAR = null as any;
    }
  }
}
