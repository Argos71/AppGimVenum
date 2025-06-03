import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-areas-principiante',
  templateUrl: './areas-principiante.page.html',
  styleUrls: ['./areas-principiante.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule], 
})
export class AreasPrincipiantePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
