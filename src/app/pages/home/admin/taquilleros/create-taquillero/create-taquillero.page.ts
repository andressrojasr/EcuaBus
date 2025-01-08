import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AdminapiService } from 'src/app/services/adminapi.service';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-taquillero',
  templateUrl: './create-taquillero.page.html',
  styleUrls: ['./create-taquillero.page.scss'],
})
export class CreateTaquilleroPage implements OnInit {

  taquillero:User
    
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
        rol: new FormControl('Taquillero')
      })
    
      user = {} as User;
      title: string;
    
      constructor() { }
    
      ngOnInit() {
        this.taquillero = history.state.taquillero
        this.user = this.utils.getFromLocalStorage('user');
        if (this.taquillero) {
          this.form.patchValue({
            uid: this.taquillero.uid,
            name: this.taquillero.name,
            lastName: this.taquillero.lastName,
            card: this.taquillero.card,
            phone: this.taquillero.phone,
            address: this.taquillero.address || null,
            email: this.taquillero.email,
            isBlocked: this.taquillero.isBlocked,
            photo: this.taquillero.photo,
            uidCooperative: this.taquillero.uidCooperative,
            rol: this.taquillero.rol
          });
          this.form.controls.password.clearValidators();
          this.form.controls.password.updateValueAndValidity();
          this.title="Actualizar taquillero"
        }else{
          this.title="Crear taquillero"
        }
      }
    
      async takeImage()
      {
        const dataUrl = ( await this.utils.takePicture('Foto del taquillero')).dataUrl
        if(this.taquillero){
          this.form.controls.photo.setValue(dataUrl)
        }else{
          this.form.controls.photo.setValue(dataUrl)
        }
      }
    
      async submit()
      {
        
        if(this.taquillero){
          const loading = await this.utils.loading()
          await loading.present()
          ;(await this.updateTaquillero()).subscribe({
            next: async (response) => {
              let pathImage = await this.secondaryFirebase.getFilePath(this.taquillero.photo)
              await this.secondaryFirebase.deleteFile(pathImage)
              this.utils.showToast({
                message: response.message,
                duration: 1500,
                color: 'success',
                position: 'middle',
                icon: 'checkmark-circle-outline',
              });
              this.utils.routerLink('/home/admin/taquilleros')
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
              this.form.controls.photo.setValue(this.taquillero.photo);
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
              this.utils.routerLink('/home/admin/taquilleros')
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
        let imagePath = `ecuabus/${this.user.uidCooperative}/taquilleros/${Date.now()}`;
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
          rol: 'Taquillero',
        };
        return this.api.createUser(this.user.uidCooperative, 'taquilleros', userData);
      }
    
    
      async updateTaquillero() {
        if (this.form.value.photo !== this.taquillero.photo) {
          let dataUrl = this.form.value.photo;
          let imagePath = `ecuabus/${this.user.uidCooperative}/taquilleros/${Date.now()}`;
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
            rol: 'Taquillero',
            uid: this.taquillero.uid,
            uidCooperative: this.taquillero.uidCooperative
          };
          if(this.form.controls.email.value!== this.taquillero.email) userData.email = this.form.controls.email.value
          if(this.form.controls.password.value!== '') userData.password = this.form.controls.password.value
          if(this.form.controls.phone.value!== this.taquillero.phone) userData.phone = this.form.controls.phone.value
          return this.api.updateUser(this.taquillero.uid, this.user.uidCooperative, 'taquilleros', userData);
      }
}
