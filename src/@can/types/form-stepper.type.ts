// Types
import { CanForm } from './form.type';
import { CanApi } from './api.type';
import { CanButton } from './shared.type';

// Form Stepper Interface
export interface CanFormStepper {
    discriminator: 'formStepperConfig';
    type: 'create' | 'edit';
    layout: CanFormStepperLayout;
    steps: CanFormStep[];
    submitOnEachStep?: boolean;
    backButton?: CanButton;
    submitApi: CanApi;
    firstTimeSubmitApi?: CanApi;
    getApi?: CanApi;
    dataSource?: object;
    apiDataKey?: string;
    horizontalLabelPosition?: 'bottom' | 'end';
    header?: string;
    id?: number;
    apiIdKey?: string;
}

// Setpper Layout Interface
export enum CanFormStepperLayout {
    Horizontal = 1,
    Vertical = 2
}

// Form Step Display Interface
export interface CanFormStep {
    form: CanForm;
    label: string;
}