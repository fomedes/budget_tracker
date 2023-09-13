import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionDTO } from 'src/app/models/transaction.dto';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import {
  TransactionService,
  deleteResponse,
} from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  transactions!: TransactionDTO[];

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.transactionService.getTransactionByUserId(userId).subscribe(
        (transactions: TransactionDTO[]) => {
          this.transactions = transactions;
        },
        (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        }
      );
    }
  }

  createTransaction(): void {
    this.router.navigateByUrl('/user/transaction/');
  }

  updateTransaction(transactionId: string): void {
    this.router.navigateByUrl('/user/transaction/' + transactionId);
  }

  deleteTransaction(transactionId: string): void {
    let errorResponse: any;

    // show confirmation popup
    let result = confirm(
      'Confirm delete transaction with id: ' + transactionId + ' .'
    );
    if (result) {
      this.transactionService.deleteTransaction(transactionId).subscribe({
        next: (rowsAffected: deleteResponse) => {
          if (rowsAffected.affected > 0) {
            this.loadTransactions();
          }
        },
        error: (error: HttpErrorResponse) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        },
      });
    }
  }
}
