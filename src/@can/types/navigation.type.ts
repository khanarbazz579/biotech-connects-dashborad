// Types
import { CanPermission } from './permission.type';
import { CanIcon } from './shared.type';

// Sidenav Interface
export interface CanSidenav {
    type: 'single' | 'group'
    url?: string;
    name: string;
    icon: CanIcon;
    badge?: number;
    permission?: CanPermission;
    group?: CanSidenav[];
    expanded?: boolean;
}
