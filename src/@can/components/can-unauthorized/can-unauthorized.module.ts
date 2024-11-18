import { NgModule } from '@angular/core';
import { CanSharedModule } from 'src/@can/modules/shared.module';
import { CanUnauthorizedComponent } from './can-unauthorized.component';
import { CanUnauthorizedRoutingModule } from './can-unauthorized.route';

@NgModule({
    declarations: [
        CanUnauthorizedComponent
    ],
    imports: [
        CanSharedModule,
        CanUnauthorizedRoutingModule
    ],
    exports: [
        CanUnauthorizedComponent
    ]
})

export class CanUnauthorizedModule { }
