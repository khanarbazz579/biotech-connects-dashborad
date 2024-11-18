import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanLoginComponent } from './can-login/can-login.component';

const routes: Routes = [
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: CanLoginComponent
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

export class CanAuthRoutingModule { }
