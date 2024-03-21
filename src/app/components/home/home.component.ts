import { Component, OnInit } from '@angular/core';
import { HeaderMenus } from 'src/app/models/header-menus.dto';
import { PlanDTO } from 'src/app/models/plan.dto';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PlanService } from 'src/app/services/plan.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  lastThreeExpenses: any[] = []; // Replace 'any[]' with your actual expense model
  lastMonthRecap: any = {}; // Replace 'any' with your actual recap model
  userPlans!: PlanDTO[];
  user_id!: string | null;

  constructor(
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private planService: PlanService,
    private userService: UserService
  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenus) => {
        this.showAuthSection = headerInfo.showAuthSection;
        this.showNoAuthSection = headerInfo.showNoAuthSection;
      }
    );

    // this.lastThreeExpenses = [
    //   { name: 'Expense 1', amount: 50 },
    //   { name: 'Expense 2', amount: 75 },
    //   { name: 'Expense 3', amount: 100 },
    // ];

    // this.lastMonthRecap = {
    //   total: 225,
    //   categories: 5,
    // };
    this.user_id = this.userService.getCurrentUser();

    if (this.user_id) {
      this.planService.getPlanByUserId(this.user_id).subscribe((plans) => {
        this.userPlans = plans;
      });
    } else {
      console.warn('User ID not found');
    }
  }

  navigationTo(route: string): void {
    this.sharedService.navigationTo(route);
  }

  createNewCategory() {
    // Logic to navigate to the new category creation page or display a modal
    console.log('Create New Category clicked');
  }
}
