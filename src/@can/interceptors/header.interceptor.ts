// In-Built
import { Injectable } from '@angular/core';
import {
    HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

// Servicess
import { CanAuthService } from 'src/@can/services/auth/auth.service';

@Injectable()
export class CanHeaderInterceptor implements HttpInterceptor {
    constructor(private authService: CanAuthService) { }

    /**
     * 
     * @param req: HttpRequest
     * @param next: HttpHandler
     * 
     * Attach Auth Token in Each Request
     */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        if (authToken) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + authToken)
            });
        } else {
            this.authService.logout();
        }
        return next.handle(req);
    }
}
