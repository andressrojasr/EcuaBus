import { Component, inject, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!:string;

  themeService = inject(ThemeService)
  constructor() { }
  ngOnInit() {
    this.themeService.loadTheme();
  }

  toggleTheme(event: any){
    this.themeService.setTheme(event.detail.checked)
  }
}
