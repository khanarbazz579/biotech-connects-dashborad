// In-Built
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CanMaterialModule } from 'src/@can/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Packages
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AngularResizedEventModule } from 'angular-resize-event';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageCropperModule } from 'ngx-image-cropper';

// Components
import { CanTableComponent } from 'src/@can/components/can-table/can-table.component';
import { CanImageModalComponent } from 'src/@can/modals/can-image-modal/can-image-modal.component';
import { CanTableFilterComponent } from 'src/@can/components/can-table/can-table-filter/can-table-filter.component';
import { CanDownloadComponent } from 'src/@can/components/can-download/can-download.component';
import { CanTableBulkActionsComponent } from 'src/@can/components/can-table/can-table-bulk-actions/can-table-bulk-actions.component';
import { CanUploadComponent } from 'src/@can/components/can-upload/can-upload.component';
import { CanModalComponent } from 'src/@can/modals/can-modal/can-modal.component';
import { CanConfirmModalComponent } from 'src/@can/modals/can-confirm-modal/can-confirm-modal.component';
import { CanDetailViewComponent } from 'src/@can/components/can-detail-view/can-detail-view.component';
import { CanDocumentModalComponent } from 'src/@can/modals/can-document-modal/can-document-modal.component';
import { CanFormComponent } from 'src/@can/components/can-form/can-form.component';
import { CanFabButtonComponent } from 'src/@can/components/can-fab-button/can-fab-button.component';
import { CanLoaderComponent } from 'src/@can/components/can-loader/can-loader.component';
import { CanModalFooterComponent } from 'src/@can/modals/can-modal/can-modal-footer/can-modal-footer.component';
import { CanTableFabViewComponent } from 'src/@can/components/can-view/can-table-fab-view/can-table-fab-view.component';
import { CanFormStepperComponent } from 'src/@can/components/can-form-stepper/can-form-stepper.component';
import { CanIconComponent } from 'src/@can/components/can-icon/can-icon.component';
import { CanButtonComponent } from 'src/@can/components/can-button/can-button.component';
import { CanTabViewComponent } from 'src/@can/components/can-tab-view/can-tab-view.component';
import { CanCardViewComponent } from 'src/@can/components/can-card-view/can-card-view.component';
import { CanNotFoundComponent } from 'src/@can/components/can-not-found/can-not-found.component';
import { CanMiniCardComponent } from 'src/@can/components/can-mini-card/can-mini-card.component';

// Pipes
import { CanFilterListPipe } from 'src/@can/pipes/filterList/filter-list.pipe';

// Interceptors
import { CanHeaderInterceptor } from 'src/@can/interceptors/header.interceptor';

// Directives
import { CanValidatePermissionDirective } from 'src/@can/directives/can-validate-permission/can-validate-permission.directive';
import { CanCardFabViewComponent } from '../components/can-view/can-card-fab-view/can-card-fab-view.component';
import { CanCaraouselComponent } from '../components/can-caraousel/can-caraousel.component';
import { CanTabItemComponent } from '../components/can-tab-view/can-tab-item/can-tab-item.component';
import { CanChartComponent } from '../components/can-chart/can-chart.component';
import { CanImageFormatterComponent } from '../components/can-image-formatter/can-image-formatter.component';
import { CanListViewComponent } from '../components/can-list-view/can-list-view.component';
import { CanTabFabViewComponent } from '../components/can-view/can-tab-fab-view/can-tab-fab-view.component';
import { CanPageFilterComponent } from '../components/can-page-filter/can-page-filter.component';


@NgModule({
  declarations: [
    // Components
    CanTableComponent,
    CanTableFilterComponent,
    CanDownloadComponent,
    CanTableBulkActionsComponent,
    CanUploadComponent,
    CanDetailViewComponent,
    CanFormComponent,
    CanFabButtonComponent,
    CanLoaderComponent,
    CanFormStepperComponent,
    CanIconComponent,
    CanButtonComponent,
    CanTabViewComponent,
    CanCardViewComponent,
    CanNotFoundComponent,
    CanCaraouselComponent,
    CanTabItemComponent,
    CanChartComponent,
    CanImageFormatterComponent,
    CanListViewComponent,
    CanMiniCardComponent,
    CanPageFilterComponent,


    // View 
    CanTableFabViewComponent,
    CanCardFabViewComponent,
    CanTabFabViewComponent,

    // Modals
    CanImageModalComponent,
    CanModalComponent,
    CanConfirmModalComponent,
    CanDocumentModalComponent,
    CanModalFooterComponent,

    // Pipes
    CanFilterListPipe,


    // Directives
    CanValidatePermissionDirective
  ],
  imports: [
    // In Built Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Router
    RouterModule,

    // Packages
    FlexLayoutModule,
    PinchZoomModule,

    // Custom Modules
    CanMaterialModule,
    MaterialFileInputModule,

    // Owl Date Time Picker
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

    // Quill editor
    QuillModule.forRoot(),

    // Angular Resize Module
    AngularResizedEventModule,

    // Infinite Scroll
    InfiniteScrollModule,

    // Image Cropper
    ImageCropperModule

  ],
  exports: [
    // In Built
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Packages
    FlexLayoutModule,

    // Custom
    CanMaterialModule,
    MaterialFileInputModule,

    // Owl Date Time Picker
    OwlDateTimeModule,
    OwlNativeDateTimeModule,


    // Components
    CanTableComponent,
    CanDownloadComponent,
    CanDetailViewComponent,
    CanFormComponent,
    CanFabButtonComponent,
    CanLoaderComponent,
    CanFormStepperComponent,
    CanIconComponent,
    CanButtonComponent,
    CanTabViewComponent,
    CanCardViewComponent,
    CanNotFoundComponent,
    CanCaraouselComponent,
    CanTabItemComponent,
    CanChartComponent,
    CanImageFormatterComponent,
    CanListViewComponent,
    CanMiniCardComponent,
    CanPageFilterComponent,


    // View 
    CanTableFabViewComponent,
    CanCardFabViewComponent,
    CanTabFabViewComponent,

    //Pipes
    CanFilterListPipe,

    // Directives
    CanValidatePermissionDirective

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CanHeaderInterceptor, multi: true },
    DatePipe
  ],
  entryComponents: [
    CanImageModalComponent,
    CanModalComponent,
    CanTableComponent,
    CanConfirmModalComponent,
    CanDocumentModalComponent,
    CanModalFooterComponent,
    CanIconComponent,
    CanTabItemComponent,
    CanImageFormatterComponent
  ]
})

export class CanSharedModule { }
