import {CustomConfig} from 'ng2-ui-auth';
import {APIConstants} from '../constants/APIConstants';

const GOOGLE_CLIENT_ID = '<replace me>';
export const LOCAL_CLIENT_ID = {
  authorizationEndpoint: APIConstants.baseURL,
  clientId: '',
  responseType: 'token',
  url: `${APIConstants.baseURL}`+'/auth/login'
};

export class AuthConfig extends CustomConfig {
  public baseUrl = APIConstants.baseURL;
  public defaultHeaders = {'Content-Type': 'application/json'};
  public tokenPrefix = 'event-manager';
  public loginUrl = '/auth/login';
  public signupUrl = '/auth/signup';
  public providers: { [provider: string]: any } = {local: {LOCAL_CLIENT_ID}, google: {clientId: GOOGLE_CLIENT_ID}};
}
