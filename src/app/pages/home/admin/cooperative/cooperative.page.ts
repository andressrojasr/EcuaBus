import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cooperative } from 'src/app/models/cooperative.model';
import { User } from 'src/app/models/user.model';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-cooperative',
  templateUrl: './cooperative.page.html',
  styleUrls: ['./cooperative.page.scss'],
})
export class CooperativePage implements OnInit {

  cooperative:Cooperative
  user = {} as User
  loading:boolean = false

  utils = inject(UtilsService)
  firebase = inject(FirebaseService);
  secondaryFirebase = inject(FirebaseSecondaryService)

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    ruc: new FormControl('', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    photo: new FormControl(''),
    isBlocked: new FormControl(false),
  }
)

  

  constructor() { }

  ngOnInit() {
    this.cooperative = this.utils.getFromLocalStorage('cooperative')
    this.user = this.utils.getFromLocalStorage('user');
    if (this.cooperative) {
      this.form.patchValue({
        uid: this.cooperative.uid,
        name: this.cooperative.name,
        address: this.cooperative.address,
        phone: this.cooperative.phone,
        ruc: this.cooperative.ruc,
        email: this.cooperative.email,
        photo: this.cooperative.photo,
        isBlocked: this.cooperative.isBlocked
      });
  }
  }

  submit()
  {
    if (this.form.valid) {
      this.updateCooperative()
    }
  }

    private async updateCooperative() {
      let path = `cooperatives/${this.cooperative.uid}`;

      const loading = await this.utils.loading();
      await loading.present();
      
      try {
        if (this.form.value.photo !== this.cooperative.photo) {
          let dataUrl = this.form.value.photo;
          let imagePath = `ecuabus/${this.user.uidCooperative}/cooperative/${Date.now()}`;
          let imageUrl = await this.secondaryFirebase.uploadImage(imagePath, dataUrl);
          this.form.controls.photo.setValue(imageUrl);
        }
        await this.firebase.updateDocument(path, this.form.value);
        this.utils.saveInLocalStorage('cooperative', this.form.value)
        this.utils.showToast({
          message: 'Cooperativa actualizada exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        
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
    const dataUrl = ( await this.utils.takePicture('Logotipo de cooperativa')).dataUrl
    if(this.cooperative){
      this.form.controls.photo.setValue(dataUrl)
    }else{
      this.form.controls.photo.setValue(dataUrl)
    }
  }
}
