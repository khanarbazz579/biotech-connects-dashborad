// In-Built
import { Component, OnInit } from '@angular/core';

// Custom Types
import { CanAppCore } from 'src/@can/types/app-core.type';

// App Config
import { AppConfig } from './main/config/app.config';

// Config Validators
import { AppConfigValidator } from 'src/@can/validators/app-config-validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  // App Config
  private appConfig: CanAppCore;

  constructor() {
    // App Config Init
    this.appConfig = AppConfig;
  }

  ngOnInit() {
    // Config Validation
    AppConfigValidator.validateAppConfig(this.appConfig);
  }
}
