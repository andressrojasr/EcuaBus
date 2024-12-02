import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
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

  form= new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    card: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    phone: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    isBlocked: new FormControl(false),
    photo: new FormControl('', [Validators.required]),
    uidCooperative: new FormControl(''),
    rol: new FormControl('Conductor')
  })

  formUpdate= new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    card: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    phone: new FormControl(''),
    address: new FormControl('', [Validators.required]),
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
      this.formUpdate.patchValue({
        uid: this.driver.uid,
        name: this.driver.name,
        lastName: this.driver.lastName,
        card: this.driver.card,
        phone: "",
        address: this.driver.address || null,
        isBlocked: this.driver.isBlocked,
        photo: this.driver.photo,
        uidCooperative: this.driver.uidCooperative,
        rol: this.driver.rol
      });
      this.title="Actualizar conductor"
    }else{
      this.title="Crear conductor"
    }
  }

  async takeImage()
  {
    const dataUrl = ( await this.utils.takePicture('Foto del conductor')).dataUrl
    if(this.driver){
      this.formUpdate.controls.photo.setValue(dataUrl)
    }else{
      this.form.controls.photo.setValue(dataUrl)
    }
  }

  async submit()
  {
    
    if(this.driver){
      this.updateDriver()
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
      this.firebase.signUp(this.form.value as User).then( async res => {
        const name = this.form.value.name as string
        let uid = res.user.uid
        this.form.controls.uid.setValue(uid)
        this.form.controls.uidCooperative.setValue(this.user.uidCooperative)
        this.setUserInfo(uid)
        this.utils.showToast({
          message:'Conductor creado con éxito',
          color:'success',
          position:'middle',
          duration:3000,
          icon:'checkmark-circle-outline'
        })
        this.utils.routerLink('/home/admin/drivers')
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
  }

  async setUserInfo(uid:string)
  {
    let path = `cooperatives/${this.user.uidCooperative}/drivers/${uid}`
    delete this.form.value.password
    // === Subir la imagen y obtener la url ===
    // let dataUrl = this.form.value.photo;
    // let imagePath = `${this.user.uidCooperative}/drivers/${Date.now()}`;
    // let imageUrl = await this.firebase.uploadImage(imagePath, dataUrl);
    // this.form.controls.photo.setValue(imageUrl);
    this.firebase.setDocument(path,this.form.value).then( async res => {
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


    private async updateDriver() {
      let path = `cooperatives/${this.user.uidCooperative}/drivers/${this.driver.uid}`;

      const loading = await this.utils.loading();
      await loading.present();

      try {
        if (this.formUpdate.value.photo !== this.driver.photo) {
          let dataUrl = this.formUpdate.value.photo;
          let imagePath = `${this.user.uidCooperative}/drivers/${Date.now()}`;
          // let imageUrl = await this.firebase.uploadImage(imagePath, dataUrl);
          // this.formUpdate.controls.photo.setValue(imageUrl);
        }

        await this.firebase.updateDocument(path, this.formUpdate.value);

        this.utils.showToast({
          message: 'Conductor actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.utils.routerLink('/home/admin/drivers')
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

}
