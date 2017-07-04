import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';

@Component({
  selector: 'logout',
  template: `
    <div>logout</div>`
})
export class LogoutComponent implements OnInit {
  public constructor( private router: Router,
                      private appComponent: AppComponent ) {

  }

  public ngOnInit() {
    localStorage.setItem('event-manager_token', null);
    localStorage.setItem('logged-user', null);
    this.appComponent.isLoggedIn = false;
    this.router.navigateByUrl('');
  }
}
