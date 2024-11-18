import { CanApi } from './api.type';
import { CanButton, CanModal, CanLink, CanConditionConfig, CanAction } from './shared.type';
import { CanDownload, CanBodyParams } from './table.type';
import { CanConfirmDialog } from './confirm-dialog.type';
import { CanPermission } from './permission.type';
import { EventEmitter } from '@angular/core';

export interface CanCardView {
    type: 'inset' | 'default';
    api?: CanApi;
    isArray?: boolean;
    columnPerRow?: number;
    dataSource?: object;
    apiDataKey?: string;
    actionButtons?: CanCardActionButton[];
    title?: CanCardValueItem;
    subTitle?: CanCardValueItem;
    content?: CanCardValueItem;
    refreshEvent?: EventEmitter<boolean>;
    profile?: {
        profileName?: CanCardValueItem;
        profileSubText?: CanCardValueItem;
        profileImage?: CanCardValueItem;
        roundImage?: boolean;
    }
    image?: CanCardImage;
    insetImage?: CanCardValueItem;
    maxContentLines?: number;
    apiLimit?: number;
}


export interface CanCardValueItem {
    valueType: 'fixed' | 'key' | 'dynamic';
    type?: 'text' | 'date' | 'image';
    key?: string;
    value?: any;
    keySeparators?: Array<string>;
    dynamicText?: string;
    suffix?: string;
    prefix?: string;
    displayDateType?: string;
    isArray?: boolean
    imageAlt?: string;
    imageApiKey?: string;
}

export interface CanCardImage {
    maxHeight?: number;
    images: CanCardValueItem[];
}

export interface CanCardActionButton {
    button: CanButton;
    action: CanAction;
}
