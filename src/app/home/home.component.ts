import {Component, OnInit} from '@angular/core';
import {AppState} from '../app.service';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.less' ]
})
export class HomeComponent implements OnInit {
  public loggedUser;

  constructor( private appState: AppState ) {
  }

  ngOnInit() {
    this.submitState('home');
    this.loggedUser = JSON.parse(localStorage.getItem('logged-user'));
    //console.log(this.loggedUser.role, '  USER is ::   ', this.loggedUser);
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
