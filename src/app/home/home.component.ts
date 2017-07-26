import {Component, OnInit} from '@angular/core';
import {AppState} from '../app.service';
import {AuthService} from 'ng2-ui-auth';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.less' ]
})
export class HomeComponent implements OnInit {
  public loggedUser;
  constructor( private appState: AppState,
               private auth: AuthService) {
  }

  ngOnInit() {
    this.submitState('home');
    this.loggedUser = this.auth.getPayload();
    //console.log(this.loggedUser.role, '  USER is ::   ', this.loggedUser);
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
