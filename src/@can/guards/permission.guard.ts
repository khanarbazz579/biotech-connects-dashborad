// In-Built
import { Injectable } from '@angular/core';
import { CanLoad, Route, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Services
import { CanPermissionService } from 'src/@can/services/permission/permission.service';

// Types
import { CanRoutePermission } from 'src/@can/types/route.type';
import { CanAuth } from 'src/@can/types/app-core.type';

// Configs
import { RoutePermissionConfig } from 'src/app/main/config/navigation/route.config';
import { AppConfig } from 'src/app/main/config/app.config';

@Injectable()
export class CanPermissionGuard implements CanLoad, CanActivate {

    private authConfig: CanAuth;
    private routePermissionConfig: CanRoutePermission[];

    constructor(private permissionService: CanPermissionService, private router: Router) {
        // Client Auth Config Validation
        this.authConfig = AppConfig.authConfig;
        this.routePermissionConfig = RoutePermissionConfig;
    }

    canLoad(route: Route): boolean {
        return this.checkPermission(`/${route.path}`);
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.checkPermission(state.url, route.params);
    }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return this.checkPermission(state.url, route.params);
    }

    private checkPermission(url: string, params?: any): boolean {
        if (params) {
            const paramKeys = Object.keys(params);
            paramKeys.forEach(pK => {
              url = url.replace('/' + params[pK], '/:' + pK);
            });
        }
        for (const each of this.routePermissionConfig) {
            if (url === each.url) {
                if (this.permissionService.validatePermission(each.permission)) {
                    return true;
                } else {
                    this.navigateTo(this.authConfig.unauthorizedUrl);
                    return false;
                }
            }
        }
        return true;
    }

    private navigateTo(route: string) {
        this.router.navigate([`/${route}`], { replaceUrl: true });
    }
}
