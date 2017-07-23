import {FlatUser} from '../vo/flat-user.vo';

export class CommonUtil {
  public static getMonthsLong = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December' ];

  public static isEmptyObject( object ) {
    // We could use Object.keys, but this is more efficient
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  public static getMonthWiseInfo( period, coll ): Array<any> {
    let arr = [];
    coll.forEach(( data ) => {
      if (data.period === period) {
        //console.log(' Here is the Obj  ', data.period);
        arr.push(data);
      }
    });
    return arr;
  }

  public static prepareFlatUsersObject( owners, tenants ): any {
    let obj: any = {};
    obj.flatUsers = [];
    let tenantFound: boolean;
    let flatUser: FlatUser = new FlatUser();
    owners.forEach(( owner ) => {
      tenantFound = false;
      flatUser = owner;
      flatUser.fullName = owner.firstName + ' ' + owner.lastName;
      tenants.forEach(( tenant ) => {
        if (owner._id === tenant._id) {
          tenantFound = true;
          flatUser.tenant = tenant;
          flatUser.tenant.fullName = tenant.firstName + ' ' + tenant.lastName;
          obj.flatUsers.push(flatUser);
        }
      });
      if (!tenantFound) {
        obj.flatUsers.push(flatUser);
      }
    });
    return obj;
  }

  public static convertImageToBase64String( type: string, image ): string {
    let base64String = btoa(image);
    return 'data:' + `${type}` + ';base64,' + base64String;
  }
}
