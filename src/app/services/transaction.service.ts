import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TransactionDTO } from '../models/transaction.dto';
import { SharedService } from './shared.service';

interface updateResponse {
  affected: number;
}

export interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'transactions';
    // this.urlApi = 'http://localhost:3000/api/' + this.controller;
    this.urlApi =
      'https://travel-budget-tracker-api-dev-mqaq.1.ie-1.fl0.io/' +
      this.controller;
  }

  getTransaction(): Observable<TransactionDTO[]> {
    return this.http
      .get<TransactionDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getTransactionById(transactionId: string): Observable<TransactionDTO> {
    return this.http
      .get<TransactionDTO>(this.urlApi + '/' + transactionId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getTransactionByUserId(user_id: string): Observable<TransactionDTO[]> {
    return this.http
      .get<TransactionDTO[]>(this.urlApi + '/find/user/' + user_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  getTransactionByPlanId(plan_id: string): Observable<TransactionDTO[]> {
    return this.http
      .get<TransactionDTO[]>(this.urlApi + '/find/plan/' + plan_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  createTransaction(transaction: TransactionDTO): Observable<TransactionDTO> {
    return this.http
      .post<TransactionDTO>(this.urlApi + '/create', transaction)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateTransaction(
    transactionId: string,
    transaction: TransactionDTO
  ): Observable<TransactionDTO> {
    return this.http
      .put<TransactionDTO>(this.urlApi + '/' + transactionId, transaction)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteTransaction(transactionId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlApi + '/' + transactionId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
