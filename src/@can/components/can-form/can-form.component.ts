import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  CanForm,
  CanFormField,
  CanRelativeValidation,
  CanHideFormFields,
} from "src/@can/types/form.type";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { QuillToolbarOptions } from "src/@can/utils/quill-config.util";
import { HttpParams } from "@angular/common/http";
import { CanApiService } from "src/@can/services/api/api.service";
import { CanHelper } from "src/@can/utils/helper.util";
import * as _ from "underscore";
import { MatChipInputEvent, MatDialog } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CanApi, ApiType } from "src/@can/types/api.type";
import { CanAutoUnsubscribe } from "src/@can/decorators/auto-unsubscribe";
import { Subscription } from "rxjs";
import { FormConfigValidator } from "src/@can/validators/form-config-validator";
import { CanNotificationService } from "src/@can/services/notification/notification.service";
import {
  CanValueItem,
  CanButton,
  CanConditionConfig,
} from "src/@can/types/shared.type";
import { CanConditionValidationService } from "src/@can/services/condition-validation/condition-validation.service";
import { CanImageFormatterComponent } from "../can-image-formatter/can-image-formatter.component";
import { isArray } from "highcharts";

@Component({
  selector: "can-form",
  templateUrl: "./can-form.component.html",
  styleUrls: ["./can-form.component.scss"],
})
// Unsubscribe all subscriptions on ngOnDestroy
@CanAutoUnsubscribe
export class CanFormComponent implements OnInit {
  // Form Config
  @Input() formConfig: CanForm;

  // Stepper Form
  @Input() stepperForm: boolean;

  // Stepper Form
  @Input() backButton: CanButton;

  // Before Submit Form value event to parent
  @Output() beforeSubmitFormValue = new EventEmitter<any>(true);

  // Before Value changes event to parent
   @Output() formValueChanges = new EventEmitter<any>(true);

  // Form submitted event to parent
  @Output() formSubmitted = new EventEmitter<any>(true);
  
   // Do nothing on form submitted event 
   @Output() doNothingOnFormSubmit = new EventEmitter<any>(null);

  // Back button event to parent
  @Output() backButtonClick = new EventEmitter<any>(true);

  // Form submitted api response to parent
  @Output() getData = new EventEmitter<any>(true);

  // Underscore package
  public _ = _;

  // FormGroup
  public form: FormGroup;

  // FormFields
  public formFields: CanFormField[];
  // FormButton
  public formButton: CanButton;
  // Loader
  public isLoad: boolean;
  // Data soure from api/local
  public dataSource: any;
  // Display no. of columns as per row
  public columnPerRow: number;
  // Header Name
  public header: string;
  // Display submit button
  public disableSubmitButton = false;

  // Rich text editor options
  public quillToolbarOptions = QuillToolbarOptions;

  // Tag keys to create
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Subscription
  private formSubscription: Subscription;
  private selectSubscription: Subscription;
  private autoCompleteSubscription: Subscription;
  private uploadSubscription: Subscription;
  private submitFormSubscription: Subscription;
  private asyncValidateSubscription: Subscription;

  constructor(
    private apiService: CanApiService,
    private notificationService: CanNotificationService,
    private conditionValidationService: CanConditionValidationService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    // Validate Form Config
    FormConfigValidator.validateFormConfig(this.formConfig);
    // Defining form fields
    this.formFields = this.formConfig.formFields;
    // Defining form buttons
    this.formButton = this.formConfig.formButton;
    // Defining Header Name
    this.header = this.formConfig.header;
    // Defining Field Per Row
    this.columnPerRow = this.formConfig.columnPerRow || 1;

    // Refresh Table Event 
    if (this.formConfig.refreshEvent) {
      this.formConfig.refreshEvent.subscribe(event => {
        if (event) {
          // Refresh Form Data
          this.disableSubmitButton = false
          //  // Configure Form
          // this.form = this.configureForm(this.formFields);
          // // Check values for select field and get in case of api
          // this.checkValuesForSelectFields(this.formFields);
          // // Set value for autocomplete
          // this.setDefaultForAutocomplete(this.formFields);
        }
      })
    }
    // Check for form type
    if (this.formConfig.type === "create") {
      // Configure Form
      this.form = this.configureForm(this.formFields);
      // Check values for select field and get in case of api
      this.checkValuesForSelectFields(this.formFields);
      // Set value for autocomplete
      this.setDefaultForAutocomplete(this.formFields);
    } else {
      // Process Form Data In case of edit form
      this.processFormData().then((res) => {
        // Setting value to form
        this.formFields.forEach((formField: CanFormField) => {
          this.setDefaultValue(formField);
        });
        // Configure Form
        this.form = this.configureForm(this.formFields);
        // Check values for select field and get in case of api
        this.checkValuesForSelectFields(this.formFields);
        // Set value for autocomplete
        this.setDefaultForAutocomplete(this.formFields);
      });
    }
  }

  /**
   * Process Form Data
   */
  private processFormData(): Promise<boolean> {
    return new Promise((resolve) => {
      // Page Loader Start
      this.isLoad = true;
      // Checking Default Data Source Existence
      if (this.formConfig.dataSource) {
        // Assigning data
        this.dataSource = this.formConfig.dataSource;
        // Page Loader Stop
        this.isLoad = false;
        // Resolving Promise
        resolve(true);
      } else {
        // If No Default Data Source Then Call API
        // Api Call
        this.formSubscription = this.apiService
          .request(this.formConfig.getApi)
          .subscribe(
            (res) => {
              // Assigning data
              this.dataSource = CanHelper.mapValueWithApiKey(
                res,
                this.formConfig.apiDataKey
              );
              // Page Loader Stop
              this.isLoad = false;
              // Resolving Promise
              resolve(true);
            },
            (err) => {
              // Remove Loader
              this.isLoad = false;
              resolve(true);
            }
          );
      }
    });
  }

  /**
   *
   * @param formField : FormField
   * Set default value in case of edit
   */
  private setDefaultValue(formField: CanFormField) {
    // Checking value
    if (formField.value && formField.type != "number") {
      // Setting value
      formField.defaultValue = CanHelper.isEmpty(
        CanHelper.mapValueWithApiKey(this.dataSource, formField.value)
      )
        ? undefined
        : CanHelper.mapValueWithApiKey(this.dataSource, formField.value);
    }
    if (formField.value && formField.type === "number") {
      // Setting value
      formField.defaultValue = CanHelper.isEmpty(
        CanHelper.mapValueWithApiKey(this.dataSource, formField.value)
      )
        ? undefined
        : parseFloat(
            CanHelper.mapValueWithApiKey(
              this.dataSource,
              formField.value
            ).toString()
          );
    }
    // Check for group
    if (formField.type === "group") {
      // loop formfields and set value
      formField.formFields.forEach((groupField: CanFormField) => {
        this.setDefaultValue(groupField);
      });
    }
  }

  /**
   *
   * @param formFields :FormField[]
   * Check whether select fields has values from api
   */
  private checkValuesForSelectFields(formFields: CanFormField[]) {
    formFields.forEach(async (formField) => {
      // Checking form field type
      if (formField.type === "group" || formField.type === "array") {
        // Check values for select field in group and get in case of api
        this.checkValuesForSelectFields(formField.formFields);
      } else if (
        formField.type === "select" ||
        (formField.type === "tags" && formField.tags.type === "select")
      ) {
        // Check for select type
        if (formField.select && formField.select.type === "api") {
          // Init values
          formField.values = [];
          // Set values
          await this.setValuesForSelectFields(formField);
          // Check for related fields
          if (formField.relatedTo && formField.relatedTo.length) {
            // Set related fields values
            this.getRelatedFieldsData(formField);
          }
        }
      }
    });
  }

  /**
   *
   * @param formFields :CanFormField[]
   */
  private setDefaultForAutocomplete(formFields: CanFormField[]) {
    formFields.forEach(async (formField) => {
      // Checking form field type
      if (formField.type === "group" || formField.type === "array") {
        // Check values for select field in group and get in case of api
        this.setDefaultForAutocomplete(formField.formFields);
      } else if (formField.type === "autocomplete") {
        // Check for select type
        if (formField.autoComplete && formField.defaultValue) {
          if (formField.autoComplete.type === "local") {
            if (formField.values) {
              const index = formField.values.findIndex(
                (each) => each.value === formField.defaultValue
              );
              if (index > -1) {
                formField.autoComplete.autocompleteSearchText =
                  formField.values[index].viewValue;
              }
            }
          } else if (formField.autoComplete.type === "api") {
            formField.autoComplete.api.params = new HttpParams();
            const api: CanApi = Object.assign({}, formField.autoComplete.api);
            if (!api.params) {
              api.params = new HttpParams();
            }
            // if(!isNaN(formField.defaultValue)){
            //   api.params = api.params.append(
            //     formField.autoComplete.apiValueKey,
            //     formField.defaultValue
            //   );
            // }else{
              if(isNaN(formField.defaultValue) && formField.defaultValue.split(' ').length > 1 ){
                const val = {}
                val[formField.autoComplete.apiValueKey] = {
                  ilike: "%" + formField.defaultValue + "%"
                }
                api.params = api.params.append(
                  'or',
                  JSON.stringify([val]),
                  );
              }else{
                // formField.defaultValue
                api.params = api.params.append(
                  formField.autoComplete.apiValueKey,
                  formField.defaultValue
                );
            // }
              }
            this.apiService.request(api).subscribe((res) => {
              const data = CanHelper.mapValueWithApiKey(
                res,
                formField.autoComplete.apiDataKey
              );
              formField.autoComplete.dataSource = data;
              if (_.isArray(data)) {
                // Set value
                formField.autoComplete.autocompleteSearchText = CanHelper.getValueWithApiKey(
                  data[0],
                  formField.autoComplete.apiViewValueKey,
                  formField.autoComplete.viewValueSeparators
                );
              }
            });
          }
        }
      }
    });
  }

  /**
   *
   * @param formField : FormField
   * Set values in case of api in select fields
   */
  private setValuesForSelectFields(formField: CanFormField) {
    return new Promise((resolve,reject) => {
      // Check for api
      if (formField.select.api) {
        // Api request
        this.selectSubscription = this.apiService
          .request(formField.select.api)
          .subscribe((res) => {
            // Get data using key
            const data = CanHelper.mapValueWithApiKey(
              res,
              formField.select.apiDataKey
            );
            // Check whether data is array or not
            if (_.isArray(data)) {
              // Assign dataSource
              formField.select.dataSource = data;
              // Loop data
              data.forEach((element) => {
                // If convertType is string, convert value to string
                const value =
                  formField.select.convertType === "string"
                    ? CanHelper.mapValueWithApiKey(
                        element,
                        formField.select.apiValueKey
                      ).toString()
                    : CanHelper.mapValueWithApiKey(
                        element,
                        formField.select.apiValueKey
                      );
                // Add object to values
                formField.values.push({
                  value: value,
                  viewValue: this.getValueWithApiKey(
                    element,
                    formField.select.apiViewValueKey,
                    formField.select.viewValueSeparators
                  ),
                });
              });
            }
            resolve(null);
          });
      } else {
        resolve(null);
      }
    });
  }

  /**
   *
   * @param formFields :CanFormField[]
   * Create Formgroup
   */
  private configureForm(formFields: CanFormField[]) {
    // Initialize group
    let group: any = {};
    // Loop form fields
    formFields.forEach((element) => {
      // Check for type
      if (element.type === "group") {
        // Configure nested form
        group[element.name] = this.configureForm(element.formFields);
        if (element.defaultValue) {
          group[element.name].patchValue(element.defaultValue);
        }
      } else if (element.type === "array") {
        // Check for default value
        if (element.defaultValue && _.isArray(element.defaultValue)) {
          // Init formarray
          const formArray = new FormArray([]) as FormArray;
          // Loop on values
          element.defaultValue.forEach((each) => {
            formArray.push(this.configureForm(element.formFields));
          });
          // Assign formarray to group
          group[element.name] = formArray;
          // Assign default value
          group[element.name].patchValue(element.defaultValue);
        } else {
          // Assign formarray to group
          group[element.name] = new FormArray([
            this.configureForm(element.formFields),
          ]);
        }
      } else {
        // Initialize validations
        const validators = this.setValidators(element);
        // Async validator
        let asyncValidators = [];
        if (element.type === "text") {
          if (element.asyncValidation) {
            asyncValidators.push(this.asyncValidator.bind(this, element));
          }
        }

        // Create Form controls for each form field
        group[element.name] = new FormControl(
          { value: element.defaultValue, disabled: element.disabled },
          validators,
          asyncValidators
        );
      }
      // Hide or show keys on basis of value
      this.hideFormFields(element.hideFormFields, element.defaultValue);
    });
    return new FormGroup(group);
  }

  /**
   *
   * @param formField :CanFormField
   * Add validation to field
   */
  private setValidators(formField: CanFormField) {
    // Init validators
    const validators = [];
    // If value is required, add required validation to array
    if (formField.required && formField.required.value) {
      validators.push(Validators.required);
    }
    // If there is pattern, add pattern validation to array
    if (
      formField.type === "text" ||
      formField.type === "number" ||
      formField.type === "password"
    ) {
      if (formField.pattern) {
        validators.push(Validators.pattern(formField.pattern.value));
      }
    }
    // Check for relative validation
    if (formField.relativeValidation) {
      // Loop relativeValidation
      formField.relativeValidation.forEach((eachField) => {
        // Check for type
        switch (eachField.type) {
          case "min":
            // Add relativeMinValidator to array
            validators.push(
              this.relativeMinValidator.bind(this, eachField, formField)
            );
            break;
          case "max":
            // Add relativeMaxValidator to array
            validators.push(
              this.relativeMaxValidator.bind(this, eachField, formField)
            );
            break;
          case "equals":
            // Add relativeEqualValidator to array
            validators.push(
              this.relativeEqualsValidator.bind(this, eachField, formField)
            );
            break;
          case "notEquals":
            // Add relativeEqualValidator to array
            validators.push(
              this.relativeNotEqualsValidator.bind(this, eachField, formField)
            );
            break;
        }
      });
    }
    return validators;
  }

  /**
   *
   * @param validation :CanRelativeValidation
   * @param control :FormControl
   * Compare values and return result
   */
  private relativeMinValidator(
    validation: CanRelativeValidation,
    formField: CanFormField,
    control: FormControl
  ) {
    // Check for form existence
    if (this.form) {
      const value = CanHelper.mapValueWithApiKey(
        this.form.getRawValue(),
        validation.key
      );
      if (value && control.value) {
        if (formField.type === "date") {
          if (
            _.isNumber(Date.parse(value)) &&
            _.isNumber(Date.parse(control.value)) &&
            new Date(value) > new Date(control.value)
          ) {
            return { relativeMin: validation.errorMessage };
          }
        } else {
          if (value > control.value) {
            return { relativeMin: validation.errorMessage };
          }
        }
      }
    }
    return null;
  }

  /**
   *
   * @param validation :CanRelativeValidation
   * @param control :FormControl
   * Compare values and return result
   */
  private relativeMaxValidator(
    validation: CanRelativeValidation,
    formField: CanFormField,
    control: FormControl
  ) {
    // Check for form existence
    if (this.form) {
      const value = CanHelper.mapValueWithApiKey(
        this.form.getRawValue(),
        validation.key
      );
      if (value && control.value) {
        if (formField.type === "date") {
          if (
            _.isNumber(Date.parse(value)) &&
            _.isNumber(Date.parse(control.value)) &&
            new Date(value) < new Date(control.value)
          ) {
            return { relativeMax: validation.errorMessage };
          }
        } else {
          if (value < control.value) {
            return { relativeMax: validation.errorMessage };
          }
        }
      }
    }
    return null;
  }

  /**
   *
   * @param validation :CanRelativeValidation
   * @param control :FormControl
   * Compare values and return result
   */
  private relativeEqualsValidator(
    validation: CanRelativeValidation,
    formField: CanFormField,
    control: FormControl
  ) {
    // Check for form existence
    if (this.form) {
      const value = CanHelper.mapValueWithApiKey(
        this.form.getRawValue(),
        validation.key
      );
      if (value !== control.value) {
        return { relativeEqual: validation.errorMessage };
      }
    }
    return null;
  }

  /**
   *
   * @param validation :CanRelativeValidation
   * @param control :FormControl
   * Compare values and return result
   */
  private relativeNotEqualsValidator(
    validation: CanRelativeValidation,
    formField: CanFormField,
    control: FormControl
  ) {
    // Check for form existence
    if (this.form) {
      const value = CanHelper.mapValueWithApiKey(
        this.form.getRawValue(),
        validation.key
      );
      if (value && control.value && value === control.value) {
        return { relativeNotEqual: validation.errorMessage };
      }
    }
    return null;
  }

  /**
   *
   * @param formField :CanFormField
   * @param control :FormControl
   */
  private asyncValidator(formField: CanFormField, control: FormControl) {
    return new Promise((resolve) => {
      // Check for asyncValidateSubscription
      // if (this.asyncValidateSubscription) {
      //   this.asyncValidateSubscription.unsubscribe();
      // }
      // Check for form
      if (this.form) {
        formField.asyncValidation.minCharacters =
          formField.asyncValidation.minCharacters || 1;

        if (
          control.value &&
          control.value.trim() &&
          control.value.length >= formField.asyncValidation.minCharacters
        ) {
          if (!formField.asyncValidation.api.params) {
            formField.asyncValidation.api.params = new HttpParams();
          }
          formField.asyncValidation.api.params = formField.asyncValidation.api.params.set(
            formField.asyncValidation.apiParamKey,
            control.value
          );
          this.asyncValidateSubscription = this.apiService
            .request(formField.asyncValidation.api)
            .subscribe(
              (res) => {
                const data = CanHelper.mapValueWithApiKey(
                  res,
                  formField.asyncValidation.apiDataKey
                );
                if (
                  !this.conditionValidationService.validate(
                    formField.asyncValidation.condition,
                    data
                  )
                ) {
                  resolve({
                    asyncValidationError:
                      formField.asyncValidation.errorMessage,
                  });
                } else {
                  resolve(null);
                }
              },
              (err) => {
                resolve(null);
              }
            );
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }

  /**
   *
   * @param control :AbstractControl
   * Validate every field after any change
   */
  private validateAllFields(control: AbstractControl) {
    // Check control type is Formgroup or not
    if (control instanceof FormGroup) {
      // Def Formgroup
      const group = control as FormGroup;
      // Loop on formcontrols in formgroup
      for (const field in group.controls) {
        // Def control
        const c = group.controls[field];
        // Recursive call
        this.validateAllFields(c);
      }
    } else {
      // Validate control
      control.updateValueAndValidity({ onlySelf: false });
    }
  }

  /**
   *
   * @param event :Event
   * @param control :CanFormField
   * @param spinner
   * @param input
   * @param form :FormGroup
   * Upload File and add res file path to form value
   */
  public upload(
    event: any,
    control: CanFormField,
    spinner: any,
    input: any,
    form: FormGroup
  ) {
    if (event.target.files && event.target.files.length) {
      // Check for spinner
      if (spinner) {
        // Visible spinner
        spinner._elementRef.nativeElement.style.display = "block";
      }

      if (
        control.type === "image" &&
        !control.file.multipleSelect &&
        control.file.formatImage
      ) {
        const dialogRef = this.dialog.open(CanImageFormatterComponent, {
          data: { event: event, file: event.target.files[0], control: control },
          width: control.file.formatImage.modalWidth
            ? control.file.formatImage.modalWidth + "px"
            : "600px",
          maxHeight: "90vh",
          disableClose: true,
          panelClass: "image-modal",
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            form.controls[control.name].setValue(
              CanHelper.mapValueWithApiKey(dialogResult, control.file.apiKey)
            );
            // Form Value Change
            this.formValueChange(control, form);
          }
          if (spinner) {
            // Hide spinner
            spinner._elementRef.nativeElement.style.display = "none";
          }
          // clear input
          input.clear();
        });
      } else {
        // initialze form data
        const formData: FormData = new FormData();
        // Loop over Files
        for (let i = 0; i < event.target.files.length; i++) {
          // file def's
          const file = event.target.files[i];
          // add file to formdata
          formData.append(control.file.payloadName, file, file.name);
        }
        // clear input
        input.clear();
        // call the api
        this.uploadSubscription = this.apiService
          .request(control.file.api, formData)
          .subscribe(
            (res) => {
              if (control.file.multipleSelect) {
                // Check whether the value is array or not
                if (!_.isArray(form.controls[control.name].value)) {
                  form.controls[control.name].setValue([]);
                }
                // Get image paths
                const files = CanHelper.mapValueWithApiKey(
                  res,
                  control.file.apiKey
                );
                if(!isArray(files)){
                  form.controls[control.name].value.push(files);
                }else{

                  for (let each of files) {
                    // Add image paths to form control value
                    // form.controls[control.name].value.push(each);
                    form.controls[control.name].value.push(each[control.file.filePathKey]);
                    // Check for limit
                    if (
                      control.file.limit &&
                      form.controls[control.name].value &&
                      form.controls[control.name].value.length ===
                        control.file.limit
                    ) {
                      break;
                    }
                  }
                }
              } else {
                form.controls[control.name].setValue(
                  CanHelper.mapValueWithApiKey(res, control.file.apiKey)
                );
              }
              // Form Value Change
              this.formValueChange(control, form);
              // Check for spinner
              if (spinner) {
                // Hide spinner
                spinner._elementRef.nativeElement.style.display = "none";
              }
            },
            (err) => {
              // Check for spinner
              if (spinner) {
                // Hide spinner
                spinner._elementRef.nativeElement.style.display = "none";
              }
            }
          );
      }
    }
  }

  /**
   *
   * @param key : string
   * @param index : number
   *
   * Remove image or doc from form value
   */
  public removeFile(
    event: any,
    control: CanFormField,
    index: number,
    form: FormGroup
  ) {
    event.stopPropagation();
    form.controls[control.name].value.splice(index, 1);
  }

  /**
   *
   * @param event :MatChipInputEvent
   * @param key :string
   * @param form :FormGroup
   * Add tag to form control
   */
  public addTags(
    event: MatChipInputEvent,
    control: CanFormField,
    form: FormGroup
  ): void {
    const input = event.input;
    const value = event.value;

    // Add tag
    if ((value || "").trim()) {
      // If array then push the new value
      if (_.isArray(form.controls[control.name].value)) {
        form.controls[control.name].value.push(value);
        // Else create new array with value
      } else {
        form.controls[control.name].setValue([value]);
      }
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  /**
   *
   * @param value
   * @param control :CanFormField
   * @param input
   * @param form :FormGroup
   * Add tag to form control from autocomplete
   */
  public addTagsFromAutocomplete(
    value: any,
    control: CanFormField,
    input: any,
    form: FormGroup
  ) {
    // If array then push the new value
    if (_.isArray(form.controls[control.name].value)) {
      form.controls[control.name].value.push(value);
      // Else create new array with value
    } else {
      form.controls[control.name].setValue([value]);
    }
    // Reset the input value
    input.value = "";
  }

  /**
   *
   * @param key : any
   * @param values :CanValueItem[]
   * Return Value to be displayed as tag
   */
  public getDisplayValueForTags(key: any, values: CanValueItem[]) {
    // Check for values
    if (values && values.length) {
      // Find value index
      const index = values.findIndex((val) => val.value === key);
      // If value present
      if (index > -1) {
        // Return display value
        return values[index].viewValue;
      }
    }
    return undefined;
  }

  /**
   *
   * @param options :CanValueItem[]
   * @param selectedValues :Array<any>
   * Filter values that are not selected
   */
  public getDisplayOptionsForTags(
    options: CanValueItem[],
    selectedValues: Array<any>
  ) {
    return options.filter((option) => {
      // Check for selectedValues
      if (selectedValues && selectedValues.length) {
        // Find index in selectedValues
        const index = selectedValues.findIndex((each) => each === option.value);
        // If value is selected then remove from array
        if (index > -1) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   *
   * @param formField :CanFormField
   * Emit when form value changes
   */
  public formValueChange(formField: CanFormField, form: FormGroup): void {
    // Emit Before Submit Event to Parent
    this.beforeSubmitFormValue.emit(form.value);
    this.formValueChanges.emit(this.form.value);
    // Set Form Dirty;
    this.setFormDirty(form);
    // Set value change in form control
    this.setFormControlDirty(formField, form);
    // change Relative Values that are affected by this field
    this.changeRelativeValues(formField, form);
    // Validate all fields on any change
    this.validateAllFields(this.form);
    // Hide or show keys on basis of value
    this.hideFormFields(
      formField.hideFormFields,
      form.controls[formField.name].value
    );
  }

  /**
   *
   * @param formField: CanFormField
   * @param form: FormGroup
   */
  private changeRelativeValues(formField: CanFormField, form: FormGroup) {
    // Check for relative Set Value fields
    if (formField.relativeSetFields && formField.relativeSetFields.length) {
      formField.relativeSetFields.forEach((element) => {
        // Check type
        if (element.type === "same") {
          // Set same field value to them
          const value = CanHelper.isEmpty(
            CanHelper.mapValueWithApiKey(form.getRawValue(), formField.name)
          )
            ? undefined
            : CanHelper.mapValueWithApiKey(form.getRawValue(), formField.name);
          this.setFormFieldValue(element.key, value, form);
        } else if (element.type === "different") {
          // Check differentType
          if (element.differentType === "dataSource") {
            // Check for datasource
            if (
              formField.type === "select" &&
              formField.select &&
              formField.select.dataSource
            ) {
              const data = this.getObjectFromArray(
                formField.select.dataSource,
                formField.select.apiValueKey,
                form.controls[formField.name].value
              );
              const value = CanHelper.isEmpty(
                CanHelper.mapValueWithApiKey(data, element.value)
              )
                ? undefined
                : CanHelper.mapValueWithApiKey(data, element.value);
              this.setFormFieldValue(element.key, value, form);
            } else if (
              formField.type === "autocomplete" &&
              formField.autoComplete &&
              formField.autoComplete.dataSource
            ) {
              const data = this.getObjectFromArray(
                formField.autoComplete.dataSource,
                formField.autoComplete.apiValueKey,
                form.controls[formField.name].value
              );
              const value = CanHelper.isEmpty(
                CanHelper.mapValueWithApiKey(data, element.value)
              )
                ? undefined
                : CanHelper.mapValueWithApiKey(data, element.value);
              this.setFormFieldValue(element.key, value, form);
            }

            // Remove value
            if (formField.select && !formField.select.dataSource) {
              this.setFormFieldValue(element.key, undefined, form);
            }
          }
        }
      });
    }
    // Check for related fields
    if (formField.relatedTo && formField.relatedTo.length) {
      // Set related fields values
      this.getRelatedFieldsData(formField);
    }
  }

  /**
   *
   * @param formField :CanFormField
   * Set Related Fields Values
   */
  private getRelatedFieldsData(formField: CanFormField) {
    // Loop relatedTo keys
    formField.relatedTo.forEach((element) => {
      // Get related field
      const relatedField = this.getRelativeFormField(element);
      // Check for relatedField
      if (relatedField) {
        // Check for type
        if (
          relatedField.type === "select" ||
          (relatedField.type === "tags" && relatedField.tags.type === "select")
        ) {
          // Check for select type 'relative
          if (relatedField.select && relatedField.select.type === "relative") {
            // Init emptyVariables
            let emptyVariables = false;
            // To remove instance of object
            const api: CanApi = Object.assign({}, relatedField.select.api);
            // Get variables from url
            const variables = CanHelper.getVariablesFromUrl(api.apiPath);
            // Replace each variable with value
            for (const variable of variables) {
              const value = CanHelper.mapValueWithApiKey(
                this.form.getRawValue(),
                variable
              );
              // If value is not empty, set value
              if (!CanHelper.isEmpty(value)) {
                api.apiPath = api.apiPath.replace("${" + variable + "}", value);
              } else {
                // Else, set emptyVariables to true and break loop
                emptyVariables = true;
                break;
              }
            }
            // Check for emptyVariables
            if (!emptyVariables) {
              // Check for query params
              const queryParams =
                relatedField.select.relativeApiInfo &&
                relatedField.select.relativeApiInfo.queryParams
                  ? relatedField.select.relativeApiInfo.queryParams
                  : undefined;
              if (queryParams && queryParams.length) {
                // Check for api params
                if (!api.params) {
                  // Init params
                  api.params = new HttpParams();
                }
                for (const eachParam of queryParams) {
                  // Get Param Value
                  const value = CanHelper.mapValueWithApiKey(
                    this.form.getRawValue(),
                    eachParam.value
                  );
                  // If value is not empty, set value
                  if (!CanHelper.isEmpty(value)) {
                    if (eachParam.regex) {
                      api.params = api.params.set(
                        eachParam.key,
                        JSON.stringify({ ilike: "%" + value + "%" })
                      );
                    } else {
                      api.params = api.params.set(eachParam.key, value);
                    }
                  } else {
                    // Else, set emptyVariables to true and break loop
                    emptyVariables = true;
                    break;
                  }
                }
              }
              // If there is no empty variables
              if (!emptyVariables) {
                // Init related field values
                relatedField.values = [];
                // Api request
                this.selectSubscription = this.apiService
                  .request(api)
                  .subscribe((res) => {
                    // get data
                    const data = CanHelper.mapValueWithApiKey(
                      res,
                      relatedField.select.apiDataKey
                    );
                    // Check whether data is array or not
                    if (_.isArray(data)) {
                      // Assign dataSource
                      formField.select.dataSource = data;
                      data.forEach((element) => {
                        // Check for convert type 'string'. If yes, then convert it to string.
                        const value =
                          relatedField.select.convertType === "string"
                            ? CanHelper.mapValueWithApiKey(
                                element,
                                relatedField.select.apiValueKey
                              ).toString()
                            : CanHelper.mapValueWithApiKey(
                                element,
                                relatedField.select.apiValueKey
                              );
                        // Push object to values
                        relatedField.values.push({
                          value: value,
                          viewValue: this.getValueWithApiKey(
                            element,
                            relatedField.select.apiViewValueKey,
                            relatedField.select.viewValueSeparators
                          ),
                        });
                      });
                    }
                  });
              }
            }
          }
        }
      }
    });
  }

  /**
   *
   * @param name : string
   * Get Relative Form Field
   */
  private getRelativeFormField(name: string) {
    // Return false in case of empty
    if (CanHelper.isEmpty(name)) {
      return false;
    }
    // Storing the nested key in array
    const keys = name.split(".");
    // Def FormField
    let formField: CanFormField;
    // Find Index
    const index = this.formFields.findIndex((each) => each.name === keys[0]);
    // If found
    if (index > -1) {
      // Assign value
      formField = this.formFields[index];
      // Check for keys length
      if (keys.length === 1) {
        // Return formfield
        return formField;
      } else {
        // Nested Object
        // Loop keys from index 1 as 0 is already assigned
        for (let i = 1; i < keys.length; i++) {
          // Check for formField type 'group'
          if (formField.type === "group") {
            // Find index in group form fields
            const groupFieldIndex = formField.formFields.findIndex(
              (each) => each.name === keys[i]
            );
            // If found
            if (groupFieldIndex > -1) {
              // Set that form field
              formField = formField.formFields[groupFieldIndex];
            } else {
              // Return in case of not found
              return false;
            }
          } else {
            // Return in case of not found
            return false;
          }
        }
        // Check the formField type, if it is 'group', then return false
        if (formField.type !== "group") {
          return formField;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  /**
   *
   * @param name : string
   * Set Relative Form Field Value
   */
  private setFormFieldValue(name: string, value: any, form: FormGroup) {
    // Return false in case of empty
    if (!name) {
      return false;
    }
    // Storing the nested key in array
    const keys = name.split(".");
    // Check whether key is in present in form controls
    if (keys[0] in form.controls) {
      // Check key length
      if (keys.length === 1) {
        // Set value
        form.controls[keys[0]].setValue(value);
        form.controls[keys[0]].markAsDirty();
      } else {
        let fg;
        // Init form
        fg = form.controls[keys[0]];
        // Loop keys
        for (let i = 1; i < keys.length; i++) {
          // Check for controls and keys
          if ("controls" in fg && keys[i] in fg.controls) {
            // Check for last index
            if (i === keys.length - 1) {
              // Set value
              fg.controls[keys[i]].setValue(value);
              form.controls[keys[0]].markAsDirty();
            } else {
              // Set form
              fg = fg.controls[keys[i]];
            }
          } else {
            return false;
          }
        }
      }
    } else {
      return false;
    }
  }

  /**
   * Submit Form
   */
  public submitForm(): void {
    if (this.form.valid) {
      // Disable Submit Button
      this.disableSubmitButton = true;
      let valuesObj;
      if (this.formConfig.sendAll) {
        valuesObj = Object.assign({}, this.form.getRawValue());
      } else {
        valuesObj = this.getAllEditedValues(this.form);
      }
      // Remove values that are not required to send
      this.removeNotIncludedValues(this.formFields, valuesObj, this.form);
      // Check for stepper form
      if (this.stepperForm) {
        this.getData.emit(valuesObj);
      } else {
        if (!CanHelper.isEmpty(valuesObj)) {
          if (this.formConfig.doNothingOnFormSubmit) {
            this.doNothingOnFormSubmit.emit(valuesObj);
            this.isLoad = false;
          } else{
          // Start Loader
          this.isLoad = true;
          this.submitFormSubscription = this.apiService
            .request(this.formConfig.submitApi, valuesObj)
            .subscribe(
              (res) => {
                this.resetForm(this.form);
                // Show success message
                this.notificationService.showSuccess(
                  this.formConfig.submitSuccessMessage || "Saved successfully!"
                );
                // Emit event after form submitted
                this.formSubmitted.emit(true);
                this.getData.emit(res);
                // Enable Submit Button
                this.disableSubmitButton = false;
                // Stop Loader
                this.isLoad = false;
              },
              (err) => {
                // Stop Loader
                this.isLoad = false;
                // Enable Submit Button
                this.disableSubmitButton = false;
              }
            );
          }
        } else {
          this.resetForm(this.form);
          // Emit event after form submitted
          this.formSubmitted.emit(true);
          // Enable Submit Button
          this.disableSubmitButton = false;
        }
      }
    }
  }

   // Reset Form
   resetForm(form: FormGroup) {
    form.reset();
    form.markAsPristine();
    Object.keys(form.controls).forEach(key => {
      if (form.controls[key] instanceof FormGroup) {
        this.resetForm(form.controls[key] as FormGroup);
      } else {
        form.get(key).setErrors(null);
        form.get(key).markAsPristine();
      }
    });
  }

  private getAllEditedValues(form: FormGroup) {
    let dirtyValues = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];

      if (currentControl.dirty) {
        if (currentControl["controls"] && !isArray(currentControl.value))
          dirtyValues[key] = this.getAllEditedValues(
            currentControl as FormGroup
          );
        else dirtyValues[key] = currentControl.value;
      }
    });

    return dirtyValues;
  }

  /**
   *
   * @param formFields :CanFormField[]
   * @param values :object
   *
   * Remove values that are not required to send
   */
  private removeNotIncludedValues(
    formFields: CanFormField[],
    values: object,
    form: FormGroup
  ): void {
    // Loop Form Fields
    formFields.forEach((formField) => {
      // Check for notIncluded in formField
      if (
        formField.send === "notSend" ||
        (formField.send === "sendOnModified" &&
          !form.controls[formField.name].dirty)
      ) {
        // Delete from object
        delete values[formField.name];
      } else {
        // Check for type 'group'
        if (
          formField.type === "group" &&
          formField.formFields &&
          formField.formFields.length
        ) {
          const fg = form.controls[formField.name] as FormGroup;
          // Remove values from group that are not required to send
          this.removeNotIncludedValues(
            formField.formFields,
            values[formField.name],
            fg
          );
        } else if (
          formField.type === "array" &&
          formField.formFields &&
          formField.formFields.length
        ) {
          const fa = form.controls[formField.name] as FormArray;
          // Remove values from array that are not required to send
          if (values[formField.name] && values[formField.name].length) {
            values[formField.name].forEach((value, index) => {
              const fg = fa.controls[index] as FormGroup;
              this.removeNotIncludedValues(formField.formFields, value, fg);
            });
          }
        }
      }
    });
  }

  /**
   *
   * @param data :Array<object>
   * @param key :string
   * @param value
   */
  private getObjectFromArray(data: Array<object>, key: string, value: any) {
    if (data && data.length) {
      // Find value index
      const index = data.findIndex((val) => val[key] === value);
      // If value present
      if (index > -1) {
        // Return value
        return data[index];
      }
    }
    return null;
  }

  /**
   * Set Form Dirty
   */
  private setFormDirty(form: FormGroup): void {
    this.form.markAsDirty();
    form.markAsDirty();
  }

  /**
   *
   * @param formFields :CanFormField
   * Set value has been changed in form field
   */
  private setFormControlDirty(formField: CanFormField, form: FormGroup): void {
    form.controls[formField.name].markAsDirty();
  }

  /**
   *
   * @param hideFields :CanHideFormFields
   * @param value
   *
   * Hide or show fields onn basis on response
   */
  private hideFormFields(hideFields: CanHideFormFields, value: any): void {
    // Check for keys
    if (hideFields && hideFields.keys && hideFields.keys.length) {
      // Loop keys
      hideFields.keys.forEach((key) => {
        // Get Formfield on basis of key
        const formField = this.getRelativeFormField(key);
        // Check for formfield
        if (formField) {
          // Check for operator type
          switch (hideFields.operator) {
            case "equals":
              formField.isHidden = value === hideFields.value ? true : false;
              break;

            case "notEquals":
              formField.isHidden = value !== hideFields.value ? true : false;
              break;

            default:
              break;
          }
        }
      });
    }
  }

  /**
   *
   * @param form :FormGroup
   * @param control :CanFormField
   * Add new formgroup to formarray
   */
  public addNewToFormArray(form: FormGroup, control: CanFormField): void {
    // Def's formarray
    const fa = form.controls[control.name] as FormArray;
    // Add new formgroup to form array
    fa.push(this.configureForm(control.formFields));
    this.formValueChanges.emit(this.form.value);
  }

  /**
   *
   * @param data:object
   * @param key:string
   *
   * Fetching Value with API KEY
   */
  public getValueWithApiKey(
    data: object,
    key: string,
    separators?: Array<string>
  ): any {
    return CanHelper.isEmpty(
      CanHelper.getValueWithApiKey(data, key, separators)
    )
      ? undefined
      : CanHelper.getValueWithApiKey(data, key, separators);
  }

  /**
   * Set value to autocomplete
   * @param valueItem :CanValueItem
   * @param control :CanFormField
   * @param form :FormGroup
   */
  public setValueToAutocomplete(
    valueItem: CanValueItem,
    control: CanFormField,
    form: FormGroup
  ): void {
    // Set input field value
    control.autoComplete.autocompleteSearchText = valueItem.viewValue;
    // Set control value
    form.controls[control.name].patchValue(valueItem.value);
  }

  /**
   *
   * @param control : CanFormField
   */
  public getAutocompletes(
    control: CanFormField,
    form: FormGroup,
    spinner: any
  ): void {
    control.autoComplete.minCharacters = control.autoComplete.minCharacters
      ? control.autoComplete.minCharacters
      : 1;
    // Initialize for autocomplete values
    control.values = [];
    // Remove subscription
    if (this.autoCompleteSubscription) {
      this.autoCompleteSubscription.unsubscribe();
    }
    // Check for spinner
    if (spinner) {
      // Hide spinner
      spinner._elementRef.nativeElement.style.display = "none";
    }
    // Check for text
    if (
      control.autoComplete.autocompleteSearchText &&
      control.autoComplete.autocompleteSearchText.trim() &&
      control.autoComplete.autocompleteSearchText.length >=
        control.autoComplete.minCharacters
    ) {
      // Check for spinner
      if (spinner) {
        // Visible spinner
        spinner._elementRef.nativeElement.style.display = "block";
      }
      // Initialize params
      if (!control.autoComplete.api.params) {
        control.autoComplete.api.params = new HttpParams();
      }
      // Check for api type
      if (
        this.apiService.getApiType(control.autoComplete.api) ===
        ApiType.Loopback
      ) {
        const objArr = [];
        for (const each of control.autoComplete.autocompleteParamKeys) {
          const obj = {};
          obj[each] = {
            ilike: "%" + control.autoComplete.autocompleteSearchText + "%",
          };
          objArr.push(obj);
        }
        control.autoComplete.api.params = control.autoComplete.api.params.append(
          "or",
          JSON.stringify(objArr)
        );
      } else {
        control.autoComplete.api.params = control.autoComplete.api.params.append(
          control.autoComplete.autocompleteParamKeys[0],
          control.autoComplete.autocompleteSearchText
        );
      }
      if (control.autoComplete.params && control.autoComplete.params.length) {
        control.autoComplete.params.forEach(param => {
          control.autoComplete.api.params = control.autoComplete.api.params.append(param.key, this.form.value[param.formValue])
        })
      }
      // Get autocomplete list
      this.autoCompleteSubscription = this.apiService
        .request(control.autoComplete.api)
        .subscribe(
          (res) => {
            // Initialize for autocomplete values
            control.values = [];
            const data = CanHelper.mapValueWithApiKey(
              res,
              control.autoComplete.apiDataKey
            );
            control.autoComplete.dataSource = data;
            if (_.isArray(data)) {
              // Add values to particular format
              for (const each of data) {
                control.values.push({
                  value: this.getValueWithApiKey(
                    each,
                    control.autoComplete.apiValueKey
                  ),
                  viewValue: this.getValueWithApiKey(
                    each,
                    control.autoComplete.apiViewValueKey,
                    control.autoComplete.viewValueSeparators
                  ),
                });
              }
            }
            // Check for spinner
            if (spinner) {
              // Hide spinner
              spinner._elementRef.nativeElement.style.display = "none";
            }
          },
          (err) => {
            // Check for spinner
            if (spinner) {
              // Hide spinner
              spinner._elementRef.nativeElement.style.display = "none";
            }
          }
        );
    }

    // Check for empty
    if (
      !control.autoComplete.autocompleteSearchText &&
      form.controls[control.name].value
    ) {
      form.controls[control.name].setValue(undefined);
      this.formValueChange(control, form);
    }
  }

  /**
   *
   * @param displayCondition :CanConditionConfig
   * @param form :FormGroup
   * Check whether to display field action or not
   */
  public displayValidate(
    displayCondition: CanConditionConfig,
    form: FormGroup
  ): boolean {
    // Checking Display Condition Existence
    if (displayCondition) {
      return this.conditionValidationService.validate(
        displayCondition,
        form.getRawValue()
      );
    }
    return true;
  }

    // requird for displaycondition fix
    _displayValidate(displayCondition: CanConditionConfig,
      form: FormGroup, formField: CanFormField,): boolean {
      const validate = this.displayValidate(displayCondition, form);
      if (!validate) {
        form.controls[formField.name].clearValidators();
      } else if (formField.required) {
        form.controls[formField.name].setValidators([Validators.required]);
      }
      return validate;
    
    }

  /**
   * Back button clicked event
   */
  public back(): void {
    this.backButtonClick.emit(true);
  }

  /**
   *
   * @param value :CanValueItem
   * @param control :CanFormField
   * @param form :FormGroup
   * Check for multiCheckbox value
   */
  public isMultiCheckboxFieldChecked(
    value: CanValueItem,
    control: CanFormField,
    form: FormGroup
  ): boolean {
    // Check whether value is array
    if (_.isArray(form.controls[control.name].value)) {
      // Check for index
      if (
        form.controls[control.name].value.findIndex(
          (each) => each === value.value
        ) > -1
      ) {
        // If found, return true
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   *
   * @param value :CanValueItem
   * @param control :CanFormField
   * @param form :FormGroup
   *
   * Event that trigger when multiCheckbox value is changed
   */
  public multiSelectCheckboxChange(
    value: CanValueItem,
    control: CanFormField,
    form: FormGroup
  ): void {
    // Check whether value is array
    if (_.isArray(form.controls[control.name].value)) {
      // Find index
      const index = form.controls[control.name].value.findIndex(
        (each) => each === value.value
      );
      // If index is found, remove the value
      if (index > -1) {
        form.controls[control.name].value.splice(index, 1);
      } else {
        // Else, add the value
        form.controls[control.name].value.push(value.value);
      }
    } else {
      // Set value as empty array
      form.controls[control.name].setValue([]);
      // Push value to array
      form.controls[control.name].value.push(value.value);
    }
  }
}
