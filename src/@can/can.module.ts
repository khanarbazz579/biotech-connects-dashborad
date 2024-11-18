// In-Built Modules
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Custom Modules
import { CanSharedModule } from './modules/shared.module';
import { CanRoutingModule } from './can.route';
import { CanAuthRoutingModule } from './components/can-auth/can-auth.route';
import { CanAuthModule } from './components/can-auth/can-auth.module';
import { CanUnauthorizedModule } from './components/can-unauthorized/can-unauthorized.module';

// Services
import { CanGlobalErrorHandlerService } from './services/errors/global-error-handler.service';
import { CanAuthService } from './services/auth/auth.service';
import { CanNavigationService } from './services/navigation/navigation.service';

// Guards
import { CanAuthGuard } from './guards/auth.guard';
import { CanPermissionGuard } from './guards/permission.guard';

// Interceptors
import { CanServerErrorInterceptor } from './interceptors/server-error.interceptor';

// Components
import { CanLayoutComponent } from './components/can-layout/can-layout.component';
import { CanSidenavComponent } from './components/can-sidenav/can-sidenav.component';

@NgModule({
    declarations: [
        CanLayoutComponent,
        CanSidenavComponent,
    ],
    imports: [
        CanSharedModule,
        CanAuthModule,
        CanRoutingModule,
        CanAuthRoutingModule,
        CanUnauthorizedModule
    ],
    exports: [
    ],
    providers: [
        { provide: ErrorHandler, useClass: CanGlobalErrorHandlerService },
        { provide: HTTP_INTERCEPTORS, useClass: CanServerErrorInterceptor, multi: true },
        CanAuthService,
        CanAuthGuard,
        CanPermissionGuard,
        CanNavigationService,
    ]
})

export class CanModule { }
