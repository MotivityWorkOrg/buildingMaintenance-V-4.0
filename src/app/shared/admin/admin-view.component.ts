import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IMyDpOptions} from 'mydatepicker';
import {MaintenanceService} from '../../services/maintenance.service';
import {ErrorHandleService} from '../../services/error-handle.service';
import {FormHelperService} from '../../services/form-helper.service';
import {MaintenanceModel} from '../../model/maintenance.model';
import {AppState} from '../../app.service';
import {Income} from '../../vo/income.vo';
import {DateUtil} from '../../util/DateUtil';
import * as moment from 'moment';
import {Expense} from '../../vo/expense.vo';
import {CommonUtil} from '../../util/CommonUtil';
import {Expenditure} from '../../vo/expenditure.vo';
import {ModalService} from '../../components/modal/modal.service';

@Component({
  selector: 'admin-view',
  templateUrl: './admin-view.html',
  styleUrls: [ './admin-view.less' ]
})
export class AdminViewComponent implements OnInit {
  public maintenanceForm: FormGroup;
  public errorMessage = '';
  public expensesTypeList = [];
  public listOfIncomes = [];
  public maintenanceTypes = [];
  public getAllFlats = [];
  public maintenanceType = '';
  public totalExpenditure = {};
  public maintenanceSubmitted: boolean;
  public itemId: string;
  public isMonthView: boolean;
  public isDataChanged: boolean;
  public totalYearExpenditure: Array<Expenditure>;
  private categoryUpdate: string;
  private isCategoryTypeChanged: boolean;
  public myDatePickerOptions: IMyDpOptions = {
    disableUntil: {year: new Date().getFullYear(), month: new Date().getMonth(), day: 0},
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate() + 1
    },
    markCurrentDay: true,
    dateFormat: 'dd/mm/yyyy'
  };
  public periodDatePickerOptions: IMyDpOptions = {
    disableUntil: {year: new Date().getFullYear(), month: new Date().getMonth(), day: 0},
    markCurrentDay: true,
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1, day: new Date().getDate() + 1
    },
    dateFormat: 'mmm/yyyy'
  };

  constructor( private maintenanceService: MaintenanceService,
               private eh: ErrorHandleService,
               private fb: FormBuilder,
               public fh: FormHelperService,
               private model: MaintenanceModel,
               private appState: AppState,
               private modalService: ModalService ) {
    this.maintenanceTypes = [ {id: 0, type: 'Expense'}, {id: 1, type: 'Income'} ];
    this.isMonthView = true;
    //modal.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.categoryUpdate = '';
    this.maintenanceSubmitted = false;
    this.getListOfExpenses();
    this.getListOfIncomes();
    this.getListOfFlats();
    this.maintenanceForm = this.fb.group({
      periodDate: new FormControl('', [ Validators.required ]),
      paymentDate: new FormControl('', [ Validators.required ]),
      maintenanceType: new FormControl('', [ Validators.required ]),
      expenseType: new FormControl('', [ Validators.required ]),
      incomeType: new FormControl('', [ Validators.required ]),
      flatNo: new FormControl('', [ Validators.required ]),
      amount: new FormControl('', [ Validators.required, Validators.minLength(2), Validators.maxLength(5) ]),
      url: new FormControl('', [ Validators.nullValidator ]),
      comment: new FormControl('', [ Validators.nullValidator ])
    });
    this.setPreSelection();
    this.getSavedExpensesAndIncomeInfo();
    this.submitState('home');
  }

  public changeCategory( value ) {
    //console.log(this.categoryUpdate, '  Category changed  ', value.toLowerCase());
    if (this.categoryUpdate.toLowerCase() !== '' && this.categoryUpdate !== value) {
      console.log(this.categoryUpdate, '  Category changed  ', value.toLowerCase());
      this.modalService.open('custom-modal-1');
    }
    this.maintenanceType = value.toLowerCase();
  }

  public addMonthlyIncomeOrExpenses( maintenanceData: any ) {
    //console.log('Add Monthly Income Expenses', maintenanceData.valid);
    this.maintenanceForm.controls.maintenanceType.setValue(this.maintenanceType);
    this.categoryUpdate = '';
    this.maintenanceSubmitted = true;
    let data = maintenanceData.value;
    if (this.isCategoryTypeChanged) {
      data.maintenanceType = this.maintenanceType === 'expense' ? 'Expense' : 'Income';
    }

    if (this.isFormValid(data)) {
      if (data.maintenanceType === 'expense') {
        let expense = new Expense();
        expense._id = this.itemId;
        expense.amount = data.amount;
        expense.description = data.comment;
        expense.billUrl = data.url;
        expense.category = data.expenseType;
        expense.period = moment().format('MMMM/YYYY');
        expense.paymentDate = DateUtil.convertObjectToDate(data.paymentDate.date);
        this.maintenanceService.addOrUpdateExpenses(expense).then(( response: any ) => {
          this.setPreSelection();
          this.resetData();
          console.log('Data is coming from Expense ::: ', response);
        }).catch(( err: any ) => {
          this.eh.handleError(err);
        });
        //console.log(expense);
      } else {
        let income = new Income();
        income._id = this.itemId;
        income.amount = data.amount;
        income.category = data.incomeType;
        income.period = moment().format('MMMM/YYYY');
        income.flatNo = data.flatNo;
        income.paymentDate = DateUtil.convertObjectToDate(data.paymentDate.date);
        income.description = data.comment;
        //console.log(income);
        this.maintenanceService.addOrUpdateIncomes(income).then(( response: any ) => {
          this.resetData();
          console.log('Data is coming from Expense ::: ', response);
        }).catch(( err: any ) => {
          this.eh.handleError(err);
        });
      }
    }
  }

  public refreshForm(): void {
    this.setPreSelection();
    console.log('Refresh Form');
  }

  public onModifySelectedData( e ): void {
    this.setPreSelection(e);
    this.categoryUpdate = this.maintenanceForm.controls.maintenanceType.value;
  }

  public selectedView( e ): void {
    this.getSavedExpensesAndIncomeInfo(e);
  }

  public continueOK( id ): void {
    this.maintenanceForm.controls.maintenanceType.disable({onlySelf: true});
    this.maintenanceForm.controls.amount.setValue('');
    this.maintenanceForm.controls.comment.setValue('');
    //console.log(' Item Id is  ', this.itemId);
    this.isCategoryTypeChanged = true;
    this.itemId = null;
    this.modalService.close(id);
  }

  public closeModal( id ): void {
    this.maintenanceForm.controls.maintenanceType.setValue(this.categoryUpdate);
    this.modalService.close(id);
  }

  private resetData(): void {
    this.setPreSelection();
    this.maintenanceForm.controls.maintenanceType.enable({onlySelf: true});
    this.itemId = null;
    this.isDataChanged = true;
    this.getSavedExpensesAndIncomeInfo();
    this.isCategoryTypeChanged = false;
  }

  private getSavedExpensesAndIncomeInfo( value: any = null ) {
    if (!value) {
      let period = moment().format('MMMM/YYYY');
      let expObj = this.model.getExpenditure();
      //console.log('expenditure    ', expObj);
      if (CommonUtil.isEmptyObject(expObj) || this.isDataChanged) {
        this.isDataChanged = false;
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
    this.maintenanceService.getExpensesAndIncomeInfo(period)
      .then(( response ) => {
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
    //console.log('totalExpenditure    ', res);
    if (this.isMonthView) {
      this.totalExpenditure = res;
    } else {
      this.totalYearExpenditure = this.prepareYearCollection(res, year);
    }
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

  private isFormValid( data: any ): boolean {
    let isValid = true;
    if (!(data.periodDate) || typeof data.periodDate !== 'object') {
      this.errorMessage = 'select Date';
      isValid = false;
    } else if (!(data.paymentDate) || typeof data.paymentDate !== 'object') {
      this.errorMessage = 'select payment date';
      isValid = false;
    } else if (!data.maintenanceType || data.maintenanceType === '') {
      isValid = false;
      this.errorMessage = 'select maintenance type';
    } else if (data.maintenanceType === 'Expense') {
      if (data.expenseType === '') {
        isValid = false;
        this.errorMessage = 'select expense type';
      } else if (data.amount === '') {
        isValid = false;
        this.errorMessage = 'enter valid amount';
      } else {
        this.errorMessage = '';
      }
    } else if (data.maintenanceType === 'Income') {
      if (data.incomeType === '') {
        isValid = false;
        this.errorMessage = 'select income type';
      } else if (data.flatNo === '') {
        isValid = false;
        this.errorMessage = 'enter valid flat no';
      } else if (data.amount === '') {
        isValid = false;
        this.errorMessage = 'enter valid amount';
      } else {
        this.errorMessage = '';
      }
    } else {
      this.errorMessage = '';
    }
    return isValid;
  }

  private setPreSelection( selectedData: any = null ): void {
    if (selectedData) {
      let obj = selectedData.data;
      //console.log(selectedData);
      this.maintenanceType = selectedData.type.toLowerCase();
      let date = new Date(obj.paymentDate);
      this.itemId = obj._id;
      this.maintenanceForm.setValue({
        paymentDate: {
          date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        },
        periodDate: {
          date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        },
        maintenanceType: selectedData.type,
        expenseType: selectedData.type === 'Expense' ? obj.category : '',
        incomeType: selectedData.type === 'Income' ? obj.category : '',
        flatNo: obj.flatNo ? obj.flatNo : '',
        amount: obj.amount,
        url: obj.url ? obj.url : '',
        comment: obj.description ? obj.description : ''
      });
    } else {
      // Set today date using the setValue function
      let date = new Date();
      this.maintenanceForm.setValue({
        paymentDate: {
          date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        },
        periodDate: {
          date: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        },
        maintenanceType: '',
        expenseType: '',
        incomeType: '',
        flatNo: '',
        amount: '',
        url: '',
        comment: ''
      });

    }
  }

  private getListOfExpenses() {
    this.maintenanceService.getExpensesTypes()
      .then(( data ) => {
        //console.log('Data is coming from ::: ', data);
        this.expensesTypeList = data;
      }).catch(( err: any ) => {
      this.eh.handleError(err);
    });
  }

  private getListOfIncomes() {
    this.maintenanceService.getIncomeTypes()
      .then(( data ) => {
        //console.log('Data is coming from ::: ', data);
        this.listOfIncomes = data;
      }).catch(( err: any ) => {
      this.eh.handleError(err);
    });
  }

  private getListOfFlats() {
    this.maintenanceService.getSavedFlats()
      .then(( data ) => {
        //console.log('Data is coming from ::: ', data);
        this.getAllFlats = data;
      }).catch(( err: any ) => {
      this.eh.handleError(err);
    });
  }

  private submitState( value: string ): void {
    console.log('submitState', value);
    this.appState.set('value', value);
  }

}
