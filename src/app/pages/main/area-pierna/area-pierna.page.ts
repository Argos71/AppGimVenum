import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-area-pierna',
  templateUrl: './area-pierna.page.html',
  styleUrls: ['./area-pierna.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule], 
})
export class AreaPiernaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
