import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy, where } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { AdminapiService } from 'src/app/services/adminapi.service';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-clerks',
  templateUrl: './clerks.page.html',
  styleUrls: ['./clerks.page.scss'],
})
export class ClerksPage {

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)
  secondaryFirebase= inject(FirebaseSecondaryService)
  api = inject(AdminapiService)
  clerks: User[] = []
  filteredClerks: User[]=[]
  searchTerm: string = '';
  loading:boolean = false
  isOptionActive: boolean = false;

  ionViewWillEnter() {
    this.getClerks()
  }

  doRefresh(event: any)
  {
    setTimeout(() => {
      this.getClerks();
      event.target.complete();
    }, 1000);
  }

  

  async getClerks() {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `users`;
    this.loading = true;

    let query = [
      orderBy('__name__', 'asc'),
      where('rol', '==', 'Oficinista'),
      where('uidCooperative', '==', user.uidCooperative)
    ]

    let sub = this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.clerks = res
        this.filterByBlockedStatus();
        this.loading = false;
      }
    })
  }

  async addUpdateClerk(clerk?: User)
  {
    this.router.navigate(['/home/admin/clerks/create-clerk'], { state: { clerk } });
  }

  confirmLockClerk(clerk: User) {
    this.utils.presentAlert({
      header: 'Bloquear oficinista',
      message: '¿Estás seguro de bloquear a este oficinista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Bloquear',
          handler: () => this.lockClerk(clerk),
        },
      ],
    });
  }

  confirmUnlockClerk(clerk: User) {
    this.utils.presentAlert({
      header: 'Desbloquear oficinista',
      message: '¿Estás seguro de desbloquear a este oficinista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Desbloquear',
          handler: () => this.unlockClerk(clerk),
        },
      ],
    });
  }

  async lockClerk(clerk: User) {
    const user: User = this.utils.getFromLocalStorage('user');
    clerk.isBlocked = true
    let path = `users/${clerk.uid}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, clerk);
      this.utils.showToast({
        message: 'Oficinista bloqueado exitosamente',
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

  async unlockClerk(clerk: User) {
    const user: User = this.utils.getFromLocalStorage('user');
    clerk.isBlocked = false
    let path = `users/${clerk.uid}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.updateDocument(path, clerk);
      this.utils.showToast({
        message: 'Oficinista desbloqueado exitosamente',
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

  confirmDeleteClerk(clerk: User) {
    this.utils.presentAlert({
      header: 'Eliminar oficinista',
      message: '¿Estás seguro de eliminar a este oficinista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteClerk(clerk),
        },
      ],
    });
  }

  async deleteClerk(clerk: User) {
    const loading = await this.utils.loading()
    await loading.present()
    let pathImage = await this.secondaryFirebase.getFilePath(clerk.photo)
    this.api.deleteUser(clerk.uid, clerk.uidCooperative, 'clerks').subscribe({
      next: async () => {
        await this.secondaryFirebase.deleteFile(pathImage)
        this.utils.showToast({
          message: 'Oficinista eliminado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      },
      error: (error) => {
        this.utils.showToast({
          message:"Ha ocurrido un error",
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      }, 
      complete: () => {
       loading.dismiss()
      }
    });
  }

  filterClerks() {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredClerks = this.clerks;
    } else {
      this.filteredClerks = this.clerks.filter(clerk => {
        const complete = clerk.name+clerk.lastName
        return (
          clerk.card.toLowerCase().includes(searchTerm) ||
          clerk.name.toLowerCase().includes(searchTerm)||
          clerk.lastName.toLowerCase().includes(searchTerm)||
          clerk.email.toLowerCase().includes(searchTerm)||
          complete.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  filterByBlockedStatus() {
    this.filteredClerks = this.clerks.filter(
        (clerk) => clerk.isBlocked === this.isOptionActive
    );
}

  onToggleChange(event: any) {
    this.isOptionActive = event.detail.checked; // Actualiza el valor del toggle
    this.searchTerm=''
    this.getClerks(); // Recarga conductores basados en el filtro
  }

  constructor() {}

}
