import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'firebase/firestore';

import { Travel } from 'src/app/models/travel.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  styleUrls: ['./trips.page.scss'],
})
export class TripsPage {

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)

  frecuencies: Travel[] = []
  filteredFrecuencies: Travel[]=[]
  searchTerm: string = '';
  loading:boolean = false
  isOptionActive: boolean = false;

  ionViewWillEnter() {
    this.getFrecuencies()
  }

  doRefresh(event: any)
  {
    setTimeout(() => {
      this.getFrecuencies();
      event.target.complete();
    }, 1000);
  }

  async getFrecuencies() {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/viajes`;
    this.loading = true;
    let query = [
      orderBy('__name__', 'asc')
    ]

    this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.frecuencies = res
        this.filteredFrecuencies =this.frecuencies
        console.log("PATAT0TA", JSON.stringify(this.frecuencies, null, 2));
        this.loading = false;
      }
    })
  }

  async addUpdateFrecuency(frecuency?: Travel)
  {
    this.router.navigate(['/home/clerk/trips/create-travels'], { state: { frecuency } });
  }





  filterFrecuencies() {
    const searchTerm = this.searchTerm.toLowerCase();
    console.log("velociraptor00")
    if (searchTerm.trim() === '') {
      this.filteredFrecuencies = this.frecuencies;
      console.log("velociraptor")
    } else {
      this.filteredFrecuencies = this.frecuencies.filter(frecuency => {
        return (
          frecuency.id.toLowerCase().includes(searchTerm) ||
          frecuency.conductor.toLowerCase().includes(searchTerm) ||
          frecuency.idbus.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  downloadDocument(p: Travel){
    const link = document.createElement('a');
    link.download = `Frecuencia ${p.id} ${p.conductor} ${p.idbus}`;
    link.click();
  }

  constructor() {}

  confirmUnlockFrecuency(frecuency: Travel) {
    this.utils.presentAlert({
      header: 'Desbloquear Frecuencia',
      message: '¿Estás seguro de desbloquear esta frecuencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Desbloquear',
          handler: () => this.unlockFrecuency(frecuency),
        },
      ],
    });
  }

  async unlockFrecuency(frecuency: Travel) {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/viajes/${frecuency.id}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, frecuency);
      this.utils.showToast({
        message: 'Frecuencia desbloqueada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
      this.searchTerm=''
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





  confirmLockFrecuency(frecuency: Travel) {
    this.utils.presentAlert({
      header: 'Bloquear Frecuencia',
      message: '¿Estás seguro de bloquear esta frecuencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Bloquear',
          handler: () => this.lockFrecuency(frecuency),
        },
      ],
    });
  }

  async lockFrecuency(frecuency: Travel) {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/viajes/${frecuency.id}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, frecuency);
      this.utils.showToast({
        message: 'Frecuencia bloqueada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
      this.searchTerm=''
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


  editFrecuency(frecuency: Travel) {
    // Navegar asía la página de crear/actualizar frecuencia
    this.router.navigate(['/home/clerk/trips/create-travels'], { state: { frecuency: frecuency } });
  }
  
  // Método para confirmar la eliminación de una frecuencia
  confirmDeleteFrecuency(frecuency: Travel) {
    this.utils.presentAlert({
      header: 'Eliminar frecuencia',
      message: '¿Estás seguro de eliminar esta frecuencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteFrecuency(frecuency),
        },
      ],
    });
  }
  
  // Método para eliminar una frecuencia
  async deleteFrecuency(frecuency: Travel) {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/viajes/${frecuency.id}`;
  
    const loading = await this.utils.loading();
    await loading.present();
  
    try {
      await this.firebase.deleteDocument(path);
      this.utils.showToast({
        message: 'Frecuencia eliminada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
      // Volver a cargar las frecuencias después de eliminar
      this.getFrecuencies();
    } catch (error) {
      this.utils.showToast({
        message: "Ha ocurrido un error",
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
