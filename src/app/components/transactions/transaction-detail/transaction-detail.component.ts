import { formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CategoryDTO } from 'src/app/models/category.dto';
import { PlanDTO } from 'src/app/models/plan.dto';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { UserDTO } from 'src/app/models/user.dto';
import { CategoryService } from 'src/app/services/category.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PlanService } from 'src/app/services/plan.service';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { CountriesList } from 'src/app/shared/countries.constants';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  transaction: TransactionDTO;
  title: FormControl;
  date: FormControl;
  category_id: FormControl;
  amount: FormControl;
  currency: FormControl;
  country: FormControl;
  description: FormControl;
  split!: FormControl;
  accountCurrencyAmount: FormControl;

  transactionForm: FormGroup;
  isValidForm: boolean | null;

  private user_id: string | null;
  private plan_id: string | undefined;
  currentPlan: PlanDTO | null = null;
  user!: UserDTO;
  userCategories!: CategoryDTO[];
  currencyRate!: number;

  Friends = [
    { label: 'Friend 1', value: 'friend1' },
    { label: 'Friend 2', value: 'friend2' },
    { label: 'Friend 3', value: 'friend3' },
  ];

  Countries = CountriesList;

  currencySymbol: string = '';

  private isUpdateMode: boolean;
  private transaction_id: string | null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private transactionService: TransactionService,
    private planService: PlanService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {
    this.user_id = this.userService.getCurrentUser();
    this.currentPlan = this.sharedService.getData('currentPlan');

    if (this.user_id) {
      this.getCategories(this.user_id);
      this.getUser();
      this.plan_id = this.currentPlan!.id;
    }

    this.isValidForm = null;
    this.transaction_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.transaction = new TransactionDTO();
    this.isUpdateMode = false;

    this.title = new FormControl(this.transaction.title, [Validators.required]);

    this.date = new FormControl(
      formatDate(this.transaction.date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.category_id = new FormControl(this.transaction.category, [
      Validators.required,
    ]);

    this.amount = new FormControl(0, [Validators.required]);

    this.currency = new FormControl(this.transaction.currency, [
      Validators.required,
    ]);

    this.country = new FormControl(this.transaction.country, [
      Validators.required,
    ]);

    this.description = new FormControl(this.transaction.description);

    this.split = new FormControl(this.transaction.split);

    this.accountCurrencyAmount = new FormControl('');

    this.transactionForm = this.fb.group({
      title: this.title,
      description: this.description,
      date: this.date,
      category_id: this.category_id,
      country: this.country,
      currency: this.currency,
      amount: this.amount,
      accountCurrencyAmount: this.accountCurrencyAmount,
      split: this.split,
      plan_id: this.plan_id,
      user_id: this.user_id,
    });

    this.amount.valueChanges.subscribe((amountValue) => {
      this.accountCurrencyAmount.setValue(amountValue * this.currencyRate);
    });

    this.country.valueChanges.subscribe((countryValue) => {
      const selectedCountry = this.Countries.find(
        (country) => country.name === countryValue
      );
      if (selectedCountry) {
        const currencyControl = this.transactionForm.get('currency');

        if (currencyControl) {
          currencyControl.setValue(selectedCountry.currency.name);
          this.currencySymbol = selectedCountry.currency.symbol || '';
          this.currency.setValue(selectedCountry.currency.code || '');
          this.getCurrencyRate(selectedCountry);
        }
      }
    });
  }

  ngOnInit(): void {
    // let errorResponse: any;
    // if (this.transaction_id) {
    //   this.isUpdateMode = true;
    //   this.transactionService.getTransactionById(this.transaction_id).subscribe({
    //     next: (transaction: TransactionDTO) => {
    //       this.transaction = transaction;
    //       this.title.setValue(this.transaction.title);
    //       this.description.setValue(this.transaction.description);
    //       this.date.setValue(
    //         formatDate(this.transaction.date, 'dd/MM/yyyy', 'en-GB')
    //       );
    //       /*
    //         let categoryIds: string[] = [];
    //         this.transaction.category.forEach((cat: CategoryDTO) => {
    //           categoryIds.push(cat.categoryId);
    //         });
    //       */
    //       this.category.setValue(this.transaction.category);
    //       this.transactionForm = this.fb.group({
    //         title: this.title,
    //         description: this.description,
    //         plan_id: this.plan,
    //         date: this.date,
    //         category: this.category,
    //         country: this.country,
    //         currency: this.currency,
    //         amount: this.amount,
    //         accountCurrencyAmount: this.accountCurrencyAmount,
    //         split: this.split,
    //         user_id: this.user_id,
    //       });
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       errorResponse = error.error;
    //       this.sharedService.errorLog(errorResponse);
    //     },
    //   });
    // }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transaction = this.transactionForm.value;

      let errorResponse: any;
      let responseOK: boolean = false;
      console.log(this.transactionForm.value);
      this.transactionService
        .createTransaction(this.transaction)
        .pipe(
          finalize(async () => {
            await this.sharedService.managementToast(
              'postFeedback',
              responseOK,
              errorResponse
            );

            if (responseOK) {
              this.setLastCountry();
              // this.addTransactionToPlan();
              const returnUrl =
                this.activatedRoute.snapshot.queryParams['returnUrl'] || 'home';
              this.router.navigateByUrl(returnUrl);
            }
          })
        )
        .subscribe(
          () => {
            responseOK = true;
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }

  getCategories(user_id: string) {
    this.categoryService
      .getCategoryByUserId(user_id)
      .subscribe((categories) => {
        categories.sort((a, b) => a.title.localeCompare(b.title));
        this.userCategories = categories;
      });
  }

  getUser() {
    this.userService.getUserById(this.user_id!).subscribe((user) => {
      this.user = user;
      if (this.user.lastCountry) {
        this.country.setValue(this.user.lastCountry);
      } else {
      }
    });
  }
  setLastCountry() {
    const updateUser = {
      lastCountry: String(this.transactionForm.value.country),
    };

    this.userService.updateUser(this.user_id!, updateUser).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  getCurrencyRate(selectedCountry: any) {
    const selectedCode = selectedCountry.currency.code;
    const accountCode = this.user.defaultCurrency.code;

    const url = `https://api.fxratesapi.com/convert?from=${selectedCode}&to=${accountCode}`;

    this.http.get<any>(url).subscribe((response) => {
      if (response.success) {
        this.currencyRate = response.result;
      } else {
        console.error('Error fetching currency rate:', response);
      }
    });
  }
  addTransactionToPlan(transaction_id: string) {
    const updatedPlan = Object.assign({}, this.currentPlan);

    if (!Array.isArray(updatedPlan.transactions)) {
      updatedPlan.transactions = []; // Initialize as an array if not already
    }

    updatedPlan.transactions.push(transaction_id);

    this.planService.updatePlan(this.plan_id!, updatedPlan).subscribe(
      (response) => {
        // Handle successful update (optional)
      },
      (error) => {
        // Handle update error (optional)
      }
    );
  }
}
