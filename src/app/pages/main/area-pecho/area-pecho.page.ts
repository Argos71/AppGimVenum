import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-area-pecho',
  templateUrl: './area-pecho.page.html',
  styleUrls: ['./area-pecho.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule], 
})
export class AreaPechoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
