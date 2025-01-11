import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy, where } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';
import { AdminapiService } from 'src/app/services/adminapi.service';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.page.html',
  styleUrls: ['./collector.page.scss'],
})
export class CollectorPage{

    utils = inject(UtilsService)
    firebase = inject(FirebaseService)
    router = inject(Router)
    api = inject(AdminapiService)
    secondaryFirebase= inject(FirebaseSecondaryService)
    collectors: User[] = []
    filteredCollectors: User[]=[]
    searchTerm: string = '';
    loading:boolean = false
    isOptionActive: boolean = false;
  
    ionViewWillEnter() {
      this.getCollectors()
    }
  
    doRefresh(event: any)
    {
      setTimeout(() => {
        this.getCollectors();
        event.target.complete();
      }, 1000);
    }
  
    
  
    async getCollectors() {
      const user: User = this.utils.getFromLocalStorage('user');
      let path = `users`;
      this.loading = true;
  
      let query = [
        orderBy('__name__', 'asc'),
        where('rol', '==', 'Cobrador'),
        where('uidCooperative', '==', user.uidCooperative)
      ]
  
      let sub = this.firebase.getCollectionData(path,query).subscribe({
        next: (res: any) => {
          this.collectors = res
          this.filterByBlockedStatus();
          this.loading = false;
        }
      })
    }
  
    async addUpdateCollector(collector?: User)
    {
      this.router.navigate(['/home/admin/collector/create-collector'], { state: { collector } });
    }
  
    confirmLockCollector(collector: User) {
      this.utils.presentAlert({
        header: 'Bloquear cobrador',
        message: '¿Estás seguro de bloquear a este cobrador?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Bloquear',
            handler: () => this.lockCollector(collector),
          },
        ],
      });
    }
  
    confirmUnlockCollector(collector: User) {
      this.utils.presentAlert({
        header: 'Desbloquear cobrador',
        message: '¿Estás seguro de desbloquear a este cobrador?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Desbloquear',
            handler: () => this.unlockCollector(collector),
          },
        ],
      });
    }
  
    async lockCollector(collector: User) {
      const user: User = this.utils.getFromLocalStorage('user');
      collector.isBlocked = true
      let path = `users/${collector.uid}`;
  
      const loading = await this.utils.loading();
      await loading.present();
  
      try {
        await this.firebase.updateDocument(path, collector);
        this.utils.showToast({
          message: 'Cobrador bloqueado exitosamente',
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
  
    async unlockCollector(collector: User) {
      const user: User = this.utils.getFromLocalStorage('user');
      collector.isBlocked = false
      let path = `users/${collector.uid}`;
  
      const loading = await this.utils.loading();
      await loading.present();
  
      try {
        await this.firebase.updateDocument(path, collector);
        this.utils.showToast({
          message: 'Cobrador desbloqueado exitosamente',
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
  
    confirmDeleteCollector(collector: User) {
      this.utils.presentAlert({
        header: 'Eliminar cobrador',
        message: '¿Estás seguro de eliminar a este cobrador?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Eliminar',
            handler: () => this.deleteCollector(collector),
          },
        ],
      });
    }
  
    async deleteCollector(collector: User) {
      const loading = await this.utils.loading()
      await loading.present()
      let pathImage = await this.secondaryFirebase.getFilePath(collector.photo)
      this.api.deleteUser(collector.uid, collector.uidCooperative, 'collectors').subscribe({
        next: async () => {
          await this.secondaryFirebase.deleteFile(pathImage)
          this.utils.showToast({
            message: 'Cobrador eliminado exitosamente',
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
  
    filterCollectors() {
      const searchTerm = this.searchTerm.toLowerCase();
  
      if (searchTerm.trim() === '') {
        this.filteredCollectors = this.collectors;
      } else {
        this.filteredCollectors = this.collectors.filter(collector => {
          const complete = collector.name+collector.lastName
          return (
            collector.card.toLowerCase().includes(searchTerm) ||
            collector.name.toLowerCase().includes(searchTerm)||
            collector.lastName.toLowerCase().includes(searchTerm)||
            collector.email.toLowerCase().includes(searchTerm)||
            complete.toLowerCase().includes(searchTerm)
          );
        });
      }
    }
  
    filterByBlockedStatus() {
      this.filteredCollectors = this.collectors.filter(
          (collector) => collector.isBlocked === this.isOptionActive
      );
  }
  
    onToggleChange(event: any) {
      this.isOptionActive = event.detail.checked
      this.searchTerm=''
      this.getCollectors()
    }
  
    constructor() {}

}
