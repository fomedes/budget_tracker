import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Cookies from 'js-cookie';
import { finalize } from 'rxjs';
import { CategoryDTO } from 'src/app/models/category.dto';
import { CategoryService } from 'src/app/services/category.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedService } from 'src/app/services/shared.service';
import { IconSelectionDialogComponent } from '../icon-selection-dialog/icon-selection-dialog.component';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
})
export class CategoryDetailComponent implements OnInit {
  category: CategoryDTO;
  categoryForm: FormGroup;
  isValidForm: boolean | null;

  title: FormControl;
  icon: FormControl;

  private categoryId: string | null;

  defaultIcons: string[] = [
    'cat',
    'coffee-cup',
    'diet',
    'education',
    'game-console',
    'house',
    'plane',
    'vacations',
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private categoryService: CategoryService
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO();

    this.title = new FormControl('', [Validators.required]);
    this.icon = new FormControl('', [Validators.required]);

    this.categoryForm = this.fb.group({
      title: this.title,
      icon: this.icon,
      user_id: Cookies.get('user_id'),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.categoryForm.valid) {
      this.category = this.categoryForm.value;

      let errorResponse: any;
      let responseOK: boolean = false;

      let accessToken: string | undefined = Cookies.get('access_token');

      if (accessToken) {
        this.categoryService
          .createCategory(this.category, accessToken)
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
              console.log(errorResponse);
              // this.sharedService.errorLog(errorResponse);
            }
          );
      }
    }
  }

  openIconSelectionDialog(): void {
    const dialogRef = this.dialog.open(IconSelectionDialogComponent, {
      width: '400px',
      data: { icons: this.defaultIcons },
    });

    dialogRef.afterClosed().subscribe((selectedIcon: string) => {
      if (selectedIcon) {
        this.icon.setValue(selectedIcon);
      }
    });
  }
}
