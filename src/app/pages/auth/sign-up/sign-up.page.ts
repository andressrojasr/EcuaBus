import { name } from './../../../../../node_modules/@leichtgewicht/ip-codec/types/index.d';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnimationController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  animationCtrl = inject(AnimationController)
  firebase = inject(FirebaseService) 
  utils = inject(UtilsService) 

  userForm= new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    card: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    isBlocked: new FormControl(false),
    photo: new FormControl(''),
    uidCooperative: new FormControl(''),
    rol: new FormControl('Administrador')
  })

  cooperativeForm = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    ruc: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    photo: new FormControl(''),
    isBlocked: new FormControl(false),
  })

  async submit (){
    if (this.userForm.invalid || this.cooperativeForm.invalid) {
      this.utils.showToast({
        message: 'El formulario es inválido',
        color: 'danger',
        position: 'middle',
        duration: 3000,
        icon: 'alert-circle-outline'
      });
      return;
    }
    const loading = await this.utils.loading()
    await loading.present()
    this.firebase.signUp(this.userForm.value as User).then( async res => {
      const name = this.userForm.value.name as string
      this.firebase.updateProfile(name)
      let uid = res.user.uid
      this.userForm.controls.uid.setValue(uid)
      const uidCoop = await this.createCooperative()
      this.userForm.controls.uidCooperative.setValue(uidCoop)
      this.setUserInfo(uid)
      this.utils.showToast({
        message:'Usuario creado con éxito',
        color:'success',
        position:'middle',
        duration:3000,
        icon:'checkmark-circle-outline'
      })
      this.utils.routerLink('/home/admin/bus')
    }).catch(err => {
      this.utils.showToast({
        message:err.message,
        color:'danger',
        position:'middle',
        duration:3000,
        icon:'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss()
    })
  }

  async createCooperative(): Promise<string>{
    let path = `cooperatives`

    const loading = await this.utils.loading();
    await loading.present();

    delete this.cooperativeForm.value.uid

    try {
      const res = await this.firebase.addDocument(path, this.cooperativeForm.value);
      this.utils.dismissModal({ success: true });
      return res.id; // Devuelve el UID del documento creado
    } catch (error) {
      console.error(error);
  
      this.utils.showToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
  
      throw error; // Lanza el error para manejarlo en `submit`
    } finally {
      loading.dismiss();
    }
  }

  async setUserInfo(uid:string)
  {
    let path = `users/${uid}`
    delete this.userForm.value.password
    this.firebase.setDocument(path,this.userForm.value).then( async res => {
      this.utils.saveInLocalStorage('user',this.userForm.value)
      this.utils.saveInLocalStorage('cooperative', this.cooperativeForm.value)
    }).catch(err => {
      this.utils.showToast({
        message:err.message,
        color:'danger',
        position:'middle',
        duration:3000,
        icon:'alert-circle-outline'
      })
    })    
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
