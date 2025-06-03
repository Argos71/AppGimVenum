import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-area-abdomen',
  templateUrl: './area-abdomen.page.html',
  styleUrls: ['./area-abdomen.page.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule], 
})
export class AreaAbdomenPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
