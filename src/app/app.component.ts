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

  user: User | null = null;
  
  public appPages = [
    { title: 'Buses', url: 'home/admin/bus', icon: 'train' },
    { title: 'Conductores', url: 'home/admin/drivers', icon: 'people' },
    { title: 'Oficinistas', url: 'home/admin/clerks', icon: 'briefcase' },
    { title: 'Taquilleros', url: 'home/admin/taquilleros', icon: 'cash' },
    { title: 'Frecuencias', url: 'home/admin/frecuencies', icon: 'git-branch' },
    { title: 'Socios', url: 'home/admin/partners', icon: 'people' },
    { title: 'Cooperativa', url: 'home/admin/cooperative', icon: 'business' },
  ];

  ngOnInit(): void {
    this.utils.user$.subscribe((user) => {
      this.user = user;
    });
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
