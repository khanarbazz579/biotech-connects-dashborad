// Types
import { CanApi } from './api.type';
import {  CanValueItem, } from './shared.type';

// Dashboard Interface
export interface CanDashboard {
    header?: string;
    filters?: CanFilter[];
    api?: CanApi;
};

// /home/ankush/canProjects/can-frontend-boilerplate/src/@can/components

// Dashboard Filter Interface
export interface CanFilter {
    placeholder: string;
    type?: 'text' | 'dropdown' | 'checkbox' | 'radio' | 'date';
    filtertype: 'local' | 'api'
    key?: string;
    value?: CanValueItem[];
    selectedValue?: any;
    keys?: string[];
    searchType?: 'autocomplete' | 'manual';
    autoComplete?: {
      type: 'local' | 'api';
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
    }
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
        }
      },
      enabledRange: boolean;
    },
  }