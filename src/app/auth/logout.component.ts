import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'ng2-ui-auth';

@Component({
  selector: 'logout',
  template: `
    <div>logout</div>`
})
export class LogoutComponent implements OnInit {
  public constructor( private router: Router,
                      private auth: AuthService ) {

  }

  public ngOnInit() {
    localStorage.setItem('event-manager_token', null);
    localStorage.setItem('logged-user', null);
    this.auth.logout()
      .subscribe({
        error: ( err: any ) => console.log(err),
        complete: () => this.router.navigateByUrl('')
      });
  }
}
