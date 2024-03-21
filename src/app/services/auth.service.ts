import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthDTO } from '../models/auth.dto';
import { SharedService } from './shared.service';

export interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApi: string;
  private controller: string;

  public httpInterceptor: (
    request: HttpRequest<any>,
    next: HttpHandler
  ) => Observable<HttpEvent<any>> = (request, next) => {
    const token = Cookies.get('access_token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(request);
  };
  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'login';
    // this.urlApi = 'http://localhost:3000/api/' + this.controller;
    this.urlApi =
      'https://travel-budget-tracker-api-dev-mqaq.1.ie-1.fl0.io/api/' +
      this.controller;
  }

  login(auth: AuthDTO): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(this.urlApi, auth)
      .pipe(catchError(this.sharedService.handleError));
  }

  public getToken(): string | undefined {
    return Cookies.get('access_token');
  }
}
