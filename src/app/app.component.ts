import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {ApiService} from './shared';
import {AuthService} from 'ng2-ui-auth';
import {Router} from '@angular/router';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnChanges {
  public isLoggedIn = false;
  public title: string;

  constructor( private api: ApiService,
               public auth: AuthService,
               private router: Router ) {
    this.title = this.api.title;
  }

  public ngOnInit() {
    this.isLoggedIn = localStorage.getItem('logged-user') !== null;
    console.log('   this.isLoggedIn    ', this.isLoggedIn);
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('home');
    }
  }

  public ngOnChanges( changes: SimpleChanges ): void {
    console.log(changes);
  }
}
