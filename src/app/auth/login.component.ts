import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from 'ng2-ui-auth';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ILoginData} from './auth.interfaces';
import {AppState} from '../app.service';
import {ErrorHandleService} from '../services/error-handle.service';
import {FormHelperService} from '../services/form-helper.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'my-login',
  templateUrl: './login-page.html',
  styleUrls: [ './login.less' ]
})

export class LoginComponent implements OnInit {
  public loggedUser: FormGroup;
  public errorMessage = '';

  constructor( private appState: AppState,
               private fb: FormBuilder,
               private auth: AuthService,
               private router: Router,
               private eh: ErrorHandleService,
               public fh: FormHelperService) {
  }

  public ngOnInit() {
    //console.log('Initial App State', this.appState.state);
    this.loggedUser = this.fb.group({
      username: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
    });
    this.submitState('login');
  }

  public login( loginData: ILoginData ): void {
    // console.log (' Login Data is ::: ' + JSON.stringify (loginData));
    this.auth.login(loginData).subscribe({
      next: ( response ) => this.loginSuccess(response),
      complete: () => this.router.navigateByUrl('home'),
      error: ( err: any ) => this.loginError(err)
    });
  }

  private loginSuccess( resp: any ): void {
    let loggedInfo = resp.json();
    localStorage.setItem('logged-user', JSON.stringify(loggedInfo.user));
    this.auth.setToken(loggedInfo.token);
  }

  private loginError( err: any ): void {
    this.errorMessage = err._body;
    this.eh.handleError(err);
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
