import {Component, OnInit} from '@angular/core';
import {AppState} from '../app.service';
import {FormHelperService} from '../services/form-helper.service';

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
               public fh: FormHelperService ) {
    //console.log('In Profile Page');
  }

  ngOnInit() {
    this.submitState('Profile Page');
    this.isAdmin = JSON.parse(localStorage.getItem('logged-user')).role !== 'ADMIN';
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
