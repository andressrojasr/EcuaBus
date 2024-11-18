import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  public appPages = [
    { title: 'Inbox', url: '', icon: 'mail' },
    { title: 'Outbox', url: './folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: './folder/favorites', icon: 'heart' },
    { title: 'Archived', url: './folder/archived', icon: 'archive' },
    { title: 'Trash', url: './folder/trash', icon: 'trash' },
    { title: 'Spam', url: './folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];


}
