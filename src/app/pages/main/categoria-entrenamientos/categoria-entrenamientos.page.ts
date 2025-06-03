import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-categoria-entrenamientos',
  templateUrl: './categoria-entrenamientos.page.html',
  styleUrls: ['./categoria-entrenamientos.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule], 
})
export class CategoriaEntrenamientosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
