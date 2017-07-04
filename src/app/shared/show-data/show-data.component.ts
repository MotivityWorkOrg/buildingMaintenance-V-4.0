import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IMyDefaultMonth, IMyDpOptions} from 'mydatepicker';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateUtil} from '../../util/DateUtil';

@Component({
  selector: 'show-data',
  templateUrl: './show-data.html',
  styleUrls: [ './show-data.less' ]
})
export class ShowDataComponent implements OnInit {
  @Output() showSelectedView = new EventEmitter<Object>();
  public monthOrYearList = [ {id: 1, type: 'Month'}, {id: 2, type: 'Year'} ];
  public showDataForm: FormGroup;
  public mothDatePicker = false;
  public yearDatePicker = false;
  public errorMessage: string;
  public showDataSubmitted = false;
  public myMonthDatePickerOptions: IMyDpOptions = {
    componentDisabled: false,
    monthSelector: true,
    markCurrentMonth: true,
    disableUntil: {year: new Date().getFullYear(), month: new Date().getMonth(), day: 0},
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate() + 1
    },
    dateFormat: 'mmm/yyyy'
  };

  public defaultMonth: IMyDefaultMonth = {
    defMonth: '07/2017'
  };

  public yearDatePickerOptions: IMyDpOptions = {
    componentDisabled: false,
    monthSelector: false,
    markCurrentMonth: true,
    disableUntil: {year: new Date().getFullYear(), month: new Date().getMonth(), day: 0},
    disableSince: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate() + 1
    },
    dateFormat: 'yyyy'
  };

  constructor( private fb: FormBuilder ) {
  }

  ngOnInit() {
    this.showDataForm = this.fb.group({
      showView: new FormControl('', [ Validators.required ]),
      monthDate: new FormControl('', [ Validators.required ]),
      yearDate: new FormControl('', [ Validators.required ]),
    });

    this.setDefaultData();
  }

  public onChangeExpSelection( selected ): void {
    switch (selected) {
      case 'Month':
        this.mothDatePicker = true;
        this.yearDatePicker = false;
        break;
      case 'Year':
        this.mothDatePicker = false;
        this.yearDatePicker = true;
    }
  }

  public getUserSelectedMonthInfo( formData: any ): void {
    this.showDataSubmitted = true;
    if (this.isFormValid(formData)) {
      let obj: any = {};
      obj.view = formData.showView;
      let period = DateUtil.getFormattedDate(formData.monthDate.date, 'MMMM/YYYY');
      obj.timePeriod = formData.showView === 'Month' ? period : formData.yearDate.date.year;
      //console.log(obj, formData.monthDate.date);
      this.showSelectedView.emit(obj);
    }
  }

  private setDefaultData() {
    let date = new Date();
    this.showDataForm.setValue({
      monthDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      },
      yearDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      },
      showView: ''
    });
  }

  private isFormValid( data: any ): boolean {
    let isValid = true;
    if (data.showView === '') {
      this.errorMessage = 'select view type';
      isValid = false;
    } else if (data.showView === 'Month') {
      if (!(data.monthDate) || typeof data.monthDate !== 'object') {
        this.errorMessage = 'select month';
        isValid = false;
      } else {
        this.errorMessage = '';
      }
    } else if (data.showView === 'Year') {
      if (!(data.yearDate) || typeof data.yearDate !== 'object') {
        this.errorMessage = 'select year';
        isValid = false;
      } else {
        this.errorMessage = '';
      }
    }
    return isValid;
  }
}
