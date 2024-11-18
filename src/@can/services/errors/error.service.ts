// In-Built
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class CanErrorService {

    /**
     * 
     * @param error: Error
     * 
     * Return Client Error Message
     */
    public getClientMessage(error: Error): string {
        if (!navigator.onLine) {
            return 'No Internet Connection';
        }
        return error.message ? error.message : error.toString();
    }

    /**
     * 
     * @param error: Error
     * 
     * Return Client Error Stack
     */
    public getClientStack(error: Error): string {
        return error.stack;
    }

    /**
     * 
     * @param error: HttpErrorResponse
     * 
     * Return Client Error Message
     */
    getServerMessage(error: HttpErrorResponse): string {
        // return error.error.error ? error.error.error.message : error.message;
        return error.error.error ? error.error.message : error.message;

    }

    /**
     * 
     * @param error: HttpErrorResponse
     * 
     * Return Client Error Stack
     */
    getServerStack(error: HttpErrorResponse): string {
        return error.error.error ? error.error.error.stack : null;
    }
}
