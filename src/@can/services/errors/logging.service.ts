// In-Built
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class CanLoggingService {

    /**
     * 
     * @param message: string
     * @param stack: any
     * 
     * Log Error Messages
     */
    public logError(message: string, stack: any): void {
        console.log('Error : ', message, ', Error Stack : ', stack);
    }
}
