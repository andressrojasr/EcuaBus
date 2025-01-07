import { Cooperative } from './../../../models/cooperative.model';
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
export class LoginPage implements AfterViewInit, OnInit{

  animationCtrl = inject(AnimationController)
  firebase = inject(FirebaseService)
  utils = inject(UtilsService)  

  cooperative: string;
  rol: string = "Administrador";
  cooperatives: Cooperative []=[]

  form= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  async submit (){
    const loading = await this.utils.loading()
    await loading.present()
    if(this.rol !== "Administrador" && this.cooperative == null){
      this.utils.showToast({
        message: 'Seleccione una cooperativa',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
      loading.dismiss()
      return
    }
    this.firebase.signIn(this.form.value as User).then(res => {
      console.log(res.user)
      if( this.rol == "Administrador") this.getUserInfo(res.user.uid);
      if(this.rol == "Taquillero") this.getTaquilleroInfo(res.user.uid);
      if(this.rol == "Oficinista") this.getOficinistaInfo(res.user.uid);
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
        if(!user){
          this.firebase.signOut();
          this.form.reset();
          this.utils.showToast({
            message: 'Usuario no autorizado para iniciar sesión',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
          return
        }
        this.utils.saveInLocalStorage('user', user);
        this.getCooperativeInfo(user.uidCooperative)
        if(user.rol==="Administrador") this.utils.routerLink('home/admin/bus');
        else if(user.rol==="Taquillero") this.utils.routerLink('home/taquilleros/booletery');
        else if(user.rol==="Oficinista") this.utils.routerLink('home/clerk/trips');
        else {
          this.utils.removeFromLocalStorage('cooperative')
          this.utils.removeFromLocalStorage('user')
          this.firebase.signOut();
          this.form.reset();
          this.utils.showToast({
            message: 'Usuario no autorizado para iniciar sesión',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
          return
        }
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

  async getTaquilleroInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utils.loading();
      await loading.present();
      let path = `cooperatives/${this.cooperative}/taquilleros/${uid}`;
      this.firebase.getDocument(path).then((user: any) => {
        if(!user){
          this.firebase.signOut();
          this.form.reset();
          this.utils.showToast({
            message: 'Usuario no autorizado para iniciar sesión',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
          return
        }
        this.utils.saveInLocalStorage('user', user);
        this.getCooperativeInfo(user.uidCooperative)
        if(user.rol==="Administrador") this.utils.routerLink('home/admin/bus');
        else if(user.rol==="Taquillero") this.utils.routerLink('home/taquilleros/booletery');
        else if(user.rol==="Oficinista") this.utils.routerLink('home/clerk/trips');
        else {
          this.utils.removeFromLocalStorage('cooperative')
          this.utils.removeFromLocalStorage('user')
          this.firebase.signOut();
          this.form.reset();
          this.utils.showToast({
            message: 'Usuario no autorizado para iniciar sesión',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
          return
        }
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

  async getOficinistaInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utils.loading();
      await loading.present();
      let path = `cooperatives/${this.cooperative}/clerks/${uid}`;
      this.firebase.getDocument(path).then((user: any) => {
        if(!user){
          this.firebase.signOut();
          this.form.reset();
          this.utils.showToast({
            message: 'Usuario no autorizado para iniciar sesión',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
          return
        }
        this.utils.saveInLocalStorage('user', user);
        this.getCooperativeInfo(user.uidCooperative)
        if(user.rol==="Administrador") this.utils.routerLink('home/admin/bus');
        else if(user.rol==="Taquillero") this.utils.routerLink('home/taquilleros/booletery');
        else if(user.rol==="Oficinista") this.utils.routerLink('home/clerk/trips');
        else {
          this.utils.removeFromLocalStorage('cooperative')
          this.utils.removeFromLocalStorage('user')
          this.firebase.signOut();
          this.form.reset();
          this.utils.showToast({
            message: 'Usuario no autorizado para iniciar sesión',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline'
          })
          return
        }
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

  async getCooperativeInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utils.loading();
      await loading.present();
      let path = `cooperatives/${uid}`;
      this.firebase.getDocument(path).then((cooperative: any) => {
        this.utils.saveInLocalStorage('cooperative', cooperative);
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

  async getCooperatives() {
    let path = `cooperatives`;

    let sub = this.firebase.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.cooperatives = res
      }
    })
  }

  selectOnChange(event){
    this.cooperative=event.detail.value
  }

  selectOnChangeRol(event){
    this.rol=event.detail.value
  }

  ngOnInit(): void {
      this.playAnimation();
      this.getCooperatives()
  }

  ngAfterViewInit(){
    this.playAnimation();
  }

}
