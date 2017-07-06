import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaintenanceService} from '../services/maintenance.service';
import {AppState} from '../app.service';
import {ErrorHandleService} from '../services/error-handle.service';
import {FormHelperService} from '../services/form-helper.service';
import {GlobalValidator} from '../validators/global.validators';
import {FlatUser} from '../vo/flat-user.vo';
import {Tenant} from '../vo/tenant.vo';
import {CommonUtil} from '../util/CommonUtil';

@Component({
  selector: 'flats-info',
  templateUrl: './flats.html',
  styleUrls: [ './flats.less' ]
})

export class FlatsInfoComponent implements OnInit {
  public flatsForm: FormGroup;
  public tenantForm: FormGroup;
  public isAdminView: boolean;
  public errorMessage = '';
  public flats = [];
  public isFormSubmitted: boolean;
  public flatUsersInfo = {};
  public isTenant: boolean;
  public isOwnerChecked: boolean;
  public isFormUpdate: boolean;

  constructor( private maintenanceService: MaintenanceService,
               private eh: ErrorHandleService,
               private fb: FormBuilder,
               public fh: FormHelperService,
               private appState: AppState ) {

  }

  public ngOnInit() {
    this.getListOfFlats();
    this.submitState('flats-view');
    this.flatsForm = this.fb.group({
      _id: new FormControl('', [ Validators.required ]),
      firstName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      phoneNumber: new FormControl('', [ Validators.required, Validators.minLength(10), Validators.maxLength(10) ]),
      altNumber: new FormControl('', [ Validators.required, Validators.minLength(10), Validators.maxLength(10) ]),
      email: new FormControl('', [ Validators.required, GlobalValidator.mailFormat ]),
      isOccupied: new FormControl(true, [ Validators.nullValidator ])
    });

    this.tenantForm = this.fb.group({
      firstName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(3) ]),
      phoneNumber: new FormControl('', [ Validators.required, Validators.minLength(10), Validators.maxLength(10) ]),
      altNumber: new FormControl('', [ Validators.required, Validators.minLength(10), Validators.maxLength(10) ]),
      email: new FormControl('', [ Validators.required, GlobalValidator.mailFormat ])
    });
    let userInfo: any = JSON.parse(localStorage.getItem('logged-user'));
    this.isAdminView = userInfo.role === 'ADMIN';
    this.getFlatsUserInfo();
  }

  public addFlat(): void {
    this.isFormSubmitted = true;
    this.isOwnerChecked = true;
    this.errorMessage = '';
    if (this.isFormValid()) {
      let obj: any = {};
      let owner: FlatUser = this.flatsForm.value;
      owner._id = Number(owner._id);
      if (!owner.isOccupied) {
        let tenant: Tenant = this.tenantForm.value;
        tenant._id = Number(owner._id);
        obj.tenant = tenant;
      }
      obj.owner = owner;
      obj.owner.tenant = obj.tenant ? obj.tenant._id : null;
      this.maintenanceService.addFlatsOwnerInfo(obj, this.isFormUpdate)
        .then(( res ) => {
          console.log(res.status, '  Response is ::: ', res);
          if (res.status === 200) {
            this.getFlatsUserInfo();
            this.isFormSubmitted = false;
            this.isOwnerChecked = false;
            this.resetData();
          } else {
            this.errorMessage = res.error;
          }
        })
        .catch(( err ) => {
          console.log(' Error got from server :::  ', err);
          this.errorMessage = err.message;
        });
    }
  }

  public resetData(): void {
    this.flatsForm = this.fb.group({
      _id: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phoneNumber: new FormControl(''),
      altNumber: new FormControl(''),
      email: new FormControl(''),
      isOccupied: new FormControl(true)
    });
    this.tenantForm = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phoneNumber: new FormControl(''),
      altNumber: new FormControl(''),
      email: new FormControl('')
    });
    this.isChecked();
    this.isFormUpdate = false;
  }

  public updateFlatInfo( flat ): void {
    this.isFormUpdate = true;
    this.flatsForm = this.fb.group({
      _id: flat._id,
      firstName: flat.firstName,
      lastName: flat.lastName,
      phoneNumber: flat.phoneNumber,
      altNumber: flat.altNumber,
      email: flat.email,
      isOccupied: flat.isOccupied,
    });
    if (flat.tenant) {
      this.tenantForm = this.fb.group({
        firstName: flat.tenant.firstName,
        lastName: flat.tenant.lastName,
        phoneNumber: flat.tenant.phoneNumber,
        altNumber: flat.tenant.altNumber,
        email: flat.tenant.email
      });
    }
    this.isChecked();
  }

  public isChecked() {
    this.isOwnerChecked = false;
    this.isTenant = !this.flatsForm.controls[ 'isOccupied' ].value;
  }

  private isFormValid(): boolean {
    return this.flatsForm.valid && (!this.isTenant || this.tenantForm.valid);
  }

  private getFlatsUserInfo(): void {
    this.maintenanceService.getFlatsUserInfo()
      .then(( res ) => {
        //console.log(res.data.owners, '  Data is Coming form server ', res.data.tenants);
        this.prepareUserInfo(res.data);
      })
      .catch(( err ) => {
        console.log(' Error is :: ', err);
      });
  }

  private prepareUserInfo( data: any ): void {
    let tenants = data.tenants;
    let owners = data.owners;
    this.flatUsersInfo = CommonUtil.prepareFlatUsersObject(owners, tenants);
    //console.log(' Flat Users Info', this.flatUsersInfo);
  }

  private getListOfFlats() {
    this.maintenanceService.getSavedFlats()
      .then(( data ) => {
        //console.log('Data is coming from ::: ', data);
        this.flats = data;
      }).catch(( err: any ) => {
      this.eh.handleError(err);
    });
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }
}
