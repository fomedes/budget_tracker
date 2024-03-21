import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryDetailComponent } from './components/categories/category-detail/category-detail.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PlanDetailComponent } from './components/plans/plan-detail/plan-detail.component';
import { PlanItemComponent } from './components/plans/plan-item/plan-item.component';
import { PlanListComponent } from './components/plans/plan-list/plan-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { TransactionDetailComponent } from './components/transactions/transaction-detail/transaction-detail.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'transactions',
    component: TransactionListComponent,
  },
  {
    path: 'user/transaction/:id',
    component: TransactionDetailComponent,
  },
  {
    path: 'categories',
    component: CategoryListComponent,
  },
  {
    path: 'user/category/:id',
    component: CategoryDetailComponent,
  },
  {
    path: 'plans',
    component: PlanListComponent,
  },
  {
    path: 'user/plan/update/:id',
    component: PlanDetailComponent,
  },
  {
    path: 'user/plan/new',
    component: PlanDetailComponent,
  },
  {
    path: 'user/plan/:id',
    component: PlanItemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
