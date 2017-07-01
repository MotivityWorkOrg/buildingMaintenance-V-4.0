import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import {AuthGuard} from './services/auth.guard';
import {SignUpComponent} from './auth/sign-up.component';
import {HomeComponent} from './home/home.component';

export const CLIENT_ROUTER_PROVIDERS = [
  AuthGuard
];
export const ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: SignUpComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
];
