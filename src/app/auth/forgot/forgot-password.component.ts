import {Component, OnInit} from '@angular/core';
import {MaintenanceService} from '../../services/maintenance.service';
import {AppState} from '../../app.service';
import {FormHelperService} from '../../services/form-helper.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GlobalValidator} from '../../validators/global.validators';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: [ '../login.less' ]
})
export class ForgotPasswordComponent implements OnInit {
  public isFormSubmitted = false;
  public resetForm: FormGroup;
  public errorMessage = '';

  constructor( private appState: AppState,
               private fb: FormBuilder,
               public fh: FormHelperService,
               private maintenanceService: MaintenanceService ) {

  }

  public ngOnInit() {
    this.resetForm = this.fb.group({
      email: new FormControl('', [ Validators.required, GlobalValidator.mailFormat ])
    });
    this.submitState('forgot-password');
  }

  public resetPass( form: FormGroup ) {
    this.isFormSubmitted = true;
    let email: string = form.value;
    console.log(form.value, ' Is Form Valid   ', form.valid);
    if (form.valid) {
      this.maintenanceService.resetPassword(email).then(( ) => {
        this.errorMessage = '';
        //console.log(' Response is   ', response);
      }).catch(( ) => {
        this.errorMessage = 'Email is not found';
        //console.log(' Error Getting    ', err.message);
      });
    }
  }

  private submitState( value: string ): void {
    console.log('submitState   ', value);
    this.appState.set('value', value);
  }
}
