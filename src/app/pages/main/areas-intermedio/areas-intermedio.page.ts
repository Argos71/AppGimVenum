import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-areas-intermedio',
  templateUrl: './areas-intermedio.page.html',
  styleUrls: ['./areas-intermedio.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule], 
})
export class AreasIntermedioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
