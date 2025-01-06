import { Component, inject, OnInit } from '@angular/core'; 
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Travel } from 'src/app/models/travel.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-travels',
  templateUrl: './create-travels.page.html',
  styleUrls: ['./create-travels.page.scss'],
})
export class CreateTravelsPage implements OnInit {
  utils = inject(UtilsService);
  firebase = inject(FirebaseService);

  frecuency!: Travel;
  travels: Travel[] = [];
  user = {} as User;
  title: string;

  isModalOpen = false;
  control!: FormControl;

  form = new FormGroup({
    id: new FormControl(''),
    conductor: new FormControl(''),
    idbus: new FormControl(''),
    idcobrador: new FormControl(''),
    idfrec: new FormControl(''),
  });

  constructor() {}

  ngOnInit() {
    this.frecuency = history.state.frecuency;
    this.user = this.utils.getFromLocalStorage('user');
    if (this.frecuency) {
      this.form.patchValue({
        id: this.frecuency.id,
        conductor: this.frecuency.conductor,
        idbus: this.frecuency.idbus,
        idcobrador: this.frecuency.idcobrador,
        idfrec: this.frecuency.idfrec,
      });
      this.title = 'Actualizar frecuencia';
    } else {
      this.title = 'Crear frecuencia';
    }
  }

  async submit() {
    if (this.form.invalid) {
      this.utils.showToast({
        message: 'Por favor, completa todos los campos requeridos.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
      });
      return;
    }

    if (this.frecuency) {
      this.updateFrecuency();
    } else {
      this.createFrecuency();
    }
  }

  async createFrecuency() {
    let path = `cooperatives/${this.user.uidCooperative}/viajes`;

    const loading = await this.utils.loading();
    await loading.present();

    delete this.form.value.id;

    this.firebase
      .addDocument(path, this.form.value)
      .then(async (res) => {
        this.utils.showToast({
          message: 'Viaje creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.utils.routerLink('/home/admin/travels');
      })
      .catch((error) => {
        console.log(error);

        this.utils.showToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async updateFrecuency() {
    let path = `cooperatives/${this.user.uidCooperative}/viajes/${this.frecuency.id}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, this.form.value);

      this.utils.showToast({
        message: 'Frecuencia actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
      this.utils.routerLink('/home/admin/travels');
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

  openPicker(formControl: FormControl) {
    this.isModalOpen = true;
    this.control = formControl;
  }

  closePicker() {
    this.isModalOpen = false;
  }

  onPickerChange(event: any) {
    const isoString = event.detail.value;
    if (isoString) {
      const date = new Date(isoString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedTime = this.formatTime(hours, minutes);
      this.control.setValue(formattedTime);
    }
    this.closePicker();
  }

  formatTime(hours: number, minutes: number): string {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
