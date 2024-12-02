import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { FirebaseService } from './services/firebase.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  utils = inject(UtilsService)
  firebase = inject(FirebaseService)
  router = inject(Router)
  showMenu=true

  user: User = this.utils.getFromLocalStorage('user')
  
  public appPages = [
    { title: 'Buses', url: 'home/admin/bus', icon: 'train' },
    { title: 'Conductores', url: 'home/admin/drivers', icon: 'people' },
    { title: 'Oficinistas', url: 'home/admin/clerks', icon: 'briefcase' },
    { title: 'Taquilleros', url: './folder/archived', icon: 'cash' },
    { title: 'Frecuencias', url: './folder/trash', icon: 'git-branch' },
    { title: 'Socios', url: 'home/admin/partners', icon: 'people' },
  ];

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showMenu = !(currentUrl.includes('/auth') || currentUrl.includes('/auth/sign-up'));
    });
  }
  constructor() {}

  logOut(){
    this.utils.removeFromLocalStorage('user')
    this.utils.removeFromLocalStorage('cooperative')
    this.firebase.signOut()
    this.utils.navigateToHome()
  }
}
