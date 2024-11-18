import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CanListView, CanListViewItem } from 'src/@can/types/list-view.type';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanHelper } from 'src/@can/utils/helper.util';
import { DatePipe } from '@angular/common';
import { CanFieldAction, CanBulkFieldAction } from 'src/@can/types/table.type';
import { CanActionService } from 'src/@can/services/action/action.service';
import { CanConditionConfig, CanButton } from 'src/@can/types/shared.type';
import { CanConditionValidationService } from 'src/@can/services/condition-validation/condition-validation.service';
import { CanBreakpointObserverService } from 'src/@can/services/breakpoint-observer/breakpoint-observer.service';
import { SelectionModel } from '@angular/cdk/collections';
import { CanDialogService } from 'src/@can/services/dialog/dialog.service';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';

@Component({
  selector: 'can-list-view',
  templateUrl: './can-list-view.component.html',
  styleUrls: ['./can-list-view.component.scss']
})
export class CanListViewComponent implements OnInit {
  @Input() listViewConfig: CanListView;

  // Passing API Response to Parent Component
  @Output() getData = new EventEmitter<any>(true);

  public dataSource: any;

  public isLoad: boolean;

  public header: string;

  public fieldActionDefs: CanFieldAction[];


  public headerActionDefs: CanFieldAction[];

  public footerActionDefs : CanButton[];

  public bulkFieldActionDefs: CanBulkFieldAction[];

  public isSmallScreen: boolean;

  public imageRadius : string;

  public selection = new SelectionModel<Array<any>>(true, []);

  private listViewSubscription: Subscription;
  private countSubscription: Subscription;
  private bulkFieldActionSubscription: Subscription;

  constructor(private apiService: CanApiService,
    private notificationService: CanNotificationService,
    private changeDetectorRef: ChangeDetectorRef,
    private actionService: CanActionService,
    private conditionValidationService: CanConditionValidationService,
    private breakpointObserverService: CanBreakpointObserverService,
    private dialogService: CanDialogService,
    private datePipe: DatePipe) { }

  async ngOnInit() {
    // Header
    this.header = this.listViewConfig.header;
    // Field Action Definition
    this.fieldActionDefs = this.listViewConfig.fieldActions;
    // Header Action Defination
    this.headerActionDefs = this.listViewConfig.headerAction;
    // Footer Action Defination
    this.footerActionDefs = this.listViewConfig.footerAction;
    // Bulk Field Action Item Definitions
    this.bulkFieldActionDefs = this.listViewConfig.bulkFieldAction;
    // Process List View Data
    this.processListViewData();

    // Set Radius of avatar image
    this.imageRadius = this.listViewConfig.avatarImage.radius +'%';
    // Screen Size
    this.breakpointObserverService.isSmallScreen.subscribe((res) => {
      this.isSmallScreen = res;
    });

  }

  // Process Table Data
  private processListViewData(): Promise<boolean> {
    return new Promise(resolve => {
      // Page Loader Start
      this.isLoad = true;
      // Checking Default Data Source Existence
      if (this.listViewConfig.dataSource && this.listViewConfig.dataSource.length >= 0) {
        // Output data to Parent Component
        this.getData.emit(this.listViewConfig.dataSource);
        // Init Table Data Source
        this.dataSource = this.listViewConfig.dataSource;
        // Page Loader Stop
        this.isLoad = false;
        // Resolving Promise
        resolve(true);
      } else { // If No Default Data Source Then Call API
        if (!this.listViewConfig.api.params) {
          this.listViewConfig.api.params = new HttpParams();
        }
        // Set page and page limit
        this.listViewConfig.api.params = this.listViewConfig.api.params;
        // Api Call
        this.listViewSubscription = this.apiService.list(this.listViewConfig.api)
          .subscribe((res: any) => {
            // Output data to Parent Component
            this.getData.emit(res);
            // Assigning data
            this.dataSource = CanHelper.mapValueWithApiKey(res, this.listViewConfig.apiDataKey);
            // Page Loader Stop
            this.isLoad = false;
            // Resolving Promise
          }, (err) => {
            // Page Loader Stop
            this.isLoad = false;
          });
      }
    });
  }

  /**
   * 
   * @param listValueItem: CanListViewItem
   * @param dataSource :object
   * Get value after adding prefix and suffix
   */
  getValueWithSuffixAndPrefix(listValueItem: CanListViewItem, dataSource: object): string {
    if (!listValueItem) {
      return '';
    }
    let value = this.getValue(listValueItem, dataSource);
    // Check for prefix
    if (listValueItem.prefix) {
      value = listValueItem.prefix + value;
    }
    // Check for suffix
    if (listValueItem.suffix) {
      value = value + listValueItem.suffix;
    }
    return value;
  }

  /**
   * 
   * @param listValueItem: CanListViewItem
   * Get value
   */
  public getValue(listValueItem: CanListViewItem, dataSource: object) {
    let value: any;
    // Check for cardValueItem
    if (listValueItem) {
      // Set value
      value = CanHelper.getValueWithApiKey(dataSource, listValueItem.key, listValueItem.keySeparators);
      // Set for date
      if (value && listValueItem.type === 'date') {
        // Check for displayDateType
        if (listValueItem.displayDateType) {
          value = this.datePipe.transform(value, listValueItem.displayDateType)
        } else {
          value = this.datePipe.transform(value, "dd/MM/yy hh:mm:ss")
        }
      }

    }
    return value;
  }

  /**
   * 
   * @param displayCondition :CanConditionConfig
   * @param data :object
   * Check whether to display field action or not
   */
  public actionDisplayValidate(displayCondition: CanConditionConfig, data: object) {
    // Checking Display Condition Existence
    if (displayCondition) {
      return this.conditionValidationService.validate(displayCondition, data);
    }
    return true;
  }

  /**
   * 
   * @param data :object
   * @param fieldActionDef :FieldAction
   */
  public applyFieldAction(data: object, fieldActionDef: CanFieldAction, spinner: any) {
    if (spinner && fieldActionDef.action.actionType === 'ajax') {
      // Visible spinner
      spinner._elementRef.nativeElement.style.display = 'inline-block';
    }
    this.actionService.applyAction(fieldActionDef.action, data).then((response) => {
      if (response) {
        this.processListViewData().then(() => {
          if (spinner && spinner._elementRef.nativeElement.style.display !== 'none') {
            // Hide spinner
            spinner._elementRef.nativeElement.style.display = 'none';
          }
        });
      } else {
        if (spinner && spinner._elementRef.nativeElement.style.display !== 'none') {
          // Hide spinner
          spinner._elementRef.nativeElement.style.display = 'none';
        }
      }
    });
  }

  /**
   * 
   * @param spinner 
   * Check for field action visiblity
   */
  checkForActionVisiblity(spinner: any) {
    if (spinner && spinner._elementRef.nativeElement.style.display === 'inline-block') {
      return false;
    }
    return true;
  }

  // /**
  //  * Check all rows selected or not
  //  */
  // public isAllSelected() {
  //   return this.selection.selected.length === this.dataSource.length;
  // }

  // /** Selects all rows if they are not all selected; 
  //  * otherwise clear selection. */
  // public masterToggle() {
  //   this.isAllSelected() ? this.selection.clear() : this.dataSource.forEach(row => this.selection.select(row));
  // }

    /**
   * 
   * @param bulkFieldAction :CanBulkFieldAction
   */
  public applyBulkFieldAction(bulkFieldAction: CanBulkFieldAction) {
    console.log(this.listViewConfig.api.params);
    // Check for value
    if (this.selection.hasValue()) {
      // Open confirm dialog
      this.dialogService.confirmDialog(bulkFieldAction.confirm).then((response) => {
        // Check for confirm dialog result
        if (response) {
          // Fetch Current Filters
          const filterKeys = this.listViewConfig.api.params.keys();
          // Validate if any required filter for bulkfieldaction
          if (bulkFieldAction.requiredFilterKeys) {
            for (let i = 0; i < bulkFieldAction.requiredFilterKeys.length; i++) {
              const filterKey = bulkFieldAction.requiredFilterKeys[i].key;
              const index = filterKeys.indexOf(filterKey);
              if (index < 0) {
                const key = bulkFieldAction.requiredFilterKeys[i].transformedKey ? bulkFieldAction.requiredFilterKeys[i].transformedKey : bulkFieldAction.requiredFilterKeys[i].key;
                return this.notificationService.showError(`${key.toUpperCase()} filter must be selected!`);
              }
            }
          }
          // Page Loader Start
          this.isLoad = true;
          // Get Selected Value
          const selectedValue = this.selection.selected;
          let bodyData: any = bulkFieldAction.dataKey ? {} : [];
          if (selectedValue.length) {
            // Get Keys
            const keys = bulkFieldAction.keys;
            // Mapped & Created Api Payload
            const mappedValue = selectedValue.map(each => {
              const newObj: any = {}
              keys.forEach(key => {
                newObj[key] = this.getValueWithApiKey(each, key);
              });
              return newObj;
            });
            // Map Data with Key
            if (bulkFieldAction.dataKey) {
              bodyData[bulkFieldAction.dataKey] = mappedValue;
            } else {
              bodyData = mappedValue;
            }
            // Api Request
            this.changeDetectorRef.detectChanges();
            this.bulkFieldActionSubscription = this.apiService.request(bulkFieldAction.api, bodyData).subscribe((res) => {
              // Clear Selected Value
              this.selection.clear();
              // Page Loader Stop
              this.isLoad = false;
              this.processListViewData();
            }, error => {
              // Clear Selected Value
              this.selection.clear();
              // Page Loader Stop
              this.isLoad = false;
              throw error;
            });
          }
        }
      });
    }
  }


  /**
   *
   * @param data:object
   * @param key:string
   *
   * Fetching Value with API KEY
   */
  public getValueWithApiKey(data: object, key: string, separators?: Array<string>): any {
    const value = CanHelper.getValueWithApiKey(data, key, separators);
   
    return CanHelper.isEmpty(value) ? '-' : value;
  }


  // /**
  //  * 
  //  * @param bulkFieldAction :CanBulkFieldAction
  //  */
  // public applyBulkFieldAction(bulkFieldAction: CanBulkFieldAction) {
  //   // Check for value
  //   if (this.selection.hasValue()) {
  //     // Open confirm dialog
  //     this.dialogService.confirmDialog(bulkFieldAction.confirm).then((response) => {
  //       // Check for confirm dialog result
  //       if (response) {
  //         // Add values to body
  //         const bodyData = {};
  //         bodyData[bulkFieldAction.key] = [];
  //         for (const each of this.selection.selected) {
  //           const value = CanHelper.getValueWithApiKey(each, bulkFieldAction.key);
  //           if (value) {
  //             bodyData[bulkFieldAction.key].push(value);
  //           }
  //         }
  //         // Api Request
  //         this.bulkFieldActionSubscription = this.apiService.request(bulkFieldAction.api, bodyData).subscribe((res) => {
  //           this.processListViewData();
  //         });
  //       }
  //     });
  //   }
  // }

}
