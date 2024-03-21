import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HeaderMenus } from '../models/header-menus.dto';
import { HeaderMenusService } from './header-menus.service';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  private dataStore: Map<string, any> = new Map();

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService
  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  navigationTo(route: string): void {
    if (route == 'logout') {
      // Cookies.remove;
      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };

      this.headerMenusService.headerManagement.next(headerInfo);

      this.router.navigateByUrl('home');
    } else {
      this.router.navigateByUrl(route),
        { queryParams: { returnUrl: this.router.url } };
    }
  }

  setData(key: string, value: any): void {
    this.dataStore.set(key, value);
  }

  getData(key: string): any {
    return this.dataStore.get(key);
  }

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError
  ): Promise<void> {
    const toastMsg = document.getElementById(element);
    console.log(toastMsg);

    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = 'show requestOk';
        toastMsg.textContent = 'Form submitted successfully.';
        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      } else {
        toastMsg.className = 'show requestKo';
        if (error?.messageDetail) {
          toastMsg.textContent =
            'Error on form submitted, show logs. Message: ' +
            error?.message +
            '. Message detail: ' +
            error?.messageDetail +
            '. Status code: ' +
            error?.statusCode;
        } else {
          toastMsg.textContent =
            'Error on form submitted, show logs. Message: ' +
            error?.message +
            '. Status code: ' +
            error?.statusCode;
        }

        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      }
    }
  }

  errorLog(error: any): void {
    console.error('Error occurred:');

    if (error instanceof ProgressEvent) {
      console.error('Network error occurred. This might be a CORS issue.');
      return;
    }

    // Handle other types of errors as before
    console.error('Status:', error.status);
    console.error('Status Text:', error.statusText);
    console.error('Message:', error.message);
    console.error('Error Object:', error.error);

    // Additional logging if the error object has more properties
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error occurred:', error.error.message);
    } else {
      console.error('Server-side error details:', error.error);
    }

    // You can log more details based on the structure of the error object
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
