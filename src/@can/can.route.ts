// In-Built Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { CanAuthGuard } from './guards/auth.guard';
import { CanPermissionGuard } from './guards/permission.guard';

// Components
import { CanLayoutComponent } from './components/can-layout/can-layout.component';

/**
 * Render Main App routes
 */
const routes: Routes = [
    {
        path: '',
        component: CanLayoutComponent,
        canActivateChild: [CanAuthGuard, CanPermissionGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadChildren: () => import('src/app/main/dashboard/dashboard.module').then(m => m.DashboardModule),
                canLoad: [CanAuthGuard, CanPermissionGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class CanRoutingModule { }
