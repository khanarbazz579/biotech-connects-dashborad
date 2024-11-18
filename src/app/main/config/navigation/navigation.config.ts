// Custom Types
import { CanSidenav } from 'src/@can/types/navigation.type';
import { CanIconType } from 'src/@can/types/shared.type';

/**
 * To Show Sidemenu in UI
 * 
 * Also it can be protected with Roles and Permissions
 * 
 * Side Navigation Config
 */
 export const SideNavigationConfig: CanSidenav[] = [
    {
        type: 'single',
        url: '/dashboard/blogs',
        name: 'Blogs',
        icon: { type: CanIconType.Flaticon, name: 'flaticon-box' },
    },
    // {
    //     type: 'group',
    //     name: 'Masters',
    //     icon: { type: CanIconType.Flaticon, name: 'flaticon-box' },
    //     group: [
    //         {
    //             type: 'single',
    //             url: '/dashboard/products',
    //             name: 'Product',
    //             icon: { type: CanIconType.Flaticon, name: 'flaticon-box' }
        
    //         },
    //         {
    //             type: 'single',
    //             url: '/dashboard/gsts',
    //             name: 'GST',
    //             icon: { type: CanIconType.Flaticon, name: 'flaticon-box' },
        
    //         }, 
    //     ]
    // },  
     
    {
        type: 'group',
        name: 'User Managment',
        icon: { type: CanIconType.Flaticon, name: 'flaticon-users' },
        group: [
            {
                type: 'single',
                url: '/dashboard/roles',
                name: 'Roles',
                icon: { type: CanIconType.Flaticon, name: 'flaticon-users' },
            },
            {
                type: 'single',
                url: '/dashboard/permissions',
                name: 'Permission',
                icon: { type: CanIconType.Flaticon, name: 'flaticon-settings' },
            },
            {
                type: 'single',
                name: 'Users',
                url: '/dashboard/users',
                icon: { type: CanIconType.Flaticon, name: 'flaticon-users' },
            },   
        ]
    },     
    
 ];
//  src/app/main/dashboard/components/customers