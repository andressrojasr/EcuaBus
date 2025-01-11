import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

    user = {} as User
    loading:boolean = false
  
    utils = inject(UtilsService)
    firebase = inject(FirebaseService);
    secondaryFirebase = inject(FirebaseSecondaryService)
  
    form= new FormGroup({
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
  
    constructor() { }
  
    ngOnInit() {
      this.user = this.utils.getFromLocalStorage('user');
      if (this.user) {
        this.form.patchValue({
          uid: this.user.uid,
          name: this.user.name,
          lastName: this.user.lastName,
          card: this.user.card,
          phone: this.user.phone,
          email: this.user.email,
          isBlocked: this.user.isBlocked,
          photo: this.user.photo,
          uidCooperative: this.user.uidCooperative,
          rol: this.user.rol
        });
        this.form.controls.password.clearValidators();
        this.form.controls.password.updateValueAndValidity();
    }
    }
  
    submit()
    {
      if (this.form.valid) {
        this.updateUser()
      }
    }
  
      private async updateUser() {
        let path = `users/${this.user.uid}`;
  
        const loading = await this.utils.loading();
        await loading.present();
  
        try {
          if(this.form.controls.password.value!==''){
            if(this.form.controls.password.value.length<6){
              this.utils.showToast({
                message: 'La contraseña debe ser mayor a 6 dígitos',
                duration: 2500,
                color: 'danger',
                position: 'middle',
                icon: 'alert-circle-outline',
              });
              return
            }else{
              await this.firebase.updateUserPassword(this.form.controls.password.value)
            }
          }
          delete this.form.value.password
          if (this.form.value.photo !== this.user.photo) {
            let dataUrl = this.form.value.photo;
            let imagePath = `ecuabus/${this.user.uidCooperative}/users/${Date.now()}`;
            let imageUrl = await this.secondaryFirebase.uploadImage(imagePath, dataUrl);
            this.form.controls.photo.setValue(imageUrl);
        }
          await this.firebase.updateDocument(path, this.form.value);
          this.utils.saveInLocalStorage('user', this.form.value)
          this.utils.showToast({
            message: 'Usuario actualizado exitosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
          this.form.controls.password.setValue('')
        } catch (error) {
          console.log(error);
  
          this.utils.showToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        } finally {
          loading.dismiss();
        }
      }
  
      async takeImage()
    {
      const dataUrl = ( await this.utils.takePicture('Foto de usuario')).dataUrl
      this.form.controls.photo.setValue(dataUrl)
    }

}
