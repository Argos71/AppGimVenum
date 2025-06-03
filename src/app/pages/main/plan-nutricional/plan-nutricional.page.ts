import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-plan-nutricional',
  templateUrl: './plan-nutricional.page.html',
  styleUrls: ['./plan-nutricional.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule], 
})


export class PlanNutricionalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
