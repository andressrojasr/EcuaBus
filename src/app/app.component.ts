import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from './services/utils.service';
import { User } from 'firebase/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  utils = inject(UtilsService)
  router = inject(Router)
  showMenu=true

  user: User = this.utils.getFromLocalStorage('user')
  
  public appPages = [
    { title: 'Buses', url: 'home/admin/bus', icon: 'train' },
    { title: 'Conductores', url: 'home/admin/bus/create-bus', icon: 'people' },
    { title: 'Oficinistas', url: './folder/favorites', icon: 'briefcase' },
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
}
