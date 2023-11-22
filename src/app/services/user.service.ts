import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    this.urlApi = 'http://localhost:3000/api/' + this.controller;
  }

  register(user: UserDTO): Observable<UserDTO> {
    console.log(this.urlApi + '/register');
    return this.http
      .post<UserDTO>(this.urlApi + '/register', user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(this.urlApi + '/' + userId, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUSerById(userId: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlApi + '/' + userId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
