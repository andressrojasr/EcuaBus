import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, NavController, ToastController, ToastOptions } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController)
  toastController = inject(ToastController)
  router = inject(Router)
  modalController = inject(ModalController)
  alertController = inject(AlertController)
  nav = inject(NavController)

  private userSubject = new BehaviorSubject<any>(this.getFromLocalStorage('user'));
  user$ = this.userSubject.asObservable(); // Observable que puedes suscribirte

  async presentModal(opt:ModalOptions)
  {
    const modal = await this.modalController.create(opt)
    await modal.present()

    const { data } = await modal.onWillDismiss()
    if (data) return data;
  }

  dismissModal(data?:any)
  {
    return this.modalController.dismiss(data)
  }

  loading(){
    return this.loadingController.create({
      message: 'Loading'
    })
  }

  async showToast(op?:ToastOptions){
    const toast = await this.toastController.create(op)
    toast.present()
  }

  routerLink(url:string)
  {
    return this.router.navigateByUrl(url)
  }

  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }

  saveInLocalStorage(key:string, value:any)
  {
    const res = localStorage.setItem(key, JSON.stringify(value))
    if (key === 'user') {
      this.userSubject.next(value);
    } 
    return res
  }

  getFromLocalStorage(key:string)
  {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  removeFromLocalStorage(key:string){
    const res = localStorage.removeItem(key)
    if (key === 'user') {
      this.userSubject.next(null); // Notificar cambios
    }
    return res
  }

  async takePicture(promptLabelHeader:string)
  {
    return await Camera.getPhoto({
      resultType:CameraResultType.DataUrl,
      quality:90,
      allowEditing:true,
      source:CameraSource.Photos,
    })
  }

  navigateToHome(){
    this.nav.navigateRoot('/auth')
  }
}
