import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  CanFormStepper,
  CanFormStep,
  CanFormStepperLayout,
} from "src/@can/types/form-stepper.type";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { CanApiService } from "src/@can/services/api/api.service";
import { CanHelper } from "src/@can/utils/helper.util";
import { CanAutoUnsubscribe } from "src/@can/decorators/auto-unsubscribe";
import { CanNotificationService } from "src/@can/services/notification/notification.service";
import { FormStepperConfigValidator } from "src/@can/validators/formstepper-config-validator";
import { CanApi } from "src/@can/types/api.type";

@Component({
  selector: "can-form-stepper",
  templateUrl: "./can-form-stepper.component.html",
  styleUrls: ["./can-form-stepper.component.scss"],
})
// Unsubscribe all subscriptions on ngOnDestroy
@CanAutoUnsubscribe
export class CanFormStepperComponent implements OnInit {
  @Input() formStepperConfig: CanFormStepper;

  // Form submitted event to parent
  @Output() formSubmitted = new EventEmitter<any>(true);

  // Form submitted api response to parent
  @Output() getData = new EventEmitter<any>(true);

  // Index to be opened
  public selectedIndex: number;
  // Steps
  public steps: CanFormStep[];
  // Default Form Group to assign to formstep
  public defaultFormGroup = new FormGroup({});
  // Submit on each step
  public submitOnEachStep: boolean;
  // Form values to save for final submit
  public formsValues = [];
  // Display form stepper
  public showFormStepper: boolean;
  // Label Position
  public labelPosition: string;
  // Layout
  public layout: CanFormStepperLayout;
  // Header Name
  public header: string;
  // Layout Def
  CanFormStepperLayout = CanFormStepperLayout;
  // Loader
  public isLoad: boolean;
  // Data Source
  public dataSource: object;

  public id: number;

  // Subscriptions
  private formSubscription: Subscription;
  private submitFormSubscription: Subscription;

  constructor(
    private apiService: CanApiService,
    private notificationService: CanNotificationService
  ) {
    // Init stepper index
    this.selectedIndex = 0;
    // Init display FormStepper
    this.showFormStepper = false;
  }

  ngOnInit() {
    // Validate Form Stepper Config
    FormStepperConfigValidator.validateFormStepperConfig(
      this.formStepperConfig
    );
    // Defs steps
    this.steps = this.formStepperConfig.steps;
    // Defs submitOnEachStep
    this.submitOnEachStep = this.formStepperConfig.submitOnEachStep;
    // Defs label position
    this.labelPosition = this.formStepperConfig.horizontalLabelPosition;
    // Defs layout
    this.layout = this.formStepperConfig.layout;
    // Defs header
    this.header = this.formStepperConfig.header;
    // Def's id
    this.id = this.formStepperConfig.id;
    // Check for form type
    if (this.formStepperConfig.type === "edit") {
      // Process Form Data In case of edit form
      this.processFormData().then(
        (res) => {
          // Assign data to forms
          this.steps.forEach((step) => {
            step.form.dataSource = this.dataSource;
          });
          // Show form stepper
          this.showFormStepper = true;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      // Show form stepper
      this.showFormStepper = true;
    }
  }

  /**
   * Process Form Data
   */
  private processFormData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Page Loader Start
      this.isLoad = true;
      // Checking Default Data Source Existence
      if (this.formStepperConfig.dataSource) {
        // Assigning data
        this.dataSource = this.formStepperConfig.dataSource;
        // Page Loader Stop
        this.isLoad = false;
        // Resolving Promise
        resolve(true);
      } else {
        // If No Default Data Source Then Call API
        // Api Call
        this.formSubscription = this.apiService
          .request(this.formStepperConfig.getApi)
          .subscribe(
            (res) => {
              // Assigning data
              this.dataSource = CanHelper.mapValueWithApiKey(
                res,
                this.formStepperConfig.apiDataKey
              );
              // Page Loader Stop
              this.isLoad = false;
              // Resolving Promise
              resolve(true);
            },
            (err) => {
              // Remove Loader
              this.isLoad = false;
              reject(err);
            }
          );
      }
    });
  }

  /**
   *
   * @param valuesObj :object
   * @param formComponent
   * @param index :number
   * Emits after every form submitted
   */
  next(valuesObj: object, formComponent: any, index: number) {
    // Check for step index, if its not last
    if (index < this.steps.length - 1) {
      // Check for submitOnEachStep
      if (this.submitOnEachStep) {
        if (
          !this.id &&
          this.formStepperConfig.firstTimeSubmitApi &&
          this.formStepperConfig.type === "create"
        ) {
          this.submit(
            valuesObj,
            this.formStepperConfig.firstTimeSubmitApi
          ).then((res: object) => {
            if (res) {
              this.dataSource = CanHelper.mapValueWithApiKey(
                res,
                this.formStepperConfig.apiDataKey
              );
              this.id = CanHelper.mapValueWithApiKey(
                this.dataSource,
                this.formStepperConfig.apiIdKey
              );
              // Enable Submit Button
              formComponent.disableSubmitButton = false;
              // Increment step
              this.selectedIndex = this.selectedIndex + 1;
            } else {
              // Enable Submit Button
              formComponent.disableSubmitButton = false;
            }
          });
        } else {
          // Api request
          this.submit(valuesObj, this.formStepperConfig.submitApi).then(
            (res) => {
              // If submitted
              if (res) {
                // Enable Submit Button
                formComponent.disableSubmitButton = false;
                // Increment step
                this.selectedIndex = this.selectedIndex + 1;
              } else {
                // Enable Submit Button
                formComponent.disableSubmitButton = false;
              }
            }
          );
        }
      } else {
        // Assign value
        this.formsValues[index] = valuesObj;
        // Enable Submit Button
        formComponent.disableSubmitButton = false;
        // Increment step
        this.selectedIndex = this.selectedIndex + 1;
      }
    } else {
      // Check for submitOnEachStep
      if (this.submitOnEachStep) {
        // Api request
        this.submit(valuesObj, this.formStepperConfig.submitApi).then((res) => {
          if (res) {
            // Emit event after form submitted
            this.formSubmitted.emit(true);
            // Enable Submit Button
            formComponent.disableSubmitButton = false;
          } else {
            // Enable Submit Button
            formComponent.disableSubmitButton = false;
          }
        });
      } else {
        // Assign value
        this.formsValues[index] = valuesObj;
        // Get final object
        const obj = this.createFinalObject();
        this.submit(obj, this.formStepperConfig.submitApi).then((res) => {
          if (res) {
            // Emit event after form submitted
            this.formSubmitted.emit(true);
            // Enable Submit Button
            formComponent.disableSubmitButton = false;
          } else {
            // Enable Submit Button
            formComponent.disableSubmitButton = false;
          }
        });
      }
    }
  }

  /**
   *
   * @param valuesObj :object
   * Submit Api request
   */
  private submit(valuesObj: object, api: CanApi) {
    return new Promise((resolve) => {
      if (!CanHelper.isEmpty(valuesObj)) {
        api.apiPath = CanHelper.replaceVariableInUrl(
          api.apiPath,
          this.dataSource
        );
        this.submitFormSubscription = this.apiService
          .request(api, valuesObj)
          .subscribe(
            (res) => {
              if (res) {
                this.getData.emit(res);
                resolve(res);
              } else {
                this.getData.emit(null);
                resolve(true);
              }
            },
            (err) => {
              this.getData.emit(null);
              resolve(false);
            }
          );
      } else {
        this.getData.emit(null);
        resolve(true);
      }
    });
  }

  /**
   * Create final object to send
   */
  private createFinalObject() {
    // Init obj
    let obj = {};
    // Loop all forms values
    this.formsValues.forEach((element) => {
      obj = {
        ...obj,
        ...element,
      };
    });
    // Return obj
    return obj;
  }

  /**
   * Back button clicked event
   */
  public backClicked(form: FormGroup): void {
    // Set form properties
    form.markAsPristine();
    form.markAsUntouched();
    // Check for selectedIndex
    if (this.selectedIndex) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
}
