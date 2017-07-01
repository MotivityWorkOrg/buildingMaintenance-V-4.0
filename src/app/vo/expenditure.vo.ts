import {Expense} from './expense.vo';
import {Income} from './income.vo';
export class Expenditure {
  public periodInfo: string;
  public expenses: Array<Expense>;
  public income: Array<Income>;
  public totalExpenses: Number;
  public totalIncome: Number;
  public byHand: Number;
}
