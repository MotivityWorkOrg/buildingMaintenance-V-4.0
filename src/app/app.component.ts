import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {ApiService} from './shared';
import {AuthService} from 'ng2-ui-auth';
import {Router} from '@angular/router';
import {ModalService} from './components/modal/modal.service';
import {FileUploader} from 'ng2-file-upload';
import {APIConstants} from './constants/APIConstants';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.less' ]
})
export class AppComponent implements OnInit, OnChanges {
  public uploader: FileUploader = new FileUploader({
    url: APIConstants.baseURL + '/user/upload-image',
    headers: [ {
      name: 'authorization',
      value: this.auth.getToken()
    }
    ],
    maxFileSize: 1024 * 1024, // 1 MB
    itemAlias: 'photo'
  });
  public isLoggedIn = false;
  public title: string;
  public userInfo;
  public imageSizeError = '';
  public imageContent = '';
  public userProfileImage = '';

  constructor( private api: ApiService,
               public auth: AuthService,
               private router: Router,
               private modalService: ModalService ) {
    this.title = this.api.title;
  }

  public ngOnInit() {
    this.isLoggedIn = localStorage.getItem('logged-user') !== null;
    //console.log('   this.isLoggedIn    ', this.isLoggedIn);
    if (this.auth.isAuthenticated()) {
      this.userInfo = this.auth.getPayload();
      //console.log('  ', this.userInfo);
      this.router.navigateByUrl('home');
    }
    this.uploader.onAfterAddingFile = ( file ) => {
      file.withCredentials = false;
      let imageSizeInMB = ((file.file.size) / 1024) / 1024;
      if (Math.round(imageSizeInMB * 100) / 100 > 1.0) {
        console.log(' Image size is   ', imageSizeInMB);
        this.imageSizeError = 'Image size less than 1 MB';
      }
      //console.log(' File is ::  ', file);
    };
    this.uploader.onCompleteItem = ( item: any, response: any, status: any, headers: any ) => {
      console.log('ImageUpload:  ', item, ' << ..  ', status, '  :: ', response, '   ', headers);
      //console.log(' Response is   ', JSON.parse(response));
      this.userProfileImage = JSON.parse(response).data;
      this.modalService.close('user-image');
    };
    let staticImage = '../assets/images/user-info-img.png';
    if (this.userInfo) {
      this.userProfileImage = this.userInfo.profileImage ? this.userInfo.profileImage : staticImage;
    }
  }

  public changeProfilePic(): void {
    this.modalService.open('user-image');
  }

  public closeModal( id: string ): void {
    this.modalService.close(id);
  }

  public ngOnChanges( changes: SimpleChanges ): void {
    console.log(' Changes are ', changes);
  }
}
