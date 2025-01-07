import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  @Input() icon!:string
  @Input() type!:string
  @Input() label!:string
  @Input() autocomplete!:string
  @Input() control!:FormControl
  @Input() required!:boolean

  isPassword!:boolean
  hide:boolean = true
  placeholder: string

  showOrHidePassword()
  {
    this.hide = !this.hide
    if(this.hide) this.type = 'password'
    else this.type = 'text'
  }

  constructor() { }

  ngOnInit() {
    if(this.type=='password') this.isPassword=true
    if(this.label) this.placeholder = 'Ingrese '+this.label
  }

}
