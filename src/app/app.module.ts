import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { IconSelectionDialogComponent } from './components/categories/icon-selection-dialog/icon-selection-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlanDetailComponent } from './components/plans/plan-detail/plan-detail.component';
import { PlanItemComponent } from './components/plans/plan-item/plan-item.component';
import { PlanListComponent } from './components/plans/plan-list/plan-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TransactionDetailComponent } from './components/transactions/transaction-detail/transaction-detail.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { FilterByDatePipe } from './pipes/filter-by-date.pipe';
import { UniqueCurrencyPipe } from './pipes/unique-currency.pipe';
@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    TransactionDetailComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    CategoryDetailComponent,
    CategoryListComponent,
    IconSelectionDialogComponent,
    PlanDetailComponent,
    PlanListComponent,
    UniqueCurrencyPipe,
    PlanItemComponent,
    FilterByDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
