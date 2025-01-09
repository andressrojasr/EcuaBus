import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { where } from 'firebase/firestore';
import { Bus } from 'src/app/models/bus.model';
import { Frecuency } from 'src/app/models/frecuency.model';
import { Trip } from 'src/app/models/trip.model';
import { User } from 'src/app/models/user.model';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.page.html',
  styleUrls: ['./create-trip.page.scss'],
})
export class CreateTripPage implements OnInit {

  utils = inject(UtilsService)
    firebase = inject(FirebaseService);
    secondaryFirebase = inject(FirebaseSecondaryService)
    trip: Trip
    frecuencies: Frecuency[] =[]
    buses: Bus[]=[]
    drivers: User[]=[]
    collectors: User[]=[]
    user = {} as User
    title: string;

    form= new FormGroup({
      id: new FormControl(''),
      idbus: new FormControl('', [Validators.required]),
      idcobrador: new FormControl('', [Validators.required]),
      idconductor: new FormControl('', [Validators.required]),
      idfrec: new FormControl('', [Validators.required]),
      seats: new FormControl(0, [Validators.required]),
      seatsVip: new FormControl(0, [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      priceVip: new FormControl(0, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      status: new FormControl('Activo', [Validators.required]),
    })
  
    
  
    constructor() { }
  
    ngOnInit() {
      this.trip = history.state.trip
      this.user = this.utils.getFromLocalStorage('user');
      this.getFrecuencies()
      this.getBuses();
      this.getCollectors();
      this.getDrivers();
      if (this.trip) {
        this.form.patchValue({
          id: this.trip.id,
          idbus: this.trip.idbus,
          idcobrador: this.trip.idcobrador,
          idconductor: this.trip.idconductor,
          idfrec: this.trip.idfrec,
          seats: this.trip.seats,
          seatsVip: this.trip.seatsVip,
          price: this.trip.price,
          priceVip: this.trip.priceVip,
          status: this.trip.status,
        });
        this.title="Actualizar Viaje"
      }else{
        this.title="Crear Viaje"
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
    
      if (this.trip) {
        this.updateTrip();
      } else {
        this.createTrip();
      }
    }
  
    async createTrip() {
      let path = `cooperatives/${this.user.uidCooperative}/viajes`
  
      const loading = await this.utils.loading();
      await loading.present();
  
      delete this.form.value.id
  
      this.firebase.addDocument(path, this.form.value).then(async res => {    
        const tripId = res.id;
        await this.firebase.updateDocument(`${path}/${tripId}`, { id: tripId });
        this.utils.showToast({
          message: 'Viaje creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })
        this.utils.routerLink('/home/clerk/trips')
      }).catch(error => {
        this.utils.showToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
  
      }).finally(() => {
        loading.dismiss();
      })
    }
  
  
      private async updateTrip() {
        let path = `cooperatives/${this.user.uidCooperative}/viajes/${this.trip.id}`;
  
        const loading = await this.utils.loading();
        await loading.present();
  
        try {
          await this.firebase.updateDocument(path, this.form.value);
          this.utils.showToast({
            message: 'Viaje actualizado exitosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
          this.utils.routerLink('/home/clerk/trips')
        } catch (error) {
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
  async getFrecuencies() {
        const user: User = this.utils.getFromLocalStorage('user');
        const query = [where('isBlocked', '==', false)];
        let path = `cooperatives/${user.uidCooperative}/frecuencies`;    
        let sub = this.firebase.getCollectionData(path,query).subscribe({
          next: (res: any) => {
            this.frecuencies = res
          }
        })
      }
  
  async selectOnChangeFrecuency(event:any){
        this.form.controls.idfrec.setValue(event.detail.value.id)
        this.form.controls.price.setValue(event.detail.value.price)
        this.form.controls.priceVip.setValue(event.detail.value.priceVip)
  }

  async getBuses() {
        const user: User = this.utils.getFromLocalStorage('user');
        let path = `cooperatives/${user.uidCooperative}/buses`;    
        let sub = this.firebase.getCollectionData(path).subscribe({
          next: (res: any) => {
            this.buses = res
          }
        })
      }
  
  selectOnChangeBus(event:any){
        this.form.controls.idbus.setValue(event.detail.value.id)
        this.form.controls.seats.setValue(event.detail.value.seats)
        this.form.controls.seatsVip.setValue(event.detail.value.seatsVip)
  }

  async getDrivers() {
    const user: User = this.utils.getFromLocalStorage('user');
    const query = [where('isBlocked', '==', false)];
    let path = `cooperatives/${user.uidCooperative}/drivers`;    
    let sub = this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.drivers = res
      }
    })
  }

  async selectOnChangeDriver(event:any){
    this.form.controls.idconductor.setValue(event.detail.value.id)
  }

  async getCollectors() {
    const user: User = this.utils.getFromLocalStorage('user');
    const query = [where('isBlocked', '==', false)];
    let path = `cooperatives/${user.uidCooperative}/collectors`;    
    this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.collectors = res
      }
    })
  }

  async selectOnChangeCollector(event:any){
    this.form.controls.idcobrador.setValue(event.detail.value.id)
  }

  async selectOnChangeStatus(event:any){
    this.form.controls.status.setValue(event.detail.value)
  }

  onDateTimeChange(event: any): void {
    const selectedDate = event.detail.value;
    this.form.controls.date.setValue(selectedDate)
  }
}
