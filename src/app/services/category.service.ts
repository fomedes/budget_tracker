import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryDTO } from '../models/category.dto';
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
export class CategoryService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'categories';
    // this.urlApi = 'http://localhost:3000/api/' + this.controller;
    this.urlApi =
      'https://travel-budget-tracker-api-dev-mqaq.1.ie-1.fl0.io/api/' +
      this.controller;
  }

  getCategory(): Observable<CategoryDTO[]> {
    return this.http
      .get<CategoryDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    return this.http
      .get<CategoryDTO>(this.urlApi + '/' + categoryId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getCategoryByUserId(user_id: string): Observable<CategoryDTO[]> {
    return this.http
      .get<CategoryDTO[]>(this.urlApi + '/find/user/' + user_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  createCategory(
    category: CategoryDTO,
    accessToken: string
  ): Observable<CategoryDTO> {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    return this.http
      .post<CategoryDTO>(this.urlApi + '/create', category, options)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Observable<CategoryDTO> {
    return this.http
      .put<CategoryDTO>(this.urlApi + '/' + categoryId, category)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteCategory(categoryId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlApi + '/' + categoryId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
