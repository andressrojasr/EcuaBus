import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { orderBy } from 'firebase/firestore';
import { Partner } from 'src/app/models/partners.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
})
export class PartnersPage {

  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)

  partners: Partner[] = []
  filteredPartners: Partner[]=[]
  searchTerm: string = '';
  loading:boolean = false

  ionViewWillEnter() {
    this.getPartners()
  }

  doRefresh(event: any)
  {
    setTimeout(() => {
      this.getPartners();
      event.target.complete();
    }, 1000);
  }

  

  async getPartners() {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/partners`;
    this.loading = true;

    let query = [
      orderBy('__name__', 'asc')
    ]

    let sub = this.firebase.getCollectionData(path,query).subscribe({
      next: (res: any) => {
        this.partners = res
        this.filteredPartners = this.partners
        this.loading = false;
      }
    })
  }

  async addUpdatePartner(partner?: Partner)
  {
    this.router.navigate(['/home/admin/partners/create-partner'], { state: { partner } });
  }

  confirmDeletePartner(partner: Partner) {
    this.utils.presentAlert({
      header: 'Eliminar socio',
      message: '¿Estás seguro de eliminar a este socio, se eliminaran los buses asociados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => this.deletePartner(partner),
        },
      ],
    });
  }

  async deletePartner(partner: Partner) {
    const user: User = this.utils.getFromLocalStorage('user');
    let path = `cooperatives/${user.uidCooperative}/partners/${partner.id}`;

    const loading = await this.utils.loading();
    await loading.present();

    try {
      await this.firebase.deleteDocument(path);
      this.utils.showToast({
        message: 'Socio eliminado exitosamente',
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

  filterPartners() {
    const searchTerm = this.searchTerm.toLowerCase();

    if (searchTerm.trim() === '') {
      this.filteredPartners = this.partners;
    } else {
      this.filteredPartners = this.partners.filter(partner => {
        return partner.name.toLowerCase().includes(searchTerm);
      });
    }
  }

  constructor() {}

}
