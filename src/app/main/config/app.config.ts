// Custom Types
import { CanAppCore } from 'src/@can/types/app-core.type';
import { ApiType } from 'src/@can/types/api.type';

/**
 * Base config to run the application
 * 
 * App Config Globally Available
 */
export const AppConfig: CanAppCore = {
  discriminator: 'appConfig',
  authConfig: {
    loginUrl: '/auth/login',
    successUrl: '/dashboard',
    unauthorizedUrl: '/unauthorized',
    tokenKey: 'authorization',
    apiType: ApiType.Loopback,
    logoUrl: 'assets/images/biotech-logo.png',
  },
  navConfig: {
    navTitleType: 'img',
    navSrc: 'assets/images/biotech-logo.png',
    fullScreenMode: {
      icon: {
        name: 'fullscreen',
        tooltip: 'Full Screen',
        color: '#fff'
      },
      exitIcon: {
        name: 'fullscreen_exit',
        tooltip: 'Exit Full Screen',
        color: '#fff'
      }
    }
  }
};

