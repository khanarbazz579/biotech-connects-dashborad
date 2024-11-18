// Types
import { CanPermission } from './permission.type'
import { CanDownload, CanBodyParams } from './table.type'
import { CanApi } from './api.type'
import { CanConfirmDialog } from './confirm-dialog.type'

// Document View and Download Interface
export interface CanDocument {
  document: {
    src: string;
    extension: string;
  };
}

export interface CanDocuments {
  showAll?: boolean;
  openType?: 'modal' | 'link';
  documentItems: CanDocumentItem[];
  linkType?: 'external' | 'self';
}

export interface CanDocumentItem {
  type: 'url' | 'api';
  url?: string;
  extension?: string;
  value?: string;
  isArray?: boolean;
  key?: string;
  showAll?: boolean;
  openType?: 'modal' | 'tab'
}

export interface CanImages {
  showAll?: boolean;
  openType?: 'modal' | 'link';
  imageItems: CanImageItem[];
  linkType?: 'external' | 'self';
}

// Image View and Download Interface 
export interface CanImageItem {
  type: 'url' | 'api';
  src?: string;
  value?: string;
  isArray?: boolean;
  key?: string;
  alt: string;
}

// Single Item Display in Table or Detail View Interface
export interface CanColumnItem {
  header?: string;
  type: 'text' | 'email' | 'boolean' | 'number' | 'currency' | 'date' | 'icon' | 'image' | 'document' | 'link' | 'group' | 'enum' | 'enum_icon' | 'api_group';
  value?: string;
  keySeparators?: Array<string>;
  boolean?: {
    trueValue: string;
    falseValue: string;
  };
  icon?: CanIcon;
  images?: CanImages;
  wordWrap?:boolean;
  modalWidth?: number
  documents?: CanDocuments;
  link?: {
    target: 'self' | 'external';
  };
  enumValues?: CanValueItem[];
  tooltip?: string;
  dateDisplayType?: string;
  enumIcons?: CanEnumIconItem[];
  color?: string;
  inlineImage?: CanImageItem;
}

// Dynamic Modal Interface
export interface CanModal {
  component: any;
  inputData: CanInputItem[];
  header?: string;
  footer?: CanModalFooter;
  width?: number;
  disableClose?: boolean;
}

export interface CanModalFooter {
  buttons?: Array<CanModalFooterButton>;
}

export interface CanModalFooterButton {
  text: string;
  position: 'right' | 'left';
  action: {
    type: 'link' | 'modal' | 'close';
    modal?: CanModal;
    link?: CanLink;
  };
  permission?: CanPermission;
}

// Dynamic URL Interface
export interface CanLink {
  url: string;
  target: 'self' | 'external';
  type: 'obj' | 'fetchKey' | 'url';
  value?: string;
}

// Form Field Input Item Interface
export interface CanInputItem {
  inputKey: string;
  type: 'fixed' | 'key';
  key?: string;
  value?: any;
}

// Icon Interface
export interface CanIcon {
  type?: CanIconType
  name: string
  tooltip?: string;
  color?: string
}

export enum CanIconType {
  Material = 1,
  Flaticon = 2
}

// Button Interface
export interface CanButton {
  type: 'basic' | 'raised' | 'stroked' | 'flat';
  label: string
  color: 'default' | 'primary' | 'accent' | 'warn';
  float?: 'right' | 'left';
}


/** 
 * Use in Case of Select & Autocomplete
 */
export interface CanValueItem {
  value: string | number | boolean;
  viewValue: string;
  color?: string;
  backgroundColor?: string;
}

export interface CanEnumIconItem {
  value: string | boolean;
  icon: CanIcon;
}

/**
 * Conditions Interface
 * 
 * Use in case of conditional validate
 * 
 * Single Condition Match
 */
export interface CanConditionConfig {
  type: 'single' | 'group';
  match?: { key?: string, value?: any, operator: 'equals' | 'notEquals' | 'empty' | 'notEmpty' };
  group?: CanGroupCondition;
}

/**
 * Group Conditions Interface
 * 
 * Use in case of conditional validate
 * 
 * Group Condition Match
 */
export interface CanGroupCondition {
  type: 'and' | 'or';
  values: CanConditionConfig[];
}

export interface CanAction {
  actionType: 'link' | 'modal' | 'download' | 'ajax' | 'function';
  modal?: CanModal;
  link?: CanLink;
  download?: CanDownload;
  bodyParams?: CanBodyParams[];
  api?: CanApi;
  confirm?: CanConfirmDialog;
  displayCondition?: CanConditionConfig;
  permission?: CanPermission;
  executableFunction?: () => Promise<boolean>;
}


/**
 * Validators Config
 */

//  Column Property Validator
export const ColumnPropertyBindings = {
  'text': ['value'],
  'email': ['value'],
  'boolean': ['value'],
  'number': ['value'],
  'currency': ['value'],
  'date': ['value'],
  'icon': ['icon'],
  'image': ['images'],
  'document': ['documents'],
  'link': ['link', 'value'],
  'group': ['group'],
  'enum': ['enumValues'],
  'enum_icon': ['enumIcons'],
  'api_group': ['apiGroup']
}

// Image Property Validator
export const ImagePropertyBindings = {
  'url': ['src'],
  'api': ['value']
}

// Document Property Validator
export const DocumentPropertyBindings = {
  'url': ['url'],
  'api': ['value']
}
