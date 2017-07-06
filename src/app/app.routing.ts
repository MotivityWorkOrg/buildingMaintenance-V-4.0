import {Routes} from '@angular/router';

import {LoginComponent} from './auth/login.component';
import {AuthGuard} from './services/auth.guard';
import {SignUpComponent} from './auth/sign-up.component';
import {HomeComponent} from './home/home.component';
import {LogoutComponent} from './auth/logout.component';
import {ForgotPasswordComponent} from './auth/forgot/forgot-password.component';
import {ResetPasswordComponent} from './auth/forgot/resetpassword.component';
import {FlatsInfoComponent} from './flats/flats-info.component';

export const CLIENT_ROUTER_PROVIDERS = [
  AuthGuard
];
export const ROUTES: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: SignUpComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'home', component: HomeComponent, canActivate: [ AuthGuard ]},
  {path: 'flats', component: FlatsInfoComponent, canActivate: [ AuthGuard ]},
  {path: 'logout', component: LogoutComponent},
];
