import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'auth';
    this.urlApi = 'http://localhost:3000/api/' + this.controller;
  }

  login(auth: AuthDTO): Observable<AuthToken> {
    return this.http
      .post<AuthToken>(this.urlApi, auth)
      .pipe(catchError(this.sharedService.handleError));
  }
}
