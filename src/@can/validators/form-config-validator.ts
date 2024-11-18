// Types
import { CanForm, CanFormField } from 'src/@can/types/form.type';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

/**
 * Form Component Config Validator
 */
export class FormConfigValidator {

    /**
     * 
     * @param formConfig: CanFormModel
     * 
     * Validate Form Config
     */
    public static validateFormConfig(formConfig: CanForm): void {
        if (formConfig.discriminator === 'formConfig') {
            // Form Field Validation
            if (formConfig.formFields && formConfig.formFields.length) {
                // Check key is unique in formFields
                this.validateUniqueFormFields(formConfig.formFields);
                this.validateFormFields(formConfig.formFields);
            } else {
                CanHelper.throwErrorMessage('Empty or invalid formFields in formConfig')
            }
        } else {
            CanHelper.throwErrorMessage('Invalid Form Config.');
        }

    }

    /**
     * 
     * @param formFields: CanFormField[]
     * 
     * Validate Form Fields Config
     */
    private static validateFormFields(formFields: CanFormField[]): void {
        // Validate each form field
        formFields.forEach(formField => {
            this.validateFormFieldConfig(formField);
            if (formField.type === 'group' || formField.type === 'array') {
                if (formField.formFields && formField.formFields.length) {
                    // Check key is unique in formFields
                    this.validateFormFields(formField.formFields);
                } else {
                    CanHelper.throwErrorMessage('Empty or invalid formFields in Form field type group or array')
                }
            }
        });
    }

    /**
     * 
     * @param formField: CanFormField
     * 
     * Validate Each Form Field Config
     */
    private static validateFormFieldConfig(formField: CanFormField): void {
        switch (formField.type) {
            case 'document':
            case 'image':
                if (!formField.file) {
                    CanHelper.throwErrorMessage('file is required in formField for type ' + formField.type);
                }
                break;

            case 'tags':
                if (!formField.tags) {
                    CanHelper.throwErrorMessage('tags is required in formField for type tags');
                }
                break;

            default:
                break;
        }
    }


    /**
     * 
     * @param formFields: CanFormField[]
     * 
     * Validate Form Field Name Uniqueness
     */
    private static validateUniqueFormFields(formFields: CanFormField[]): void {
        const fields = [];
        formFields.forEach(formField => {
            if (fields.findIndex(each => each === formField.name) > -1) {
                CanHelper.throwErrorMessage('FormFields key should be unique. Multiple formFields found with key ' + formField.name)
            } else {
                fields.push(formField.name);
            }
            if (formField.type === 'group' || formField.type === 'array') {
                if (formField.formFields && formField.formFields.length) {
                    // Check key is unique in formFields
                    this.validateUniqueFormFields(formField.formFields);
                } else {
                    CanHelper.throwErrorMessage('Empty or invalid formFields in Form field type group or array')
                }
            }
        });
    }
}