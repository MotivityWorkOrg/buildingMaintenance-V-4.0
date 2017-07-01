import {HttpService} from './http.service';
import {Injectable} from '@angular/core';
import {Types} from '../vo/Types';
import {APIConstants} from '../constants/APIConstants';
import {Expense} from '../vo/expense.vo';
import {Income} from '../vo/income.vo';
//import {APIConstants} from '../constants/APIConstants';

@Injectable()
export class MaintenanceService {
  private baseURL = APIConstants.baseURL;  // URL to public
  constructor( private http: HttpService ) {

  }

  public getExpensesTypes(): Promise<Types[]> {
    return this.getAllExpenses();
  }

  public getIncomeTypes(): Promise<Types[]> {
    return this.getAllIncomes();
  }

  public getSavedFlats(): Promise<any []> {
    return this.getFlats();
  }

  public addOrUpdateExpenses( expense: Expense ): Promise<Expense> {
    let baseUrl = this.baseURL + '/api/expense';
    if (expense._id) {
      let id = '_id=' + expense._id;
      let url = `${baseUrl}?` + id;
      return this.put(url, expense);
    }
    return this.post(baseUrl, expense);
  }

  public addOrUpdateIncomes( income: Income ): Promise<Income> {
    let baseUrl = this.baseURL + '/api/income';
    if (income._id) {
      let id = '_id=' + income._id;
      let url = `${baseUrl}?` + id;
      return this.put(url, income);
    }
    return this.post(baseUrl, income);
  }

  public getExpensesAndIncomeInfo( period ): Promise<any> {
    return this.incomeExpensesInfo(period);
  }

  private incomeExpensesInfo( period ) {
    let baseUrl: string = this.baseURL + '/api/expenditures';
    let periodInfo = 'period=' + period;
    return this.http.get(`${baseUrl}?` + periodInfo).toPromise()
      .then(( response ) => response.json() as any[])
      .catch(this.handleError);
  }

  private getFlats() {
    return this.http.get(this.baseURL + '/types/flats').toPromise()
      .then(( response ) => response.json() as any[])
      .catch(this.handleError);
  }

  private getAllIncomes() {
    return this.http.get(this.baseURL + '/types/incomes').toPromise()
      .then(( response ) => response.json() as Types[])
      .catch(this.handleError);
  }

  private getAllExpenses() {
    return this.http.get(this.baseURL + '/types/expenses').toPromise()
      .then(( response ) => response.json() as Types[])
      .catch(this.handleError);
  }

  private post( url: string, obj: any ): Promise<any> {
    return this.http.post(url, JSON.stringify(obj)).toPromise()
      .then(( res ) => res.json())
      .catch(this.handleError);
  }

  // Update existing Event
  private put( url: string, obj: any ): Promise<any> {
    return this.http.put(url, JSON.stringify(obj)).toPromise()
      .then(() => obj)
      .catch(this.handleError);
  }

  private handleError( error: any ): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
