// In-Built
import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';

// Environment
import { environment } from 'src/environments/environment';

// Types
import { CanAuth } from 'src/@can/types/app-core.type';

// Services
import { CanNotificationService } from 'src/@can/services/notification/notification.service';

// Configs
import { AppConfig } from 'src/app/main/config/app.config';
import { CanApiService } from '../api/api.service';

@Injectable()

export class CanAuthService {

  private apiUrl = environment.baseUrl;
  private loginUrl = this.apiUrl +  '/auth/login/email';
  private generateOtpUrl = this.apiUrl +'/auth/generate-otp';
  private authConfig: CanAuth;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: CanNotificationService,
    private handler: HttpBackend,
    private apiService: CanApiService
  ) {
    // Client Auth Config Init
    this.authConfig = AppConfig.authConfig;
    // For not using header interceptor
    this.http = new HttpClient(this.handler);

  }

  /**
   * Extract Permission Object from Auth Token
   */
  public currentUser(): any {
    const token = this.getToken();
    return JSON.parse(atob(token.split('.')[1]));
  }

  /**
   * Check User is Authenticate or not
   */
  public get isAuthenticated(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  /**
   * 
   * @param token: string
   * 
   * Set Auth Token in local storage
   */
  public setToken(token: string): void {
    localStorage.setItem(this.authConfig.tokenKey, token);
  }

  /**
   * Get Token from Local Storage
   */
  public getToken(): string {
    return localStorage.getItem(this.authConfig.tokenKey);
  }

  /**
   * Remove Token from Local Storage
   */
  public removeToken(): void {
    localStorage.removeItem(this.authConfig.tokenKey);
  }

  // API CALLS
  public generateOtp(payload) {
    return this.http.post(this.generateOtpUrl, payload);
  }

  public login(payload) {
    return this.http.post(this.loginUrl, payload);
  }

  public validate() {
    return this.apiService.request({
      apiPath: "/users/validate",
      method: "GET",
    });
  }
  
  public logout() {
    this.removeToken();
    this.router.navigateByUrl(this.authConfig.loginUrl);
    this.notificationService.showSuccess('Logged In successfully.');
  }

}
