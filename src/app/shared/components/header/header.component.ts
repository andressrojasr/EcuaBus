import { Component, inject, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { ThemeService } from 'src/app/services/theme.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!:string;
  @Input() back!: boolean;

  navCtrl = inject(NavController)
  themeService = inject(ThemeService)
  utils = inject(UtilsService)

  theme: string;
  constructor() { }
  user: User = this.utils.getFromLocalStorage('user');
  
  ngOnInit() {
    this.theme =localStorage.getItem('theme') 
    this.themeService.loadTheme();
  }

  toggleTheme(event: any){
    this.themeService.setTheme(event.detail.checked)
  }
  goBack(){
    this.navCtrl.back()
  }
}
