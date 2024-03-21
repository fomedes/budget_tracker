import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO } from '../models/user.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'users';
    // this.urlApi = 'http://localhost:3000/api/' + this.controller;
    this.urlApi =
      'https://travel-budget-tracker-api-dev-mqaq.1.ie-1.fl0.io/api/' +
      this.controller;
  }

  register(user: UserDTO): Observable<UserDTO> {
    return this.http
      .post<UserDTO>(this.urlApi + '/register', user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUser(user_id: string, user: any): Observable<UserDTO> {
    return this.http
      .patch<UserDTO>(this.urlApi + '/update/' + user_id, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUserById(user_id: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlApi + '/find/' + user_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  getCurrentUser(): string | null {
    const userId = Cookies.get('user_id');
    return userId === undefined ? null : userId;
  }
}
