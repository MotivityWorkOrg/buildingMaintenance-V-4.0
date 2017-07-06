import {Injectable} from '@angular/core';
import {FormGroup, AbstractControl} from '@angular/forms';

@Injectable()
export class FormHelperService {
  public hasError( form: FormGroup, ...prop: string[] ) {
    //console.log(' In FH ', form.controls);
    const control = this.getControl(form, ...prop);
    //console.log('  Control is ', control);
    return !control.valid && control.touched;
  }

  public getControl( form: FormGroup, ...prop: string[] ): AbstractControl {
    if (prop.length === 1) {
      return form.controls[ prop[ 0 ] ];
    }
    return this.getControl(<any> form.controls[ prop[ 0 ] ], ...prop.slice(1));
  }

  public matchingPasswords( passwordKey: string, confirmPasswordKey: string ) {
    return ( group: FormGroup ): {
      [key: string]: any
    } => {
      let password = group.controls[ passwordKey ];
      let confirmPassword = group.controls[ confirmPasswordKey ];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  public mailFormat( form: FormGroup, ...prop: string[] ) {
    const control = this.getControl(form, ...prop);
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (control.value !== '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return {incorrectMailFormat: true};
    }
    return null;
  }

  /* public static validateNumber(c: FormControl) {
   return c.value > 0 && c.value < 100 ? null : {valid: false};
   };*/
}
