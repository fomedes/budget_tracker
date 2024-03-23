import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Cookies from 'js-cookie';
import { PlanDTO } from 'src/app/models/plan.dto';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PlanService } from 'src/app/services/plan.service';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-plan-item',
  templateUrl: './plan-item.component.html',
  styleUrls: ['./plan-item.component.scss'],
})
export class PlanItemComponent {
  private childPlans!: any[];
  private parentPlan!: string;
  private user_id!: string | null;
  private plan_id: string | null;

  currentPlan!: PlanDTO;
  planTransactions!: any[];
  transactionsDates!: any[];

  constructor(
    private headerMenusService: HeaderMenusService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private planService: PlanService,
    private userService: UserService,
    private transactionService: TransactionService,
    private datePipe: DatePipe
  ) {
    this.plan_id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.user_id = this.userService.getCurrentUser();
    if (this.plan_id) {
      Cookies.set('plan_id', this.plan_id);

      this.planService.getPlanById(this.plan_id).subscribe((res) => {
        this.currentPlan = res;
      });
      this.getPlanTransactions(this.plan_id);
    }
  }

  navigationTo(route: string): void {
    this.sharedService.setData('currentPlan', this.currentPlan);
    this.sharedService.navigationTo(route);
  }

  getPlanTransactions(plan_id: string) {
    this.transactionService
      .getTransactionByPlanId(plan_id)
      .subscribe((transactions) => {
        this.planTransactions = transactions.sort((b, a) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        this.planTransactions = transactions.map((transaction) => ({
          ...transaction,
          date: this.datePipe.transform(transaction.date, 'dd-MM-yyyy')!,
        }));

        this.transactionsDates = Array.from(
          new Set(
            transactions.map(
              (t) => this.datePipe.transform(t.date, 'dd-MM-yyyy')!
            )
          )
        );
      });
  }
}
