import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'firebase/firestore';
import { Bus } from 'src/app/models/bus.model';
import { Partner } from 'src/app/models/partners.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage{
  
  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)

  buses: Bus[] = []
  filteredBuses: Bus[]=[]
  searchTerm: string = '';
  loading:boolean = false

  ionViewWillEnter() {
    this.getBuses()
  }

  doRefresh(event: any)
  {
    setTimeout(() => {
      this.getBuses();
      event.target.complete();
    }, 1000);
  }

  async getBuses() {
    const user: User = this.utils.getFromLocalStorage('user');
    const path = `cooperatives/${user.uidCooperative}/buses`;
    this.loading = true;
  
    const query = [orderBy('plate', 'asc')];
  
    this.firebase.getCollectionData(path, query).subscribe({
      next: async (res: any[]) => {
        const busesWithPartners = await Promise.all(
          res.map(async (bus) => {
            const socio = await this.firebase.getDocument(`cooperatives/${user.uidCooperative}/partners/${bus.idPartner}`)
            return {
              ...bus,
              partner: socio || {id: '', name:'', lastName:'', card: '', address: '', email: '', phone: '', photo: ''}
            }
          })
        );
        this.buses = busesWithPartners;
        this.filteredBuses = busesWithPartners;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching buses:', err);
        this.loading = false;
      },
    });
  }

  async addUpdateBus(bus?: Bus)
  {
    this.router.navigate(['/home/admin/bus/create-bus'], { state: { bus } });
  }

  confirmDeleteBus(bus: Bus) {
    this.utils.presentAlert({
      header: 'Eliminar bus',
      message: '¿Estás seguro de eliminar a este bus?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteBus(bus),
        },
      ],
    });
  }

  async deleteBus(bus: Bus) {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/buses/${bus.id}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.deleteDocument(path);
      this.utils.showToast({
        message: 'Bus eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    } catch (error) {
      this.utils.showToast({
        message:error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    } finally {
      loading.dismiss();
    }
  }

  filterBuses() {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredBuses = this.buses;
    } else {
      this.filteredBuses = this.buses.filter(bus => {
        const complete = bus.partner.name+bus.partner.lastName
        return (
          bus.partner.card.toLowerCase().includes(searchTerm) ||
          bus.plate.toLowerCase().includes(searchTerm) ||
          bus.partner.name.toLowerCase().includes(searchTerm)||
          complete.toLowerCase().includes(searchTerm) ||
          bus.brand.toLowerCase().includes(searchTerm) ||
          bus.model.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  constructor() {}

}
