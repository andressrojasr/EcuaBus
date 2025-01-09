import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy, where } from 'firebase/firestore';
import { Trip } from 'src/app/models/trip.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-booletery',
  templateUrl: './booletery.page.html',
  styleUrls: ['./booletery.page.scss'],
})
export class BooleteryPage{

  utils = inject(UtilsService)
    firebase = inject(FirebaseService)
    router = inject(Router)
  
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
  
    async getTrips() {
      const user: User = this.utils.getFromLocalStorage('user');
      const path = `cooperatives/${user.uidCooperative}/frecuencies`;
      this.loading = true;
    
      const query = [
        where('isBlocked', '==', false)
      ];
    
      this.firebase.getCollectionData(path, query).subscribe({
        next: async (res: any[]) => {
          this.trips = res;
          this.filteredTrips = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching frecuencies:', err);
          this.loading = false;
        },
      });
    }
  
    async openTrip(trip?: Trip)
    {
      this.router.navigate(['/home/taquilleros/booletery/trip'], { state: { trip } });
    }
  
  
    filterBuses() {
      const searchTerm = this.searchTerm.toLowerCase();
  
      if (searchTerm.trim() === '') {
        this.filteredTrips = this.trips;
      } else {
        this.filteredTrips = this.trips.filter(trip => {
          return (
            trip.origin.toLowerCase().includes(searchTerm) ||
            trip.destiny.toLowerCase().includes(searchTerm) ||
            trip.timeStart.toLowerCase().includes(searchTerm)
          );
        });
      }
    }
}
