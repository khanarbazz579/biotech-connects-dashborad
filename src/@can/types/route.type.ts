// Types
import { CanPermission } from './permission.type';

// Route Permission Interface
export interface CanRoutePermission {
    url: string;
    permission: CanPermission;
}
