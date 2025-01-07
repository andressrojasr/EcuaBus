import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy, where } from 'firebase/firestore';
import { Trip } from 'src/app/models/trip.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.page.html',
  styleUrls: ['./trip.page.scss'],
})
export class TripPage implements OnInit{

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
        this.trip = history.state.trip
      }
      async getTrips() {
        const user: User = this.utils.getFromLocalStorage('user');
        const path = `cooperatives/${user.uidCooperative}/viajes`;
        this.loading = true;
      
        const query = [where('idfrec', '==', this.trip.id)];
      
        this.firebase.getCollectionData(path, query).subscribe({
          next: async (res: any[]) => {
            const busesWithPartners = await Promise.all(
              res.map(async (trip) => {
                console.log(trip.idcobrador)
                const driver = await this.firebase.getDocument(`cooperatives/${user.uidCooperative}/drivers/${trip.idconductor}`);
                const collector = await this.firebase.getDocument(`cooperatives/${user.uidCooperative}/collectors/${trip.idcobrador}`);
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
    
      async addUpdateBus(trip?: Trip)
      {
        this.router.navigate(['/home/admin/trip/create-trip'], { state: { trip } });
      }
    
      confirmDeleteBus(trip: Trip) {
        this.utils.presentAlert({
          header: 'Eliminar trip',
          message: '¿Estás seguro de eliminar a este trip?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Eliminar',
              handler: () => this.deleteBus(trip),
            },
          ],
        });
      }
    
      async deleteBus(trip: Trip) {
        const user: User = this.utils.getFromLocalStorage('user');
        let path = `cooperatives/${user.uidCooperative}/trips/${trip.id}`;
    
        const loading = await this.utils.loading();
        await loading.present();
    
        try {
          await this.firebase.deleteDocument(path);
          this.utils.showToast({
            message: 'Trip eliminado exitosamente',
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
    
      filterBuses() {
        const searchTerm = this.searchTerm.toLowerCase();
    
        if (searchTerm.trim() === '') {
          this.filteredTrips = this.trips;
        } else {
          this.filteredTrips = this.trips.filter(trip => {
            return (
              trip.id.toLowerCase().includes(searchTerm)
            );
          });
        }
  }

}
