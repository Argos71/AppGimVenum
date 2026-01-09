import { Component, Input, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Necesario para usar componentes de Ionic

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  standalone: true, // <- IMPORTANTE
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, RouterModule, CommonModule] // <- IMPORTANTE
})
export class HeaderComponent  {
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;

  utilsSvc = inject(UtilsService);

  dismissModal() {
    this.utilsSvc.dismissModal();
  }
}