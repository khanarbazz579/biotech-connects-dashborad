// In-Built
import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Services
import { CanErrorService } from 'src/@can/services/errors/error.service';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { CanLoggingService } from 'src/@can/services/errors/logging.service';
import { CanAuthService } from 'src/@can/services/auth/auth.service';

// Enums
import { CanHttpResponseType } from 'src/@can/enums/http-response-type.enum';

@Injectable()
export class CanServerErrorInterceptor implements HttpInterceptor {

    constructor(
        private errorService: CanErrorService,
        private notificationService: CanNotificationService,
        private loggerService: CanLoggingService,
        private authService: CanAuthService) { }

    /**
     * 
     * @param req: HttpRequest
     * @param next: HttpHandler
     * 
     * Intecept Server Error
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            // retry(1),
            catchError((error: HttpErrorResponse) => {
                // Server Error
                const message = this.errorService.getServerMessage(error);
                const stackTrace = this.errorService.getServerStack(error);
                this.notificationService.showError(message);
                this.loggerService.logError('Server Error', stackTrace);
                // Logout if token expired
                if (error.status === CanHttpResponseType.Forbidden) {
                    this.authService.logout();
                }
                return throwError(error);
            })
        );
    }
}
