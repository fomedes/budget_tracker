import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderMenus } from 'src/app/models/header-menus.dto';
import { HeaderMenusService } from 'src/app/services/header-menus.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { CurrencyList } from 'src/app/shared/currencies.constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  Currencies = CurrencyList;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService
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
  }

  navigationTo(route: string): void {
    if (route == 'logout') {
      this.localStorageService.remove('user_id');
      this.localStorageService.remove('access_token');

      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };

      this.headerMenusService.headerManagement.next(headerInfo);

      this.router.navigateByUrl('home');
    } else {
      this.router.navigateByUrl(route);
    }
  }
}
