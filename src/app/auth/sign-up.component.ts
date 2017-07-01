import {Component, OnInit} from '@angular/core';
import {AuthService} from 'ng2-ui-auth';
import {Router} from '@angular/router';
import {FormGroup, AbstractControl, FormBuilder, Validators, FormControl} from '@angular/forms';
import {FormHelperService} from '../services/form-helper.service';
import {AppState} from '../app.service';
import {ErrorHandleService} from '../services/error-handle.service';

@Component({
  selector: 'my-register',
  templateUrl: './sign-up-page.html',
  styleUrls: [ './login.less' ],
})

export class SignUpComponent implements OnInit {
  public registerUser: FormGroup;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public username: AbstractControl;
  public password: AbstractControl;
  public phoneNumber: AbstractControl;
  public email: AbstractControl;
  public role: AbstractControl;
  public confirm: AbstractControl;
  public errorMessage = '';

  public datesList = [];
  public monthList = [];
  public yearList = [];
  public roleList = [ {name: 'ADMIN'}, {name: 'USER'}, {name: 'MODERATOR'} ];

  constructor( public appState: AppState,
               private fb: FormBuilder,
               private auth: AuthService,
               private router: Router,
               private eh: ErrorHandleService,
               public fh: FormHelperService ) {
  }

  public ngOnInit(): void {
    this.getDates();
    this.getMonths();
    this.getYears();
    this.registerUser = this.fb.group({
      firstName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      username: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      email: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      phoneNumber: new FormControl('', [ Validators.required, Validators.maxLength(10) ]),
      password: new FormControl('', [ Validators.required, Validators.minLength(7) ]),
      role: new FormControl('', [ Validators.required ]),
      day: new FormControl('', [ Validators.required ]),
      month: new FormControl('', [ Validators.required ]),
      year: new FormControl('', [ Validators.required ]),
      confirm: new FormControl('', [ Validators.required ]),
    }, {
      validator: this.fh.matchingPasswords('password', 'confirm')
    });
  }

  public register( signUpData: any ) {
    this.auth.signup(signUpData).subscribe({
      next: ( response ) => console.log(' getting Response from server ', response),
      error: ( err: any ) => this.singUpError(err),
      complete: () => this.router.navigateByUrl('/')
    });
  }

  private singUpError( err: any ) {
    this.errorMessage = err._body;
    this.eh.handleError(err);
  }

  private getDates() {
    for (let i = 1; i <= 31; i++) {
      this.datesList.push(i);
    }
  }

  private getMonths() {
    this.monthList = [
      {id: 0, name: 'January'},
      {id: 1, name: 'February'},
      {id: 2, name: 'March'},
      {id: 3, name: 'April'},
      {id: 4, name: 'May'},
      {id: 5, name: 'June'},
      {id: 6, name: 'July'},
      {id: 7, name: 'August'},
      {id: 8, name: 'September'},
      {id: 9, name: 'October'},
      {id: 10, name: 'November'},
      {id: 11, name: 'December'}
    ];
  }

  private getYears() {
    let max = new Date().getFullYear();
    let min = max - 40;
    for (let i = max; i >= min; i--) {
      this.yearList.push(i);
    }
  }
}
