import {Component, OnInit} from '@angular/core';
import {AuthService} from 'ng2-ui-auth';
import {Router} from '@angular/router';
import {FormGroup, AbstractControl, FormBuilder, Validators, FormControl} from '@angular/forms';
import {FormHelperService} from '../services/form-helper.service';
import {AppState} from '../app.service';
import {ErrorHandleService} from '../services/error-handle.service';
import {CommonUtil} from '../util/CommonUtil';

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
  public imageContent = '';
  public imageSizeError = '';
  public datesList = [];
  public monthList = [];
  public yearList = [];
  public roleList = [ {name: 'ADMIN'}, {name: 'USER'}, {name: 'MODERATOR'} ];
  private fileType = '';

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
      confirm: new FormControl('', [ Validators.required ])
    }, {
      validator: this.fh.matchingPasswords('password', 'confirm')
    });
    this.submitState('SignUP');
  }

  public registerNewUser(): void {
    let signUpData = this.registerUser.value;
    //signUpData.imageData = this.imageContent;
    //console.log(' Sign up data is  :: ', signUpData);
    this.auth.signup(signUpData).subscribe({
      next: ( response ) => console.log(' getting Response from server ', response),
      error: ( err: any ) => this.singUpError(err),
      complete: () => this.router.navigateByUrl('/')
    });
  }

  public handleFileSelect( evt ): void {
    let files = evt.target.files;
    let file = files[ 0 ];
    this.imageSizeError = '';
    this.imageContent = '';
    if (files && file) {
      let imageSizeInMB = ((file.size) / 1024) / 1024;
      //console.log('type   ', this.fileType, ' File ::  ', file, ' SIZE ', Math.round(imageSizeInMB * 100) / 100);
      if (Math.round(imageSizeInMB * 100) / 100 <= 2.0) {
        this.fileType = file.type;
        let reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      } else {
        this.imageSizeError = 'Image size should be less than 2 MB';
      }
    }
  }

  private _handleReaderLoaded( readerEvt ): void {
    this.imageContent = CommonUtil.convertImageToBase64String(this.fileType, readerEvt.target.result);
    //this.registerUser.value.imageData = this.imageContent;
    //console.log(this.registerUser.value.imageData);
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

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
