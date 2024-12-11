import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy, where } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.page.html',
  styleUrls: ['./drivers.page.scss'],
})
export class DriversPage {

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)
  drivers: User[] = []
  filteredDrivers: User[]=[]
  searchTerm: string = '';
  loading:boolean = false
  isOptionActive: boolean = false;

  ionViewWillEnter() {
    this.getDrivers()
  }

  doRefresh(event: any)
  {
    setTimeout(() => {
      this.getDrivers();
      event.target.complete();
    }, 1000);
  }

  

  async getDrivers() {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/drivers`;
    this.loading = true;

    let query = [
      orderBy('__name__', 'asc'),
    ]

    this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.drivers = res
        this.filterByBlockedStatus();
        this.loading = false;
      }
    })
  }

  async addUpdateDriver(driver?: User)
  {
    this.router.navigate(['/home/admin/drivers/create-driver'], { state: { driver } });
  }

  confirmDeleteDriver(driver: User) {
    this.utils.presentAlert({
      header: 'Bloquear conductor',
      message: '¿Estás seguro de bloquear a este conductor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Bloquear',
          handler: () => this.deleteDriver(driver),
        },
      ],
    });
  }

  confirmUnlockDriver(driver: User) {
    this.utils.presentAlert({
      header: 'Desbloquear conductor',
      message: '¿Estás seguro de desbloquear a este conductor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Desbloquear',
          handler: () => this.UnlockDriver(driver),
        },
      ],
    });
  }

  async deleteDriver(driver: User) {
    const user: User = this.utils.getFromLocalStorage('user');
    driver.isBlocked = true
    let path = `cooperatives/${user.uidCooperative}/drivers/${driver.uid}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, driver);
      this.utils.showToast({
        message: 'Conductor bloqueado exitosamente',
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

  async UnlockDriver(driver: User) {
    const user: User = this.utils.getFromLocalStorage('user');
    driver.isBlocked = false
    let path = `cooperatives/${user.uidCooperative}/drivers/${driver.uid}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, driver);
      this.utils.showToast({
        message: 'Conductor desbloqueado exitosamente',
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

  filterDrivers() {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredDrivers = this.drivers;
    } else {
      this.filteredDrivers = this.drivers.filter(driver => {
        const complete = driver.name+driver.lastName
        return (
          driver.card.toLowerCase().includes(searchTerm) ||
          driver.name.toLowerCase().includes(searchTerm)||
          driver.lastName.toLowerCase().includes(searchTerm)||
          driver.email.toLowerCase().includes(searchTerm)||
          complete.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  filterByBlockedStatus() {
    this.filteredDrivers = this.drivers.filter(
        (driver) => driver.isBlocked === this.isOptionActive
    );
}

  onToggleChange(event: any) {
    this.isOptionActive = event.detail.checked; // Actualiza el valor del toggle
    this.searchTerm=''
    this.getDrivers(); // Recarga conductores basados en el filtro
  }

  constructor() {}

}
