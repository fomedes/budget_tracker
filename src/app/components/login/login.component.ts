import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import Cookies from 'js-cookie';
import { AuthDTO } from 'src/app/models/auth.dto';
import { HeaderMenus } from 'src/app/models/header-menus.dto';
import { AuthService, AuthToken } from 'src/app/services/auth.service';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService
      .login(this.loginUser)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'loginFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            const headerInfo: HeaderMenus = {
              showAuthSection: true,
              showNoAuthSection: false,
            };
            this.headerMenusService.headerManagement.next(headerInfo);
            this.router.navigateByUrl('home');
          }
        })
      )
      .subscribe(
        (resp: AuthToken) => {
          responseOK = true;
          const token = resp.access_token;
          const user_id = resp.user_id;

          Cookies.set('access_token', token);
          Cookies.set('user_id', user_id);

          // this.authService.httpInterceptor = (request, next) => {
          //   const token = Cookies.get('access_token');
          //   if (token) {
          //     console.log('Authorization header added with token:', token);
          //     request = request.clone({
          //       setHeaders: { Authorization: `Bearer ${token}` },
          //     });
          //   } else {
          //     console.log('No access token found in cookie');
          //   }
          //   return next.handle(request);
          // };
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;
          console.error('Full error:', error);
          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };
          this.headerMenusService.headerManagement.next(headerInfo);

          this.sharedService.errorLog(error.error);
        }
      );
  }
}
