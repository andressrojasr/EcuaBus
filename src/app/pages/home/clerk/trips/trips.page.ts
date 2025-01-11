import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'firebase/firestore';
import { Trip } from 'src/app/models/trip.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage{
  
        utils = inject(UtilsService)
        firebase = inject(FirebaseService)
        router = inject(Router)
        trip: Trip
        trips = []
        filteredTrips=[]
        searchTerm: string = '';
        loading:boolean = false
      
        ionViewWillEnter() {
          this.getTrips()
        }
      
        doRefresh(event: any)
        {
          setTimeout(() => {
            this.getTrips();
            event.target.complete();
          }, 1000);
        }
      
        ngOnInit(): void {
          this.getTrips();
        }
        async getTrips() {
          const user: User = this.utils.getFromLocalStorage('user');
          const path = `cooperatives/${user.uidCooperative}/viajes`;
          this.loading = true;
        
          const query = [orderBy('idfrec', 'desc')];
        
          this.firebase.getCollectionData(path, query).subscribe({
            next: async (res: any[]) => {
              const busesWithPartners = await Promise.all(
                res.map(async (trip) => {
                  console.log(trip.idcobrador)
                  const driver = await this.firebase.getDocument(`users/${trip.idconductor}`);
                  const collector = await this.firebase.getDocument(`users/${trip.idcobrador}`);
                  const bus = await this.firebase.getDocument(`cooperatives/${user.uidCooperative}/buses/${trip.idbus}`);
                  const frecuency = await this.firebase.getDocument(`cooperatives/${user.uidCooperative}/frecuencies/${trip.idfrec}`);
    
                  return {
                    ...trip,
                    driver: driver || {id: '', name:'', lastName:'', card: '', address: '', email: '', phone: '', photo: ''},
                    collector: collector || {id: '', name:'', lastName:'', card: '', address: '', email: '', phone: '', photo: ''},
                    bus: bus || {id: '', chasis:'', floors:'', idPartner: '', plate: '', seats: 0},
                    frecuency: frecuency || {destiny: '', document:'', id:'', isBlocked: '', origin: '', price: 0, stops: [], time: '', timeStart: '', timeEnd:''}
                  }
                })
              );
              this.trips = busesWithPartners;
              this.filteredTrips = busesWithPartners;
              this.loading = false;
            },
            error: (err) => {
              console.error('Error fetching trips:', err);
              this.loading = false;
            },
          });
        }
      
        async addUpdateTrip(trip?: Trip)
        {
          this.router.navigate(['/home/clerk/trips/create-trip'], { state: { trip } });
        }
      
        confirmDeleteTrip(trip: Trip) {
          this.utils.presentAlert({
            header: 'Eliminar viaje',
            message: '¿Estás seguro de eliminar a este viaje?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
              },
              {
                text: 'Eliminar',
                handler: () => this.deleteTrip(trip),
              },
            ],
          });
        }
      
        async deleteTrip(trip: Trip) {
          const user: User = this.utils.getFromLocalStorage('user');
          let path = `cooperatives/${user.uidCooperative}/viajes/${trip.id}`;
      
          const loading = await this.utils.loading();
          await loading.present();
      
          try {
            await this.firebase.deleteDocument(path);
            this.utils.showToast({
              message: 'Viaje eliminado exitosamente',
              duration: 1500,
              color: 'success',
              position: 'middle',
              icon: 'checkmark-circle-outline',
            });
          } catch (error) {
            this.utils.showToast({
              message:"Ha ocurrido un error",
              duration: 2500,
              color: 'primary',
              position: 'middle',
              icon: 'alert-circle-outline',
            });
          } finally {
            loading.dismiss();
          }
        }
      
        filterTrips() {
          const searchTerm = this.searchTerm.toLowerCase();
      
          if (searchTerm.trim() === '') {
            this.filteredTrips = this.trips;
          } else {
            this.filteredTrips = this.trips.filter(trip => {
              return (
                trip.id.toLowerCase().includes(searchTerm)||
                trip.driver.name.toLowerCase().includes(searchTerm)||
                trip.driver.lastName.toLowerCase().includes(searchTerm)||
                trip.driver.card.toLowerCase().includes(searchTerm)||
                trip.collector.name.toLowerCase().includes(searchTerm)||
                trip.collector.lastName.toLowerCase().includes(searchTerm)||
                trip.collector.card.toLowerCase().includes(searchTerm)||
                trip.frecuency.origin.toLowerCase().includes(searchTerm)||
                trip.frecuency.destiny.toLowerCase().includes(searchTerm)||
                trip.frecuency.timeStart.toLowerCase().includes(searchTerm)||
                trip.status.toLowerCase().includes(searchTerm)||
                trip.date.toLowerCase().includes(searchTerm)
              );
            });
          }
    }

}
