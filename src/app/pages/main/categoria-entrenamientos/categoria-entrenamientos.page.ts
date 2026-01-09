import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-categoria-entrenamientos',
  templateUrl: './categoria-entrenamientos.page.html',
  styleUrls: ['./categoria-entrenamientos.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule, RouterModule],
})
export class CategoriaEntrenamientosPage implements OnInit {

  selectedCategory: string | null = null;
  areas = [
    { name: 'Abdomen', route: '/main/area-abdomen', icon: 'body-outline' },
    { name: 'Brazo', route: '/main/area-brazo', icon: 'barbell-outline' },
    { name: 'Pecho', route: '/main/area-pecho', icon: 'heart-outline' },
    { name: 'Pierna', route: '/main/area-pierna', icon: 'footsteps-outline' }
  ];

  constructor() { }

  ngOnInit() {
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  goBack() {
    this.selectedCategory = null;
  }

}
