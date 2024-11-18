// In-Built
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Services
import { CanErrorService } from './error.service';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { CanLoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

export class CanGlobalErrorHandlerService implements ErrorHandler {

  private showError = false;

  constructor(
    private injector: Injector
  ) { }

  /**
   * 
   * @param error: Error | HttpErrorResponse
   * 
   * Global Error Handler
   */
  handleError(error: Error | HttpErrorResponse) {

    const errorService = this.injector.get(CanErrorService);
    const notificationService = this.injector.get(CanNotificationService);
    const loggerService = this.injector.get(CanLoggingService);

    let message;
    let stackTrace;

    if (!this.showError) {
      this.showError = true;
      if (error instanceof TypeError) {
        this.showError = false;
      } else {
        if (!(error instanceof HttpErrorResponse)) {
          // Client Error
          message = errorService.getClientMessage(error);
          stackTrace = errorService.getClientStack(error);
          notificationService.showError(message);
          loggerService.logError('Client Error', stackTrace);
        }
      }
    }
  }
}
