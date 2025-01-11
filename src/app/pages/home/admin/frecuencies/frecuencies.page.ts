import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'firebase/firestore';
import { Frecuency } from 'src/app/models/frecuency.model';
import { User } from 'src/app/models/user.model';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-frecuencies',
  templateUrl: './frecuencies.page.html',
  styleUrls: ['./frecuencies.page.scss'],
})
export class FrecuenciesPage{

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)
  secondaryFirebase = inject(FirebaseSecondaryService)

  frecuencies: Frecuency[] = []
  filteredFrecuencies: Frecuency[]=[]
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
    let path = `cooperatives/${user.uidCooperative}/frecuencies`;
    this.loading = true;

    let query = [
      orderBy('__name__', 'asc')
    ]

    this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.frecuencies = res
        this.filterByBlockedStatus()
        this.loading = false;
      }
    })
  }

  async addUpdateFrecuency(frecuency?: Frecuency)
  {
    this.router.navigate(['/home/admin/frecuencies/create-frecuency'], { state: { frecuency } });
  }

  confirmDeleteFrecuency(frecuency: Frecuency) {
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

  async deleteFrecuency(frecuency: Frecuency) {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/frecuencies/${frecuency.id}`;

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
      let pathImage = await this.secondaryFirebase.getFilePath(frecuency.document)
      await this.secondaryFirebase.deleteFile(pathImage)
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

  filterFrecuencies() {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredFrecuencies = this.frecuencies;
    } else {
      this.filteredFrecuencies = this.frecuencies.filter(frecuency => {
        return (
          frecuency.id.toLowerCase().includes(searchTerm) ||
          frecuency.origin.toLowerCase().includes(searchTerm) ||
          frecuency.destiny.toLowerCase().includes(searchTerm)
        );
      });
    }
  }

  downloadDocument(p: Frecuency){
    const link = document.createElement('a');
    link.href = p.document;
    link.download = `Frecuencia ${p.id} ${p.origin} ${p.destiny}`;
    link.click();
  }

  constructor() {}

  confirmUnlockFrecuency(frecuency: Frecuency) {
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

  async unlockFrecuency(frecuency: Frecuency) {
    const user: User = this.utils.getFromLocalStorage('user');
    frecuency.isBlocked = false
    let path = `cooperatives/${user.uidCooperative}/frecuencies/${frecuency.id}`;

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

  filterByBlockedStatus() {
    this.filteredFrecuencies = this.frecuencies.filter(
        (frecuency) => frecuency.isBlocked === this.isOptionActive
    );
}

  onToggleChange(event: any) {
    this.isOptionActive = event.detail.checked
    this.searchTerm=''
    this.getFrecuencies()
  }

  confirmLockFrecuency(frecuency: Frecuency) {
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

  async lockFrecuency(frecuency: Frecuency) {
    const user: User = this.utils.getFromLocalStorage('user');
    frecuency.isBlocked = true
    let path = `cooperatives/${user.uidCooperative}/frecuencies/${frecuency.id}`;

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

}
