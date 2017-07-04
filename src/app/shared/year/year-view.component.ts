import {Component, Input, OnInit} from '@angular/core';
import {Expenditure} from '../../vo/expenditure.vo';
import {DateUtil} from '../../util/DateUtil';

@Component({
  selector: 'show-year-view',
  templateUrl: './year-view.html',
  styleUrls: [ './year-view.less' ]
})
export class YearViewComponent implements OnInit {
  @Input() expenditures: Array<Expenditure>;

  public ngOnInit() {
    //console.log(' expenditure ', this.expenditure);
  }

  public dateFilter( obj: any ): string {
    let dateObj: Date = new Date(obj);
    return DateUtil.dateFilter(dateObj);
  }
}
