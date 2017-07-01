import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Expenditure} from '../../vo/expenditure.vo';
import {DateUtil} from '../../util/DateUtil';
@Component({
  selector: 'show-month-view',
  templateUrl: './month-view.html',
  styleUrls: [ './month-view.less' ]
})

export class MonthViewComponent implements OnInit {
  @Input() isMonthView: boolean;
  @Input() expenditure: Expenditure;
  @Output() updateSelectedInfo = new EventEmitter<Object>();
  public spanColor: string;

  ngOnInit() {
    //console.log(this.expenditure);
  }

  public dateFilter( obj: any ): string {
    let dateObj: Date = new Date(obj);
    return DateUtil.dateFilter(dateObj);
  }

  public modifyData( data: any, type: string ) {
    let obj: any = {};
    obj.data = data;
    obj.type = type;
    this.updateSelectedInfo.emit(obj);
  }
}
