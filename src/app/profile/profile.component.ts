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

  constructor( private appState: AppState,
               public fh: FormHelperService ) {

  }

  ngOnInit() {
    this.submitState('Profile Page');
    /*this.profileForm = this.fb.group({
      firstName: new FormControl('', [ Validators.maxLength(3) ])
    });*/
    this.setDefaultData();
  }

  private setDefaultData(): void {
    //this.profileForm.controls.firstName.setValue('Ravi Kumar');
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
