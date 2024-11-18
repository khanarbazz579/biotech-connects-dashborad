// In-Built
import { Injectable } from '@angular/core';
import { CanLoad, Route, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Services
import { CanAuthService } from 'src/@can/services/auth/auth.service';

// Typess
import { CanAuth } from 'src/@can/types/app-core.type';

// Configs
import { AppConfig } from 'src/app/main/config/app.config';

@Injectable()
export class CanAuthGuard implements CanLoad, CanActivate {

  private authConfig: CanAuth;

  constructor(private authService: CanAuthService, private router: Router) {
    // Client Auth Config
    this.authConfig = AppConfig.authConfig;
  }

  canLoad(route: Route): boolean {
    return this.checkLogin(`/${route.path}`);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkLogin(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkLogin(state.url);
  }

  private checkLogin(url: string): boolean {
    const isLoggedIn = this.authService.isAuthenticated;
    if (url === this.authConfig.loginUrl && isLoggedIn) {
      this.navigateTo(this.authConfig.successUrl);
      return true;
    } else if (url === this.authConfig.loginUrl && !isLoggedIn) {
      return true;
    } else if (isLoggedIn) {
      return true;
    } else {
      this.navigateTo(this.authConfig.loginUrl);
      return false;
    }
  }

  private navigateTo(route: string) {
    this.router.navigate([`/${route}`], { replaceUrl: true });
  }
}
