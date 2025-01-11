import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Partner } from 'src/app/models/partners.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.page.html',
  styleUrls: ['./create-partner.page.scss'],
})
export class CreatePartnerPage implements OnInit {

  partner:Partner

  utils = inject(UtilsService)
  firebase = inject(FirebaseService);

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('',[Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
    card: new FormControl('',[Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
    address: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    phone: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
  }
)

  user = {} as User;


  title: string;

  constructor() { }

  ngOnInit() {
    this.partner = history.state.partner
    this.user = this.utils.getFromLocalStorage('user');
    if (this.partner) {
      this.form.setValue(this.partner);
      this.title="Actualizar socio"
    }else{
      this.title="Crear socio"
    }
  }

  submit()
  {
    if (this.form.valid) {

      if(this.partner) this.updatePartner();
      else this.createPartner()
      this.utils.routerLink("/home/admin/partners")
    }
  }

  async createPartner() {
    let path = `cooperatives/${this.user.uidCooperative}/partners`

    const loading = await this.utils.loading();
    await loading.present();

    delete this.form.value.id

    this.firebase.addDocument(path, this.form.value).then(async res => {
      
      this.utils.showToast({
        message: 'Socio creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

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

    private async updatePartner() {
      let path = `cooperatives/${this.user.uidCooperative}/partners/${this.partner.id}`;

      const loading = await this.utils.loading();
      await loading.present();

      try {
        await this.firebase.updateDocument(path, this.form.value);

        this.utils.showToast({
          message: 'Socio actualizado exitosamente',
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
}
