import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AdminapiService } from 'src/app/services/adminapi.service';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-collector',
  templateUrl: './create-collector.page.html',
  styleUrls: ['./create-collector.page.scss'],
})
export class CreateCollectorPage implements OnInit {

  collector:User
    
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
        rol: new FormControl('Cobrador')
      })
    
      user = {} as User;
      title: string;
    
      constructor() { }
    
      ngOnInit() {
        this.collector = history.state.collector
        this.user = this.utils.getFromLocalStorage('user');
        if (this.collector) {
          this.form.patchValue({
            uid: this.collector.uid,
            name: this.collector.name,
            lastName: this.collector.lastName,
            card: this.collector.card,
            phone: this.collector.phone,
            address: this.collector.address || null,
            email: this.collector.email,
            isBlocked: this.collector.isBlocked,
            photo: this.collector.photo,
            uidCooperative: this.collector.uidCooperative,
            rol: this.collector.rol
          });
          this.form.controls.password.clearValidators();
          this.form.controls.password.updateValueAndValidity();
          this.title="Actualizar cobrador"
        }else{
          this.title="Crear cobrador"
        }
      }
    
      async takeImage()
      {
        const dataUrl = ( await this.utils.takePicture('Foto del cobrador')).dataUrl
        if(this.collector){
          this.form.controls.photo.setValue(dataUrl)
        }else{
          this.form.controls.photo.setValue(dataUrl)
        }
      }
    
      async submit()
      {
        
        if(this.collector){
          const loading = await this.utils.loading()
          await loading.present()
          ;(await this.updateCollector()).subscribe({
            next: async (response) => {
              let pathImage = await this.secondaryFirebase.getFilePath(this.collector.photo)
              await this.secondaryFirebase.deleteFile(pathImage)
              this.utils.showToast({
                message: response.message,
                duration: 1500,
                color: 'success',
                position: 'middle',
                icon: 'checkmark-circle-outline',
              });
              this.utils.routerLink('/home/admin/collector')
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
              this.form.controls.photo.setValue(this.collector.photo);
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
              this.utils.routerLink('/home/admin/collector')
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
        let imagePath = `ecuabus/${this.user.uidCooperative}/collectors/${Date.now()}`;
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
          rol: 'Cobrador',
        };
        return this.api.createUser(this.user.uidCooperative, 'collectors', userData);
      }
    
    
      async updateCollector() {
          if (this.form.value.photo !== this.collector.photo) {
              let dataUrl = this.form.value.photo;
              let imagePath = `ecuabus/${this.user.uidCooperative}/collectors/${Date.now()}`;
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
            rol: 'Cobrador',
            uid: this.collector.uid,
            uidCooperative: this.collector.uidCooperative
          };
          if(this.form.controls.email.value!== this.collector.email) userData.email = this.form.controls.email.value
          if(this.form.controls.password.value!== '') userData.password = this.form.controls.password.value
          if(this.form.controls.phone.value!== this.collector.phone) userData.phone = this.form.controls.phone.value
          return this.api.updateUser(this.collector.uid, this.user.uidCooperative, 'collectors', userData);
      }

}
