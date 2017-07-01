import {Injectable} from '@angular/core';

@Injectable()
export class MaintenanceModel {
  public expenditure = null;

  public getExpenditure() {
    return this.expenditure;
  }

  public setExpenditure( value ): void {
    this.expenditure = value;
  }
}
