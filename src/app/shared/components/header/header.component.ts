import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Necesario para usar componentes de Ionic

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true, // <- IMPORTANTE
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule] // <- IMPORTANTE
})
export class HeaderComponent {
  @Input() title!: string;
  @Input() backButton: string;

}
