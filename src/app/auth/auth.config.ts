import {CustomConfig} from 'ng2-ui-auth';

const GOOGLE_CLIENT_ID = '<replace me>';
export const LOCAL_CLIENT_ID = {
  authorizationEndpoint: 'http://localhost:5000/auth/login',
  clientId: '',
  responseType: 'token',
  url: 'http://localhost:5000/auth/login'
};

export class AuthConfig extends CustomConfig {
  public baseUrl = 'http://localhost:5000';
  public defaultHeaders = {'Content-Type': 'application/json'};
  public tokenPrefix = 'event-manager';
  public loginUrl = '/auth/login';
  public signupUrl = '/auth/signup';
  public providers: { [provider: string]: any } = {local: {LOCAL_CLIENT_ID}, google: {clientId: GOOGLE_CLIENT_ID}};
}
