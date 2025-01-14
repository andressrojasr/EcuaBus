import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { orderBy } from 'firebase/firestore';
import { Bus } from 'src/app/models/bus.model';
import { Partner } from 'src/app/models/partners.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-bus',
  templateUrl: './create-bus.page.html',
  styleUrls: ['./create-bus.page.scss'],
})
export class CreateBusPage implements OnInit {

  bus:Bus
  partners: Partner[] = []
  user = {} as User
  title: string
  loading:boolean = false
  selectedPartner: Partner

  utils = inject(UtilsService)
  firebase = inject(FirebaseService);

  form = new FormGroup({
    id: new FormControl(''),
    plate: new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    chasis: new FormControl('',[Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
    seats: new FormControl(0,[Validators.required]),
    floors: new FormControl('',[Validators.required]),
    idPartner: new FormControl('', [Validators.required]),
    partner: new FormControl(null)
  }
)

  

  constructor() { }

  ngOnInit() {
    this.bus = history.state.bus
    this.user = this.utils.getFromLocalStorage('user');
    if (this.bus) {
      this.form.patchValue({
        id: this.bus.id,
        plate: this.bus.plate,
        chasis: this.bus.chasis,
        seats: this.bus.seats,
        floors: this.bus.floors,
        idPartner: this.bus.idPartner,
        partner: this.bus.partner || null // Asegúrate de que partner sea opcional
      });
      this.title="Actualizar bus"
      this.selectedPartner = this.bus.partner
    }else{
      this.title="Crear bus"
    }
   this.getPartners();
  }

  submit()
  {
    if (this.form.valid) {

      if(this.bus) this.updateBus();
      else this.createBus()
      this.utils.routerLink("/home/admin/bus")
    }
  }

  async createBus() {
    let path = `cooperatives/${this.user.uidCooperative}/buses`

    const loading = await this.utils.loading();
    await loading.present();

    delete this.form.value.id
    delete this.form.value.partner

    this.firebase.addDocument(path, this.form.value).then(async res => {
      const busId = res.id;

    // Actualizamos el documento con la ID generada
    await this.firebase.updateDocument(`${path}/${busId}`, { id: busId });

      this.utils.showToast({
        message: 'Bus creado exitosamente',
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

    private async updateBus() {
      let path = `cooperatives/${this.user.uidCooperative}/buses/${this.bus.id}`;

      const loading = await this.utils.loading();
      await loading.present();

      try {
        delete this.form.value.partner
        await this.firebase.updateDocument(path, this.form.value);

        this.utils.showToast({
          message: 'Bus actualizado exitosamente',
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

    async getPartners() {
      const user: User = this.utils.getFromLocalStorage('user');
      let path = `cooperatives/${user.uidCooperative}/partners`;
      this.loading = true;
  
      let query = [
        orderBy('__name__', 'asc')
      ]
  
      let sub = this.firebase.getCollectionData(path,query).subscribe({
        next: (res: any) => {
          this.partners = res
          this.loading = false;
        }
      })
    }

    selectOnChange(event:any){
      this.form.controls.idPartner.setValue(event.detail.value.id)
      console.log(this.form.controls)
    }

}
