import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Cooperative } from 'src/app/models/cooperative.model';
import { User } from 'src/app/models/user.model';
import { ThemeService } from 'src/app/services/theme.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() back!: boolean;

  navCtrl = inject(NavController)
  themeService = inject(ThemeService)
  utils = inject(UtilsService)
  router = inject(Router)
  showTitle = true;

  theme: string;
  constructor() { }
  user: User;
  cooperative: Cooperative;
  ngOnInit() {
    this.user = this.utils.getFromLocalStorage('user');
    this.cooperative = this.utils.getFromLocalStorage('cooperative')
    this.theme =localStorage.getItem('theme') 
    this.themeService.loadTheme();
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      this.showTitle = !(currentUrl.includes('/auth') || currentUrl.includes('/auth/sign-up'));
    });
  }

  toggleTheme(event: any){
    this.themeService.setTheme(event.detail.checked)
  }
  goBack(){
    this.navCtrl.back()
  }
}
