import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CountriesList } from 'src/app/shared/countries.constants';
import { CurrencyList } from 'src/app/shared/currencies.constants';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  transaction: TransactionDTO;
  title: FormControl;
  date: FormControl;
  category: FormControl;
  amount: FormControl;
  currency: FormControl;
  country: FormControl;
  description: FormControl;
  split!: FormControl;

  transactionForm: FormGroup;
  isValidForm: boolean | null;

  Categories = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    // ... Add more options as needed
  ];

  Friends = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    // ... Add more options as needed
  ];

  Currencies = CurrencyList;
  Countries = CountriesList;

  private isUpdateMode: boolean;
  private transactionId: string | null;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private transactionService: TransactionService
  ) {
    this.isValidForm = null;
    this.transactionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.transaction = new TransactionDTO(
      '',
      '',
      new Date(),
      '',
      0,
      '',
      '',
      '',
      '',
      ''
    );
    this.isUpdateMode = false;

    this.title = new FormControl(this.transaction.title, [Validators.required]);

    this.date = new FormControl(
      formatDate(this.transaction.date, 'yyyy-MM-dd', 'en'),
      [Validators.required]
    );

    this.category = new FormControl(this.transaction.category, [
      Validators.required,
    ]);

    this.amount = new FormControl([Validators.required]);

    this.currency = new FormControl(this.transaction.currency, [
      Validators.required,
    ]);

    this.country = new FormControl('Australia', [Validators.required]);

    this.description = new FormControl(this.transaction.description);

    this.split = new FormControl(this.transaction.split);

    this.transactionForm = this.fb.group({
      title: this.title,
      amount: this.amount,
      categories: this.category,
      date: this.date,
      currency: this.currency,
      country: this.country,
      description: this.description,
      split: this.split,
    });
  }

  ngOnInit(): void {
    let errorResponse: any;

    if (this.transactionId) {
      this.isUpdateMode = true;

      this.transactionService.getTransactionById(this.transactionId).subscribe({
        next: (transaction: TransactionDTO) => {
          this.transaction = transaction;

          this.title.setValue(this.transaction.title);

          this.description.setValue(this.transaction.description);

          this.date.setValue(
            formatDate(this.transaction.date, 'yyyy-MM-dd', 'en')
          );
          /*
            let categoriesIds: string[] = [];
            this.transaction.category.forEach((cat: CategoryDTO) => {
              categoriesIds.push(cat.categoryId);
            });
          */
          this.category.setValue(this.transaction.category);

          this.transactionForm = this.fb.group({
            title: this.title,
            amount: this.amount,
            categories: this.category,
            date: this.date,
            currency: this.currency,
            country: this.country,
            description: this.description,
            split: this.split,
          });
        },
        error: (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        },
      });
    }
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      console.log(this.transactionForm.value);
    }
  }
}
