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
import { UniqueCurrencyPipe } from 'src/app/pipes/unique-currency.pipe';
import { CountriesList } from 'src/app/shared/countries.constants';
import { HeaderMenus } from '../../models/header-menus.dto';
import { UserDTO } from '../../models/user.dto';
import { HeaderMenusService } from '../../services/header-menus.service';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UniqueCurrencyPipe],
})
export class RegisterComponent implements OnInit {
  registerUser: UserDTO;

  name: FormControl;
  username: FormControl;
  currency: FormControl;
  defaultCurrency: FormControl;
  email: FormControl;
  password: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;

  Countries = CountriesList;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private router: Router,
    private uniqueCurrency: UniqueCurrencyPipe
  ) {
    this.registerUser = new UserDTO();

    this.isValidForm = null;

    this.name = new FormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.username = new FormControl(this.registerUser.username, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.email = new FormControl(this.registerUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.currency = new FormControl(this.registerUser.currency, [
      Validators.required,
    ]);

    this.defaultCurrency = new FormControl(this.registerUser.defaultCurrency, [
      Validators.required,
    ]);

    this.password = new FormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      defaultCurrency: this.defaultCurrency,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  register(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    this.userService
      .register(this.registerUser)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'registerFeedback',
            responseOK,
            errorResponse
          );

          if (responseOK) {
            this.registerForm.reset();
            this.router.navigateByUrl('home');
          }
        })
      )
      .subscribe(
        () => {
          responseOK = true;
        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;

          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };

          this.headerMenusService.headerManagement.next(headerInfo);
          this.sharedService.errorLog(errorResponse);
        }
      );
  }
}
