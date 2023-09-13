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

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.urlApi = '';
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

  getTransactionByUserId(userId: string): Observable<TransactionDTO[]> {
    return this.http
      .get<TransactionDTO[]>(
        'http://localhost:3000/users/transactions/' + userId
      )
      .pipe(catchError(this.sharedService.handleError));
  }

  createTransaction(transaction: TransactionDTO): Observable<TransactionDTO> {
    return this.http
      .post<TransactionDTO>(this.urlApi, transaction)
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
