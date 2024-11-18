import { CanRoutePermission } from 'src/@can/types/route.type';

export const RoutePermissionConfig: CanRoutePermission[] = [
    { url: '/dashboard/floors', permission: { type: 'single', match: { key: 'floor.GET', value: true } } },
    { url: '/dashboard/apartments', permission: { type: 'single', match: { key: 'unit.GET', value: true } } },
    { url: '/dashboard/users', permission: { type: 'single', match: { key: 'user.GET', value: true } } },
    { url: '/dashboard/kyc', permission: { type: 'single', match: { key: 'kyc.GET', value: true } } },
    { url: '/dashboard/beds', permission: { type: 'single', match: { key: 'bed.GET', value: true } } },
    { url: '/dashboard/feeds', permission: { type: 'single', match: { key: 'feed.GET', value: true } } },
];
