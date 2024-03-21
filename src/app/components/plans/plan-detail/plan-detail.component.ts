import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Cookies from 'js-cookie';
import { finalize } from 'rxjs';
import { PlanDTO } from 'src/app/models/plan.dto';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PlanService } from 'src/app/services/plan.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss'],
})
export class PlanDetailComponent {
  plan: PlanDTO;

  planForm: FormGroup;
  isValidForm: boolean | null;

  title: FormControl;
  description: FormControl;
  picture!: FormControl;

  private isUpdateMode: boolean;
  private plan_id: string | null;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private planService: PlanService
  ) {
    this.isValidForm = null;
    this.plan_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.plan = new PlanDTO();
    this.isUpdateMode = false;

    this.title = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.picture = new FormControl('');

    this.planForm = this.fb.group({
      title: this.title,
      description: this.description,
      picture: this.picture,
      user_id: Cookies.get('user_id'),
    });

    console.log(this.plan.user_id);
  }

  ngOnInit(): void {}

  createPlan() {
    if (this.planForm.valid) {
      this.plan = this.planForm.value;
      let errorResponse: any;
      let responseOK: boolean = false;

      this.planService
        .createPlan(this.plan)
        .pipe(
          finalize(async () => {
            await this.sharedService.managementToast(
              'postFeedback',
              responseOK,
              errorResponse
            );

            if (responseOK) {
              this.router.navigateByUrl('home');
            }
          })
        )
        .subscribe(
          () => {
            responseOK = true;
          },
          (error: HttpErrorResponse) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          }
        );
    }
  }
}
