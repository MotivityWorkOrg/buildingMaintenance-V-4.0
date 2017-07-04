import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaintenanceService} from '../../services/maintenance.service';
import {FormHelperService} from '../../services/form-helper.service';
import {AppState} from '../../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.html',
  styleUrls: [ '../login.less' ]
})
export class ResetPasswordComponent implements OnInit {

  public resetForm: FormGroup;
  public passwordExpired = false;
  public isFormSubmitted = false;

  constructor( private appState: AppState,
               private router: Router,
               private fb: FormBuilder,
               public fh: FormHelperService,
               private maintenanceService: MaintenanceService ) {

  }

  public ngOnInit() {
    this.submitState('reset-password');
    this.resetForm = this.fb.group({
      oldPassword: new FormControl('', [ Validators.required, Validators.maxLength(10) ]),
      newPassword: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
      confirm: new FormControl('', [ Validators.required ]),
    }, {
      validator: this.fh.matchingPasswords('newPassword', 'confirm')
    });

  }

  public resetNewPassword( form: FormGroup ): void {
    console.log(form.value);
    if (form.valid) {
      let obj: any = {};
      obj.oldPassword = form.value.oldPassword;
      obj.password = form.value.newPassword;
      this.maintenanceService.changePassword(obj)
        .then(( res ) => {
          console.log(' Response is    ', res);
          this.router.navigateByUrl('');
        })
        .catch(( err ) => {
          console.log(' Error is   ', err);
        });
    }
  }

  private submitState( value: string ): void {
    console.log('submitState   ', value);
    this.appState.set('value', value);
  }
}
