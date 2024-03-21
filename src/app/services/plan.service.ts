import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlanDTO } from '../models/plan.dto';
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
export class PlanService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'plans';
    // this.urlApi = 'http://localhost:3000/api/' + this.controller;
    this.urlApi =
      'https://travel-budget-tracker-api-dev-mqaq.1.ie-1.fl0.io/' +
      this.controller;
  }

  getPlan(): Observable<PlanDTO[]> {
    return this.http
      .get<PlanDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getPlanById(plan_id: string): Observable<PlanDTO> {
    return this.http
      .get<PlanDTO>(this.urlApi + '/find/' + plan_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  getPlanByUserId(user_id: string): Observable<PlanDTO[]> {
    return this.http
      .get<PlanDTO[]>(this.urlApi + '/find/user/' + user_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  createPlan(plan: PlanDTO): Observable<PlanDTO> {
    return this.http
      .post<PlanDTO>(this.urlApi + '/create', plan)
      .pipe(catchError(this.sharedService.handleError));
  }

  updatePlan(plan_id: string, plan: PlanDTO): Observable<PlanDTO> {
    return this.http
      .put<PlanDTO>(this.urlApi + '/' + plan_id, plan)
      .pipe(catchError(this.sharedService.handleError));
  }

  deletePlan(plan_id: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlApi + '/' + plan_id)
      .pipe(catchError(this.sharedService.handleError));
  }
}
