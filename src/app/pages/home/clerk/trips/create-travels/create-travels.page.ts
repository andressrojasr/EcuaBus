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

  buses: any[] = [];
  conductors: any[] = [];
  frequencies: any[] = [];

  form = new FormGroup({
    id: new FormControl(''),
    conductor: new FormControl('', Validators.required),
    idbus: new FormControl('', Validators.required),
    idcobrador: new FormControl(''), // No requerido
    idfrec: new FormControl('', Validators.required),
  });
  

  constructor() {}

  ngOnInit() {
    this.frecuency = history.state.frecuency;
    this.user = this.utils.getFromLocalStorage('user');
    this.loadData();

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

  async loadData() {
    const cooperativePath = `cooperatives/${this.user.uidCooperative}`;

    // Cargar buses
    this.firebase.getCollectionData(`${cooperativePath}/buses`).subscribe((data: any) => {
      this.buses = data;
    });

    // Cargar conductores
    this.firebase.getCollectionData(`${cooperativePath}/conductores`).subscribe((data: any) => {
      this.conductors = data.filter((c: any) => c.rol === 'conductor');
    });

    // Cargar frecuencias
    this.firebase.getCollectionData(`${cooperativePath}/frecuencies`).subscribe((data: any) => {
      this.frequencies = data;
    });
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
      .then(() => {
        this.utils.showToast({
          message: 'Viaje creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
        });
        this.utils.routerLink('/home/clerk/trips');
      })
      .catch((error) => {
        this.utils.showToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
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
        message: 'Viaje actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
      });
      this.utils.routerLink('/home/clerk/trips');
    } catch (error) {
      this.utils.showToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
      });
    } finally {
      loading.dismiss();
    }
  }
}
