import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AdminapiService } from 'src/app/services/adminapi.service';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.page.html',
  styleUrls: ['./create-driver.page.scss'],
})
export class CreateDriverPage implements OnInit {

  driver:User

  utils = inject(UtilsService)
  firebase = inject(FirebaseService);
  api = inject(AdminapiService)
  secondaryFirebase = inject(FirebaseSecondaryService)

  form= new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    card: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(13),Validators.maxLength(13)]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    isBlocked: new FormControl(false),
    photo: new FormControl('', [Validators.required]),
    uidCooperative: new FormControl(''),
    rol: new FormControl('Conductor')
  })

  user = {} as User;
  title: string;

  constructor() { }

  ngOnInit() {
    this.driver = history.state.driver
    this.user = this.utils.getFromLocalStorage('user');
    if (this.driver) {
      this.form.patchValue({
        uid: this.driver.uid,
        name: this.driver.name,
        lastName: this.driver.lastName,
        card: this.driver.card,
        phone: this.driver.phone,
        address: this.driver.address || null,
        email: this.driver.email,
        isBlocked: this.driver.isBlocked,
        photo: this.driver.photo,
        uidCooperative: this.driver.uidCooperative,
        rol: this.driver.rol
      });
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
      this.title="Actualizar conductor"
    }else{
      this.title="Crear conductor"
    }
  }

  async takeImage()
  {
    const dataUrl = ( await this.utils.takePicture('Foto del conductor')).dataUrl
    if(this.driver){
      this.form.controls.photo.setValue(dataUrl)
    }else{
      this.form.controls.photo.setValue(dataUrl)
    }
  }

  async submit()
  {
    
    if(this.driver){
      const loading = await this.utils.loading()
      await loading.present()
      ;(await this.updateDriver()).subscribe({
        next: async (response) => {
          let pathImage = await this.secondaryFirebase.getFilePath(this.driver.photo)
          await this.secondaryFirebase.deleteFile(pathImage)
          this.utils.showToast({
            message: response.message,
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
          this.utils.routerLink('/home/admin/drivers')
          loading.dismiss();
        },
        error: (error) => {
          this.utils.showToast({
            message: error.error.message,
            color: 'danger',
            position: 'middle',
            duration: 3000,
            icon: 'alert-circle-outline'
          });
          this.form.controls.photo.setValue(this.driver.photo);
          loading.dismiss();
        }, complete: () => {        
          loading.dismiss();
        }
      });
    }else{
      if (this.form.invalid) {
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
      ;(await this.createUser()).subscribe({
        next: (response) => {
          this.utils.showToast({
            message: response.message,
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
          this.utils.routerLink('/home/admin/drivers')
          loading.dismiss();
        },
        error: (error) => {
          this.utils.showToast({
            message: error.error.message,
            color: 'danger',
            position: 'middle',
            duration: 3000,
            icon: 'alert-circle-outline'
          });
          this.form.controls.photo.setValue('');
          loading.dismiss();
        }, complete: () => {
          loading.dismiss();
        }
      });
    }
  }

  async createUser() {
    let dataUrl = this.form.value.photo;
        let imagePath = `ecuabus/${this.user.uidCooperative}/drivers/${Date.now()}`;
        let imageUrl = await this.secondaryFirebase.uploadImage(imagePath, dataUrl);
        this.form.controls.photo.setValue(imageUrl);
    const userData = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      name: this.form.controls.name.value,
      lastName: this.form.controls.lastName.value,
      phone: this.form.controls.phone.value,
      address: this.form.controls.address.value,
      card: this.form.controls.card.value,
      photo: this.form.controls.photo.value,
      isBlocked: false,
      rol: 'Conductor',
    };
    return this.api.createUser(this.user.uidCooperative, 'drivers', userData);
  }


  async updateDriver() {
      if (this.form.value.photo !== this.driver.photo) {
          let dataUrl = this.form.value.photo;
          let imagePath = `ecuabus/${this.user.uidCooperative}/drivers/${Date.now()}`;
          let imageUrl = await this.secondaryFirebase.uploadImage(imagePath, dataUrl);
          this.form.controls.photo.setValue(imageUrl);
      }
      const userData: any = {     
        name: this.form.controls.name.value,
        lastName: this.form.controls.lastName.value,
        address: this.form.controls.address.value,
        card: this.form.controls.card.value,
        photo: this.form.controls.photo.value,
        isBlocked: this.form.controls.isBlocked.value,
        rol: 'Conductor',
        uid: this.driver.uid,
        uidCooperative: this.driver.uidCooperative
      };
      if(this.form.controls.email.value!== this.driver.email) userData.email = this.form.controls.email.value
      if(this.form.controls.password.value!== '') userData.password = this.form.controls.password.value
      if(this.form.controls.phone.value!== this.driver.phone) userData.phone = this.form.controls.phone.value
      return this.api.updateUser(this.driver.uid, this.user.uidCooperative, 'drivers', userData);
  }

}
