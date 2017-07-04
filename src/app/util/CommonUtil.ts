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
}
