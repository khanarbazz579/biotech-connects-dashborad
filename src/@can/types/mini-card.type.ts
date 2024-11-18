import { CanApi } from "./api.type";
import { CanButton, CanAction } from "./shared.type";
import { CanFieldAction } from "./table.type";
import { EventEmitter } from '@angular/core';

export interface CanMiniCardView {
  header?: string;
  mainText?: CanMiniCardItem;
  subText?: CanMiniCardItem;
  display: "scroll-x" | "scroll-y" | "wrap";
  backgroundColor?: string;
  api?: CanApi;
  dataSource?: Array<object>;
  apiDataKey?: string;
  actionButtons?: CanCardActionButton[];
  headerAction?: CanFieldAction[];
  refreshEvent?: EventEmitter<boolean>;
}

export interface CanCardActionButton {
  button: CanButton;
  action: CanAction;
}

export interface CanMiniCardItem {
  value?: any;
  keySeparators?: Array<string>;
  suffix?: string;
  prefix?: string;
  color?: string;
}
