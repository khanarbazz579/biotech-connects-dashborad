// Types
import { CanApi } from './api.type';
import { CanColumnItem, CanConditionConfig } from './shared.type';
import { CanFieldAction } from './table.type';
import { CanPermission } from './permission.type';
import { EventEmitter } from '@angular/core';

// Detail View Interface
export interface CanDetailView {
    discriminator: 'detailViewConfig'
    labelPosition: 'inline' | 'top';
    displayedFields: CanDisplayedField[];
    columnPerRow: number;
    api?: CanApi;
    apiDataKey?: string;
    dataSource?: object;
  refreshEvent?: EventEmitter<boolean>;
    header?: string;
    action?: CanFieldAction[];
    permission?: CanPermission;
    elevation?: number;
}

// Detail Field Group Display Interface
export interface CanDisplayedField extends CanColumnItem {
    group?: {
        displayedFields: CanDisplayedField[];
        columnPerRow: number;
        labelPosition: 'inline' | 'top';
    },
    apiGroup?: {
        displayedFields: CanDisplayedField[];
        api: CanApi;
        dataSource?: object;
        apiDataKey?: string;
    },
    displayCondition?: CanConditionConfig;
}