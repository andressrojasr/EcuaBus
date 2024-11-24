import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit {

  animationCtrl = inject(AnimationController)
  firebase = inject(FirebaseService)
  utils = inject(UtilsService)

  form= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  async submit (){
    const loading = await this.utils.loading()
    await loading.present()
    this.firebase.signIn(this.form.value as User).then(res => {
      console.log(res.user)
      this.getUserInfo(res.user.uid);
    }).catch(err => {
      this.utils.showToast({
        message:err.message,
        color:'danger',
        position:'middle',
        duration:10000,
        icon:'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss()
    })
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utils.loading();
      await loading.present();
      let path = `users/${uid}`;
      this.firebase.getDocument(path).then((user: any) => {
        this.utils.saveInLocalStorage('user', user);
        if(user.rol==="Administrador") this.utils.routerLink('home/admin/bus');
        this.form.reset();
        this.utils.showToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })
      }).catch(error => { 
        this.utils.showToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
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
