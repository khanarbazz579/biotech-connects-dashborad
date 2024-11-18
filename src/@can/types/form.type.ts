// Types
import { EventEmitter } from '@angular/core';
import { CanApi } from './api.type';
import { CanValueItem, CanButton, CanConditionConfig, CanIcon } from './shared.type';

// Form Interface
export interface CanForm {
    discriminator: 'formConfig';
    type: 'create' | 'edit';
    formFields: CanFormField[];
    refreshEvent?: EventEmitter<boolean>;
    formButton: CanButton;
    dataSource?: any;
    getApi?: CanApi;
    apiDataKey?: string;
    submitApi?: CanApi;
    columnPerRow: number;
    maxWidth?: number;
    header?: string;
    submitSuccessMessage?: string;
    sendAll?: boolean;
    doNothingOnFormSubmit?: boolean;
}

// Form Field Interface
export interface CanFormField {
    name: string;
    type: 'text' | 'number' | 'password' | 'radio' | 'checkbox' | 'multicheckbox' | 'select' | 'date' | 'time' | 'toggle' | 'rich-textarea' | 'autocomplete' | 'image' | 'document' | 'tags' | 'group' | 'textarea' | 'hidden' | 'array';
    formFields?: CanFormField[];
    disabled?: boolean;
    defaultValue?: any;
    value?: string;
    required?: CanBooleanValidation;
    placeholder: string;
    pattern?: CanStringValidation;
    checkbox?: {
        activeValue: string;
        inActiveValue: string;
    };
    values?: CanValueItem[];
    multipleSelect?: boolean;
    date?: {
        enabledTime?: boolean;
        dateRange?: {
            minDate?: Date;
            maxDate?: Date;
        },
        enabledRange?: boolean;
    },
    file?: {
        api: CanApi;
        apiKey: string;
        acceptType: string;  // comma separated extensions 
        multipleSelect: boolean;
        limit?: number;
        filePathKey?: string;
        formatImage?: {
            enableZoom?: boolean;
            aspectRatio?: number;
            modalWidth?: number;
            imageWidth: number;
        }
        payloadName?: string;

    }
    tags?: {
        type: 'default' | 'select';
    }
    columnPerRow?: number;
    select?: {
        type: 'api' | 'local' | 'relative';
        api?: CanApi;
        apiDataKey?: string;
        apiValueKey?: string;
        apiViewValueKey?: string;
        viewValueSeparators?: Array<string>;
        convertType?: 'string';
        relativeApiInfo?: {
            queryParams?: CanParamInfo[];
        };
        dataSource?: Array<object>;
    }
    autoComplete?: {
        type: 'local' | 'api';
        api?: CanApi;
        autocompleteParamKeys?: Array<string>;
        apiDataKey?: string;
        apiValueKey?: string;
        apiViewValueKey?: string;
        viewValueSeparators?: Array<string>;
        convertType?: 'string';
        dataSource?: Array<object>;
        autocompleteSearchText?: string;
        minCharacters?: number;
        params?: { key: string, formValue: string }[];

    }

    multiSelect?: {
        type: 'local' | 'api';
        api?: CanApi;
        autocompleteParamKeys?: Array<string>;
        apiDataKey?: string;
        apiValueKey?: string;
        apiViewValueKey?: string;
        viewValueSeparators?: Array<string>;
        convertType?: 'string';
        dataSource?: Array<object>;
        searchedList?:Array<object>;
        autocompleteSearchText?: string;
        minCharacters?: number;
        params?: { key: string, formValue: string }[];

    }
    relativeValidation?: CanRelativeValidation[];
    relatedTo?: Array<string>;
    send?: 'alwaysSend' | 'notSend' | 'sendOnModified';
    relativeSetFields?: Array<CanRelativeSetField>;
    hideFormFields?: CanHideFormFields;
    isHidden?: boolean;
    formArray?: {
        addButton?: CanButton;
        deleteButton?: CanButton;
        deleteLastElement?: boolean;
    },
    asyncValidation?: AsyncValidation;
    outline?: boolean;
    prefixIcon?: CanIcon;
    suffixIcon?: CanIcon;
    displayCondition?: CanConditionConfig;
    maxlength?:string;
}

// Form Field Validation Interface
export interface CanNumberValidation {
    value: number;
    errorMessage: string;
}

export interface CanStringValidation {
    value: string;
    errorMessage: string;
}

export interface CanBooleanValidation {
    value: boolean;
    errorMessage?: string;
}

export interface CanRelativeValidation {
    type: 'max' | 'min' | 'equals' | 'notEquals';
    key: string;
    errorMessage: string;
}

// Query Param Interface
export interface CanParamInfo {
    key: string;
    value: string;
    regex?: boolean;
}

/**
 * Relative Field Ineterface
 * 
 * Use in Case of Form Field Relation
 */
export interface CanRelativeSetField {
    key: string;
    value?: string;
    type: 'same' | 'different';
    differentType?: 'dataSource';
}

/**
 * Relative Field Hide Interface
 * 
 * Use in Case of Hide form Field on related Property
 */
export interface CanHideFormFields {
    keys: string[];
    value: any;
    operator: 'equals' | 'notEquals';
}

/**
 * Async Validation Interface
 */
export interface AsyncValidation {
    api: CanApi;
    apiDataKey?: string;
    condition: CanConditionConfig;
    minCharacters?: number;
    errorMessage: string;
    apiParamKey: string;
}