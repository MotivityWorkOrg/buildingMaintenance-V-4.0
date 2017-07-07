import {ApplicationRef, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// App is our top level component
import {APP_RESOLVER_PROVIDERS} from './app.resolver';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ApiService} from './shared';
import {CLIENT_ROUTER_PROVIDERS, ROUTES} from './app.routing';

import {createNewHosts, removeNgStyles} from '@angularclass/hmr';
import {LoginComponent} from './auth/login.component';
import {ErrorHandleService} from './services/error-handle.service';
import {FormHelperService} from './services/form-helper.service';
import {HttpService} from './services/http.service';
import {Ng2UiAuthModule} from 'ng2-ui-auth';
import {AuthConfig} from './auth/auth.config';
import {ToastModule} from 'ng2-toastr';
import {RouterModule} from '@angular/router';
import {AppState} from './app.service';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SignUpComponent} from './auth/sign-up.component';
import {MaintenanceService} from './services/maintenance.service';
import {MyDatePickerModule} from 'mydatepicker';
import {ShowDataComponent} from './shared/show-data/show-data.component';
import {MonthViewComponent} from './shared/month/month-view.component';
import {MaintenanceModel} from './model/maintenance.model';
import {YearViewComponent} from './shared/year/year-view.component';
import {AdminViewComponent} from './shared/admin/admin-view.component';
import {UserViewComponent} from './shared/user/user-view.component';
import {LogoutComponent} from './auth/logout.component';
import {AccordionModule} from 'ng2-accordion';
import {ForgotPasswordComponent} from './auth/forgot/forgot-password.component';
import {ResetPasswordComponent} from './auth/forgot/resetpassword.component';
import {FlatsInfoComponent} from './flats/flats-info.component';
import {TooltipModule} from 'ngx-tooltip';

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  CLIENT_ROUTER_PROVIDERS
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2UiAuthModule.forRoot(AuthConfig),
    ToastModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    MyDatePickerModule,
    AccordionModule,
    TooltipModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    SignUpComponent,
    ShowDataComponent,
    MonthViewComponent,
    YearViewComponent,
    AdminViewComponent,
    UserViewComponent,
    LogoutComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FlatsInfoComponent
  ],
  providers: [
    APP_PROVIDERS,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    ApiService,
    ErrorHandleService,
    FormHelperService,
    MaintenanceService,
    HttpService,
    MaintenanceModel
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor( public appRef: ApplicationRef ) {
  }

  hmrOnInit( store ) {
    console.log('HMR store', store);
  }

  hmrOnDestroy( store ) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy( store ) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
