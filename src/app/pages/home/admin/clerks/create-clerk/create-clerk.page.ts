import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
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
    rol: new FormControl('Oficinista')
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
    rol: new FormControl('Oficinista')
  })

  user = {} as User;


  title: string;

  constructor() { }

  ngOnInit() {
    this.clerk = history.state.clerk
    this.user = this.utils.getFromLocalStorage('user');
    if (this.clerk) {
      this.formUpdate.patchValue({
        uid: this.clerk.uid,
        name: this.clerk.name,
        lastName: this.clerk.lastName,
        card: this.clerk.card,
        phone: "",
        address: this.clerk.address || null,
        isBlocked: this.clerk.isBlocked,
        photo: this.clerk.photo,
        uidCooperative: this.clerk.uidCooperative,
        rol: this.clerk.rol
      });
      this.title="Actualizar oficinista"
    }else{
      this.title="Crear oficinista"
    }
  }

  async takeImage()
  {
    const dataUrl = ( await this.utils.takePicture('Foto del oficinista')).dataUrl
    if(this.clerk){
      this.formUpdate.controls.photo.setValue(dataUrl)
    }else{
      this.form.controls.photo.setValue(dataUrl)
    }
  }

  async submit()
  {
    
    if(this.clerk){
      this.updateClerk()
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
          message:'Oficinista creado con éxito',
          color:'success',
          position:'middle',
          duration:3000,
          icon:'checkmark-circle-outline'
        })
        this.utils.routerLink('/home/admin/clerks')
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
    let path = `cooperatives/${this.user.uidCooperative}/clerks/${uid}`
    delete this.form.value.password
    // === Subir la imagen y obtener la url ===
    // let dataUrl = this.form.value.photo;
    // let imagePath = `${this.user.uidCooperative}/clerks/${Date.now()}`;
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


    private async updateClerk() {
      let path = `cooperatives/${this.user.uidCooperative}/clerks/${this.clerk.uid}`;

      const loading = await this.utils.loading();
      await loading.present();

      try {
        if (this.formUpdate.value.photo !== this.clerk.photo) {
          let dataUrl = this.formUpdate.value.photo;
          let imagePath = `${this.user.uidCooperative}/clerks/${Date.now()}`;
          // let imageUrl = await this.firebase.uploadImage(imagePath, dataUrl);
          // this.formUpdate.controls.photo.setValue(imageUrl);
        }

        await this.firebase.updateDocument(path, this.formUpdate.value);

        this.utils.showToast({
          message: 'Oficinista actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.utils.routerLink('/home/admin/clerks')
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
