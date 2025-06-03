import { Component, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular'; // Necesario para usar componentes de Ionic

@Component({
  selector: 'app-logo',
    standalone: true, // <- IMPORTANTE
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
    imports: [IonicModule] // <- IMPORTANTE

})
export class LogoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
