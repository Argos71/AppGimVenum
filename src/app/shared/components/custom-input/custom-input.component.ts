import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonLabel } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular'; // Necesario para usar componentes de Ionic
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true, // <- IMPORTANTE
  imports: [ReactiveFormsModule ,IonicModule, CommonModule] // <- IMPORTANTE

})
export class CustomInputComponent  implements OnInit {

  @Input () control!: FormControl;
  @Input () type!: string;
  @Input () label!: string;
  @Input () autocomplete!: string;
  @Input () icon!: string;
@Input() readonly: boolean = false;

  isPassword!: boolean;
  hide: boolean = true;

  constructor() { }

  ngOnInit() {
    if (this.type == 'password') this.isPassword = true;
  }

  showOrHidePassword(){
    this.hide = !this.hide;

    if (this.hide) this.type = 'password';
    else this.type = 'text';
  }
}
