import {Component, OnInit} from '@angular/core';

import {ApiService} from './shared';
import {AppState} from './app.service';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean;
  public title: string;

  constructor( private appState: AppState,
               private api: ApiService ) {
    this.title = this.api.title;
  }

  ngOnInit() {
    //let token = localStorage.getItem('event-manager_token');
    //console.log(changes);
    this.isLoggedIn = this.appState.state !== 'login';//localStorage.getItem('event-manager_token') !== '';
  }
}
