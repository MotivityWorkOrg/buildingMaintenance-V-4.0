import * as moment from 'moment';
export class DateUtil {

  public static getFormattedDate( d: any, str: string ): String {
    return moment({
      year: d.year,
      month: d.month - 1,
      date: d.day
    }).format(str);
  }

  public static convertObjectToDate( obj: any ): Date {
    return moment({year: obj.year, month: obj.month - 1, date: obj.day}).toDate();
  }

  public static dateFilter( obj: any ): string {
    return moment({
      year: obj.getFullYear(),
      month: obj.getMonth(),
      date: obj.getDate()
    }).format('DD/MM/YYYY');
  }
}
