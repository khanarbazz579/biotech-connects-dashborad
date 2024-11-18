import { NgModule } from '@angular/core';
import { CanSharedModule } from 'src/@can/modules/shared.module';
import { CanAuthRoutingModule } from './can-auth.route';
import { CanLoginComponent } from './can-login/can-login.component';

@NgModule({
    declarations: [
        CanLoginComponent
    ],
    imports: [
        CanSharedModule,
        CanAuthRoutingModule
    ],
    exports: [
        CanLoginComponent
    ]
})

export class CanAuthModule { }
