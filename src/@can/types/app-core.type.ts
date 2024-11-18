// Types
import { ApiType } from './api.type';
import { CanIcon } from './shared.type';

// App Config Interface
export interface CanAppCore {
  discriminator: 'appConfig';
  authConfig: CanAuth;
  navConfig: CanNav;
}

// Auth Config Interface
export interface CanAuth {
  loginUrl: string;
  successUrl: string;
  unauthorizedUrl: string;
  tokenKey: string;
  apiType: ApiType;
  logoUrl: string;
}

// Nav Config Interface
export interface CanNav {
  navTitle?: string;
  navTitleType: 'text' | 'img'
  navSrc?: string;
  fullScreenMode?: {
    icon: CanIcon;
    exitIcon: CanIcon;
  }
}
