// In-Built
import { Injectable } from '@angular/core';

// Types
import { CanSidenav } from 'src/@can/types/navigation.type';
import { CanNav } from 'src/@can/types/app-core.type';

// Configs
import { SideNavigationConfig } from 'src/app/main/config/navigation/navigation.config';
import { AppConfig } from 'src/app/main/config/app.config';

@Injectable()

export class CanNavigationService {

  private sideNavigations: CanSidenav[];
  private navConfig: CanNav;

  constructor() {

    // Sidenav Item Init
    this.sideNavigations = SideNavigationConfig;

    // Nav Config Init
    this.navConfig = AppConfig.navConfig;
  }

  /**
   * Get Side Nav Items
   */
  public getSideNavigations(): CanSidenav[] {
    return this.sideNavigations;
  }

  /**
   * Get Side Nav Config
   */
  public getNavConfig(): CanNav {
    return this.navConfig;
  }
}
