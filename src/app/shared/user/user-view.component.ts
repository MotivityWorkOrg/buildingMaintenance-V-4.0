import {Component, Input, OnInit} from '@angular/core';
import {Expenditure} from '../../vo/expenditure.vo';
import {AppState} from '../../app.service';
import {MaintenanceService} from '../../services/maintenance.service';
import {MaintenanceModel} from '../../model/maintenance.model';
import * as moment from 'moment';
import {CommonUtil} from '../../util/CommonUtil';
@Component({
  selector: 'user-vew',
  templateUrl: './user-view.html',
  styleUrls: [ './user-view.less' ]
})
export class UserViewComponent implements OnInit {
  @Input() isMonthView: boolean;
  @Input() expenditure: Expenditure;

  public totalExpenditure = {};
  public totalYearExpenditure: Array<Expenditure>;

  public constructor( private appState: AppState,
                      private maintenanceService: MaintenanceService,
                      private model: MaintenanceModel ) {
    this.isMonthView = true;
  }

  public ngOnInit() {
    this.getSavedExpensesAndIncomeInfo();
    this.submitState('home.user');
  }

  public selectedView( e ): void {
    this.getSavedExpensesAndIncomeInfo(e);
  }

  private getSavedExpensesAndIncomeInfo( value: any = null ) {
    if (!value) {
      let period = moment().format('MMMM/YYYY');
      let expObj = this.model.getExpenditure();
      //console.log('expenditure    ', expObj);
      if (CommonUtil.isEmptyObject(expObj)) {
        this.expenditureServiceCall(period);
      } else {
        this.onSuccessExpenditure(expObj);
      }
    } else {
      //console.log(value);
      this.isMonthView = value.view === 'Month';
      this.expenditureServiceCall(value.timePeriod);
    }
  }

  private expenditureServiceCall( period: string ): void {
    //console.log('Year Mode ::: ', period);
    this.maintenanceService.getExpensesAndIncomeInfo(period).then(( response ) => {
        if (response.status === 200) {
          this.model.setExpenditure(response.data);
          this.onSuccessExpenditure(response.data, period);
        }
      })
      .catch(( err ) => {
        console.log(err);
      });
  }

  private onSuccessExpenditure( res, year = null ): void {
    if (!this.isMonthView) {
      this.totalYearExpenditure = this.prepareYearCollection(res, year);
      console.log(' totalYearExpenditure :: ', this.totalYearExpenditure);
    } else {
      this.totalExpenditure = res;
    }
    //console.log('totalExpenditure    ', this.totalExpenditure);
  }

  private prepareYearCollection( res: any, year ): Array<Expenditure> {
    let totalYearInfo = [];
    CommonUtil.getMonthsLong.forEach(( month ) => {
      let header: Expenditure = new Expenditure();
      let period = month + '/' + year;
      header.income = CommonUtil.getMonthWiseInfo(period, res.income);
      header.periodInfo = month;
      header.expenses = CommonUtil.getMonthWiseInfo(period, res.expenses);
      header.totalIncome = header.income.reduce(( total, data ) => {
        return total + Number(data.amount);
      }, 0);
      header.totalExpenses = header.expenses.reduce(( total, data ) => {
        return total + Number(data.amount);
      }, 0);
      header.byHand = Number(header.totalIncome) - Number(header.totalExpenses);
      totalYearInfo.push(header);
      //console.log(' Inside Closer function  ', totalYearInfo);
    });
    return totalYearInfo;
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }

}
