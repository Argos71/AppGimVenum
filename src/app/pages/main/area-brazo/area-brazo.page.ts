import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-area-brazo',
  templateUrl: './area-brazo.page.html',
  styleUrls: ['./area-brazo.page.scss'],
  standalone: true,
    imports: [IonicModule, SharedModule], 
})
export class AreaBrazoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
