import { name } from './../../../../../node_modules/@leichtgewicht/ip-codec/types/index.d';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  animationCtrl = inject(AnimationController)

  form= new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    card: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    nameCoop: new FormControl('', [Validators.required, Validators.minLength(5)]),
    addressCoop: new FormControl('', [Validators.required, Validators.minLength(5)]),
    phoneCoop: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    rucCoop: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    emailCoop: new FormControl('', [Validators.required, Validators.email]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  async submit (){

  }
  constructor() { }

  playAnimation() {
    const animation = this.animationCtrl.create()
    .addElement(document.querySelector('.logo')) // Seleccionar el elemento del DOM
    .duration(3000) // Duración de la animación
    .iterations(Infinity) // Repetir indefinidamente
    .keyframes([
      { offset: 0, transform: 'translateY(0)', easing: 'ease-in-out' }, // Posición inicial
      { offset: 0.5, transform: 'translateY(-10px)', easing: 'ease-in-out' }, // Se eleva
      { offset: 1, transform: 'translateY(0)', easing: 'ease-in-out' } // Regresa a la posición original
    ]);
  animation.play(); // Iniciar la animación
  }

  ngOnInit(){
    this.playAnimation();
  }

}
