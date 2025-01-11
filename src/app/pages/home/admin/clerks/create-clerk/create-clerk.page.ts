import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AdminapiService } from 'src/app/services/adminapi.service';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-clerk',
  templateUrl: './create-clerk.page.html',
  styleUrls: ['./create-clerk.page.scss'],
})
export class CreateClerkPage implements OnInit {

    clerk:User
  
    utils = inject(UtilsService)
    firebase = inject(FirebaseService);
    secondaryFirebase = inject(FirebaseSecondaryService);
    api = inject(AdminapiService)
  
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
      rol: new FormControl('Oficinista')
    })
  
    user = {} as User;
    title: string;
  
    constructor() { }
  
    ngOnInit() {
      this.clerk = history.state.clerk
      this.user = this.utils.getFromLocalStorage('user');
      if (this.clerk) {
        this.form.patchValue({
          uid: this.clerk.uid,
          name: this.clerk.name,
          lastName: this.clerk.lastName,
          card: this.clerk.card,
          phone: this.clerk.phone,
          address: this.clerk.address || null,
          email: this.clerk.email,
          isBlocked: this.clerk.isBlocked,
          photo: this.clerk.photo,
          uidCooperative: this.clerk.uidCooperative,
          rol: this.clerk.rol
        });
        this.form.controls.password.clearValidators();
        this.form.controls.password.updateValueAndValidity();
        this.title="Actualizar oficinista"
      }else{
        this.title="Crear oficinista"
      }
    }
  
    async takeImage()
    {
      const dataUrl = ( await this.utils.takePicture('Foto del oficinista')).dataUrl
      if(this.clerk){
        this.form.controls.photo.setValue(dataUrl)
      }else{
        this.form.controls.photo.setValue(dataUrl)
      }
    }
  
    async submit()
    {
      
      if(this.clerk){
        const loading = await this.utils.loading()
        await loading.present();
        (await this.updateClerk()).subscribe({
          next: async (response) => {
            let pathImage = await this.secondaryFirebase.getFilePath(this.clerk.photo)
            await this.secondaryFirebase.deleteFile(pathImage)
            this.utils.showToast({
              message: response.message,
              duration: 1500,
              color: 'success',
              position: 'middle',
              icon: 'checkmark-circle-outline',
            });
            this.utils.routerLink('/home/admin/clerks')
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
            this.form.controls.photo.setValue(this.clerk.photo);
            loading.dismiss();
            console.error(error);
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
            this.utils.routerLink('/home/admin/clerks')
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
      // === Subir la imagen y obtener la url ===
      let dataUrl = this.form.value.photo;
      let imagePath = `ecuabus/${this.user.uidCooperative}/clerks/${Date.now()}`;
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
        rol: 'Oficinista',
      };
      return this.api.createUser(this.user.uidCooperative, 'clerks', userData);
    }
  
  
    async updateClerk() {
        if (this.form.value.photo !== this.clerk.photo) {
            let dataUrl = this.form.value.photo;
            let imagePath = `ecuabus/${this.user.uidCooperative}/clerks/${Date.now()}`;
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
          rol: 'Oficinista',
          uid: this.clerk.uid,
          uidCooperative: this.clerk.uidCooperative
        };
        if(this.form.controls.email.value!== this.clerk.email) userData.email = this.form.controls.email.value
        if(this.form.controls.password.value!== '') userData.password = this.form.controls.password.value
        if(this.form.controls.phone.value!== this.clerk.phone) userData.phone = this.form.controls.phone.value
        return this.api.updateUser(this.clerk.uid, this.user.uidCooperative, 'clerks', userData);
    }

}
