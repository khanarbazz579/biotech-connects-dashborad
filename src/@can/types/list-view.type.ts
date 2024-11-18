import { CanApi } from './api.type';
import { CanPermission } from './permission.type';
import { CanFieldAction, CanBulkFieldAction } from './table.type';
import { CanButton } from './shared.type';

export interface CanListView {
    discriminator: 'listConfig';
    apiDataKey?: string;
    api?: CanApi;
    countApi?: CanApi;
    countApiDataKey?: string;
    dataSource?: Array<any>;
    mainText?: CanListViewItem;
    subText?: CanListViewItem;
    body?:CanListViewItem;
    elevation?: number;
    // pagination: CanPagination;
    fieldActions?: CanFieldAction[];
    avatarImage : CanListviewImage;
    bulkFieldAction?: CanBulkFieldAction[];
    header?: string;
    headerAction?: CanFieldAction[];
    footerAction?: CanButton[];
    permission?: CanPermission;
}

export interface CanListviewImage{
    imageUrl?: string;
    radius: number;
    value?:string;
}

export interface CanListViewItem {
   type: 'text' | 'date';
   key: string;
   keySeparators?: Array<string>;
   suffix?: string;
   prefix?: string;
   displayDateType?: string;
}
