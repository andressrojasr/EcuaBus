import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  animationCtrl = inject(AnimationController)
    firebase = inject(FirebaseService)
    utils = inject(UtilsService)  
  
    form= new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  
    async submit (){
      const loading = await this.utils.loading()
      await loading.present()
      try {
        await this.firebase.resetPassword(this.form.controls.email.value);
        this.utils.showToast({
          message: 'Enlace de recuperación de contraseña enviado al email proporcionado',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
        this.utils.routerLink('/auth')
      } catch (error: any) {
        this.utils.showToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      } finally{
        loading.dismiss();
      }
    }
    ngOnInit(): void {
        this.playAnimation();
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
  
    ngAfterViewInit(){
      this.playAnimation();
    }
  
}
