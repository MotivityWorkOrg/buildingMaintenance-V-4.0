import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {ApiService} from './shared';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit, OnChanges {
  public isLoggedIn = false;
  public title: string;
  subscription: Subscription;

  constructor( private api: ApiService ) {
    this.title = this.api.title;
  }

  public ngOnInit() {
    this.isLoggedIn = localStorage.getItem('logged-user') !== null;
    console.log('   this.isLoggedIn    ', this.isLoggedIn);
  }

  public ngOnChanges( changes: SimpleChanges ): void {
    console.log(changes);
  }
}
