// In-Built
import { Injectable, NgZone } from '@angular/core';

// Material
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})

export class CanNotificationService {

    constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

    /**
     * 
     * @param message: string
     * 
     * Show Success Message
     * 
     */
    public showSuccess(message: string,  duration?:number): void {
        this.snackBar.open(message, 'close',
            { horizontalPosition: 'center', verticalPosition: 'top', duration: duration? duration : 2000 });
    }

    public closeSuccess(): void {
        this.snackBar.dismiss();
    }

    /**
     * 
     * @param message: string
     * 
     * Show Error Message
     */
    public showError(message: string, duration?:number): void {
        this.zone.run(() => {
            this.snackBar.open(message, 'close',
                { horizontalPosition: 'center', verticalPosition: 'top', duration:  duration? duration : 2000 });
        });
    }

}
