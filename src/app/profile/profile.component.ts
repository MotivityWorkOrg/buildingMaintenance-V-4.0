import {Component, OnInit} from '@angular/core';
import {AppState} from '../app.service';
import {AuthService} from 'ng2-ui-auth';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.html',
  styleUrls: [ './user-profile.less' ],
})

export class ProfileComponent implements OnInit {
  //public profileForm: FormGroup;
  public editableTextName = 'Ravi Kumar';
  public isAdmin: boolean;

  constructor( private appState: AppState,
               private auth: AuthService ) {
    //console.log('In Profile Page');
  }

  ngOnInit() {
    this.submitState('Profile Page');
    this.isAdmin = this.auth.getPayload().role !== 'ADMIN';
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
