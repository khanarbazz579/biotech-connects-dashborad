import { CanFormStepper } from 'src/@can/types/form-stepper.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';
import { FormConfigValidator } from './form-config-validator';

/**
 * Shared Config Validator
 */
export class FormStepperConfigValidator {

    /**
     * 
     * @param columDef: CanColumnItem
     * 
     * Validate Column Item Config
     */
    public static validateFormStepperConfig(formStepperConfig: CanFormStepper): void {
        if (formStepperConfig.discriminator === 'formStepperConfig') {
            // Check api 
            if (formStepperConfig.type === 'edit' && !formStepperConfig.dataSource) {
                if(!formStepperConfig.getApi) {
                    CanHelper.throwErrorMessage('Get Api is required in form stepper config.');
                }
            }
            // Forms Config Validation
            formStepperConfig.steps.forEach(step => {
                FormConfigValidator.validateFormConfig(step.form);

                // Check form type 
                if (step.form.type !== formStepperConfig.type) {
                    CanHelper.throwErrorMessage('Form type should be same as form stepper type in form stepper config.');
                }
            });

        } else {
            CanHelper.throwErrorMessage('Invalid Form Stepper Config.');
        }

    }
}