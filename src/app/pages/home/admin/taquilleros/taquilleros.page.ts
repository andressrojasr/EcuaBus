import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-taquilleros',
  templateUrl: './taquilleros.page.html',
  styleUrls: ['./taquilleros.page.scss'],
})
export class TaquillerosPage {

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)
  taquilleros: User[] = []
  filteredTaquilleros: User[]=[]
  searchTerm: string = '';
  loading:boolean = false
  isOptionActive: boolean = false;

  ionViewWillEnter() {
    this.getTaquilleros()
  }

  doRefresh(event: any)
  {
    setTimeout(() => {
      this.getTaquilleros();
      event.target.complete();
    }, 1000);
  }

  

  async getTaquilleros() {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/taquilleros`;
    this.loading = true;

    let query = [
      orderBy('__name__', 'asc'),
    ]

    let sub = this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.taquilleros = res
        this.filterByBlockedStatus();
        this.loading = false;
      }
    })
  }

  async addUpdateTaquillero(taquillero?: User)
  {
    this.router.navigate(['/home/admin/taquilleros/create-taquillero'], { state: { taquillero } });
  }

  confirmDeleteTaquillero(taquillero: User) {
    this.utils.presentAlert({
      header: 'Bloquear taquillero',
      message: '¿Estás seguro de bloquear a este taquillero?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Bloquear',
          handler: () => this.deleteTaquillero(taquillero),
        },
      ],
    });
  }

  confirmUnlockTaquillero(taquillero: User) {
    this.utils.presentAlert({
      header: 'Desbloquear taquillero',
      message: '¿Estás seguro de desbloquear a este taquillero?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Desbloquear',
          handler: () => this.unlockTaquillero(taquillero),
        },
      ],
    });
  }

  async deleteTaquillero(taquillero: User) {
    const user: User = this.utils.getFromLocalStorage('user');
    taquillero.isBlocked = true
    let path = `cooperatives/${user.uidCooperative}/taquilleros/${taquillero.uid}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, taquillero);
      this.utils.showToast({
        message: 'Taquillero bloqueado exitosamente',
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

  async unlockTaquillero(taquillero: User) {
    const user: User = this.utils.getFromLocalStorage('user');
    taquillero.isBlocked = false
    let path = `cooperatives/${user.uidCooperative}/taquilleros/${taquillero.uid}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, taquillero);
      this.utils.showToast({
        message: 'Taquillero desbloqueado exitosamente',
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

  filterTaquilleros() {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredTaquilleros = this.taquilleros;
    } else {
      this.filteredTaquilleros = this.taquilleros.filter(taquillero => {
        const complete = taquillero.name+taquillero.lastName
        return (
          taquillero.card.toLowerCase().includes(searchTerm) ||
          taquillero.name.toLowerCase().includes(searchTerm)||
          taquillero.lastName.toLowerCase().includes(searchTerm)||
          taquillero.email.toLowerCase().includes(searchTerm)||
          complete.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  filterByBlockedStatus() {
    this.filteredTaquilleros = this.taquilleros.filter(
        (taquillero) => taquillero.isBlocked === this.isOptionActive
    );
}

  onToggleChange(event: any) {
    this.isOptionActive = event.detail.checked
    this.searchTerm=''
    this.getTaquilleros()
  }

  constructor() {}

}
