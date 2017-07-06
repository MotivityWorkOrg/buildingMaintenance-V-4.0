import {Tenant} from './tenant.vo';
export class FlatUser {
  public _id: Number;
  public firstName: string;
  public lastName: string;
  public phoneNumber: Number;
  public altNumber: Number;
  public email: string;
  public isOccupied: boolean;
  public fullName: string;
  public tenant: Tenant;

}
