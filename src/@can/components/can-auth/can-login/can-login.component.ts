import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CanNotificationService } from "src/@can/services/notification/notification.service";
import { CanAuth } from "src/@can/types/app-core.type";
import { CanAuthService } from "src/@can/services/auth/auth.service";
import { AppConfig } from "src/app/main/config/app.config";
import { CanAutoUnsubscribe } from "src/@can/decorators/auto-unsubscribe";
import { Subscription } from "rxjs";
import { CanPermissionService } from "src/@can/services/permission/permission.service";
import { CanApi } from "src/@can/types/api.type";
import { CanApiService } from "src/@can/services/api/api.service";

@Component({
  selector: "can-login",
  templateUrl: "./can-login.component.html",
  styleUrls: ["./can-login.component.scss"],
})
// Cleared Subscriptions
@CanAutoUnsubscribe
export class CanLoginComponent implements OnInit {
  // Auth config
  private authConfig: CanAuth;

  // Logo url
  public logo: string;

  // Show otp form
  public generateOtpForm = true;

  isLoading = false;

  // Show Login form
  // public loginForm = false;

  // Login credentials
  // public credentials = { username: '', otp: '' };

  email: string;
  password: string;

  // Disable buttons
  public disableGenerateOtpButton = false;
  public disableLoginButton = false;

  // Subscriptions
  private otpSubscription: Subscription;
  private loginSubscription: Subscription;

  loginForm: FormGroup;
  // apiService: any;

  constructor(
    private authService: CanAuthService,
    private permissionService: CanPermissionService,
    private notificationService: CanNotificationService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: CanApiService
  ) {
    this.authConfig = AppConfig.authConfig;
    this.logo = this.authConfig.logoUrl;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", [Validators.required]],
    });
  }

  // onSave() {
  //   const loginPostApi: CanApi = {
  //     apiPath: "/auth/login/email",
  //     method: "POST",
  //   };
  //   this.apiService.request(loginPostApi, this.loginForm.value).subscribe(
  //     (res) => {
  //       this.authService.setToken(res["token"]);
  //       this.permissionService.setPermissions();
  //       this.notificationService.showSuccess("Logged in successfully!");
  //       this.router.navigateByUrl(this.authConfig.successUrl);
  //     },
  //     (error) => {
  //       this.notificationService.showError(error.error.error.message);
  //     }
  //   );
  // }

  /**
   *
   * @param form :NgForm
   * Generate otp
   */
  // public onGenerateOtp(form: NgForm): void {
  //   this.disableGenerateOtpButton = true;
  //   this.otpSubscription = this.authService.generateOtp(form.value)
  //     .subscribe(res => {
  //       this.notificationService.showSuccess(res['msg']);
  //       this.generateOtpForm = false;
  //       this.loginForm = true;
  //       this.credentials.username = form.value.username;
  //       this.disableGenerateOtpButton = false;
  //     }, (err) => {
  //       this.disableGenerateOtpButton = false;
  //       this.notificationService.showError(err.error.error.message);
  //     });
  // }

  /**
   * Login
   */
  public onLogin(): void {
    this.isLoading = true;
    this.disableLoginButton = true;
    this.loginSubscription = this.authService
      .login(this.loginForm.value)
      .subscribe(
        async (res) => {
          this.authService.setToken(res["token"]);
          await this.permissionService.setPermissions();
          this.notificationService.showSuccess("Logged in successfully!");
          this.isLoading = false;
          this.router.navigateByUrl(this.authConfig.successUrl);
          this.disableLoginButton = false;
        },
        (err) => {
          this.disableLoginButton = false;
          this.notificationService.showError(err.error.error.message);
        }
      );
  }
}
