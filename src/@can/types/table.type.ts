// Types
import { CanApi } from "./api.type";
import { CanConfirmDialog } from "./confirm-dialog.type";
import {
  CanColumnItem,
  CanModal,
  CanLink,
  CanValueItem,
  CanIcon,
  CanConditionConfig,
  CanAction,
} from "./shared.type";
import { CanPermission } from "./permission.type";
import { EventEmitter } from "@angular/core";

// Table Interface
export interface CanTable {
  discriminator: "tableConfig";
  elevation?: number;
  hideRefreshButton?: boolean;
  apiDataKey?: string;
  successMessageKey?: string;
  displayedColumns: CanColumnItem[];
  refreshEvent?: EventEmitter<boolean>;
  api?: CanApi;
  countApi?: CanApi;
  countApiDataKey?: string;
  dataSource?: Array<any>;
  pagination?: CanPagination;
  filters?: CanFilter[];
  bulkActions?: CanBulkAction[];
  upload?: CanUpload;
  fieldActions?: CanFieldAction[];
  bulkFieldAction?: CanBulkFieldAction[];
  header?: string;
  permission?: CanPermission;
  indexer?: boolean;
  apiLimit?: number;
  alignment?: "left" | "right" | "center";
}

// Table Pagination Interface
interface CanPagination {
  pageSizeOptions: number[];
}

// Table Filter Interface
export interface CanFilter {
  placeholder: string;
  type?: "text" | "dropdown" | "checkbox" | "radio" | "date" | "download";
  filtertype: "local" | "api";
  key?: string;
  value?: CanValueItem[];
  selectedValue?: any;
  keys?: string[];
  searchType?: "autocomplete" | "manual";
  download?: CanDownload;
  multipleSelect?: boolean;
  autoComplete?: {
    type: "local" | "api";
    api?: CanApi;
    autocompleteParamKeys?: Array<string>;
    apiDataKey?: string;
    apiValueKey?: string;
    apiViewValueKey?: string;
    viewValueSeparators?: Array<string>;
    autocompleteSearchText?: string;
    minCharacters?: number;
    freeTextSearch?: boolean;
    manualSelected?: boolean;
  };
  checkbox?: {
    activeValue: string;
    inActiveValue: string;
  };
  date?: {
    enabledTime: boolean;
    dateRange?: {
      minDate?: Date;
      maxDate?: Date;
      keys?: {
        from: string;
        to: string;
      };
    };
    enabledRange: boolean;
  };
}

// Table Bulk Action Interface
export interface CanBulkAction {
  type: "download";
  download: CanDownload;
  tooltip: string;
  label: string;
  permission?: CanPermission;
}

// Table Download Item Interface
export interface CanDownload {
  downloadType: "url" | "api";
  url?: string;
  extension: string;
  fileName?: string;
  api?: CanApi;
  requiredFilterKeys?: RequiredFilterKey[];
  apiDataKey?: string;
  params?: string[];
  blobType?: string;
  permission?: CanPermission;
}
type ParamValue = { key: string; value: string };

// Table Upload Item Interface
export interface CanUpload {
  api: CanApi;
  acceptType: string; //comma separated file extensions
  placeholder: string;
  label: string;
  confirm: CanConfirmDialog;
  payloadName: string;
  permission?: CanPermission;
}

// Table Field Action Button Interface
export interface CanFieldAction {
  action: CanAction;
  icon: CanIcon;
}

/**
 * Table Body Params Interface
 *
 * Use in case of Ajax Request in field action
 */
export interface CanBodyParams {
  key: string;
  value: any;
}

// Table Bulk Action Interface
export interface CanBulkFieldAction {
  label: string;
  keys: string[];
  requiredFilterKeys?: RequiredFilterKey[];
  dataKey?: string;
  api: CanApi;
  confirm: CanConfirmDialog;
  permission?: CanPermission;
}

type RequiredFilterKey = {
  key: string;
  transformedKey?: string;
};

/**
 * Use in Case of Table Config Validations
 */

//  Filter Property Validator Config
export const FilterPropertyBindings = {
  dropdown: ["value"],
  radio: ["value"],
  dateRange: ["dateRange"],
  text: ["searchType"],
  date: [],
  checkbox: ["checkbox"],
  download: [],
};

//  Field Action Button Validator Config
export const FieldActionPropertyBindings = {
  link: ["link"],
  modal: ["modal"],
  download: ["download"],
  function: [],
  ajax: ["api", "confirm"],
};
