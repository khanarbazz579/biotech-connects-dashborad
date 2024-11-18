import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CanDetailView, CanDisplayedField } from 'src/@can/types/detail-view.type';
import { Subscription } from 'rxjs';
import { CanHelper } from 'src/@can/utils/helper.util';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanImageItem, CanDocumentItem, CanValueItem, CanDocument, CanDocuments, CanEnumIconItem, CanImages, CanConditionConfig } from 'src/@can/types/shared.type';
import { CanDialogService } from 'src/@can/services/dialog/dialog.service';
import { CanFieldAction } from 'src/@can/types/table.type';
import { CanActionService } from 'src/@can/services/action/action.service';
import { CanAutoUnsubscribe } from 'src/@can/decorators/auto-unsubscribe';
import { DetailViewConfigValidator } from 'src/@can/validators/detailview-config-validator';
import { CanBreakpointObserverService } from 'src/@can/services/breakpoint-observer/breakpoint-observer.service';
import { CanImage } from 'src/@can/types/image.type';
import { CanConditionValidationService } from 'src/@can/services/condition-validation/condition-validation.service';

@Component({
  selector: 'can-detail-view',
  templateUrl: './can-detail-view.component.html',
  styleUrls: ['./can-detail-view.component.scss']
})

// Unsubcribe all subscriptions automatically on ngOnDestroy
@CanAutoUnsubscribe
export class CanDetailViewComponent implements OnInit {
  // Getting Config from Parent Compoent
  @Input() detailViewConfig: CanDetailView;

  // Passing API Response to Parent Component
  @Output() getData = new EventEmitter<any>(true);

  // Underscore Package
  public _ = _;

  // Page Loader
  public isLoad: boolean;

  // Display condition
  public displayDetailView: boolean;

  // Datasource from API/Local for displaying fields
  public dataSource: any;
  // Display field config
  public displayedFieldDefs: CanDisplayedField[];
  // No. of columns in each row
  public columnPerRow: number;
  // Header Name
  public header: string;
  // Action defs for header
  public actionDef: CanFieldAction[];
  // Subscription
  public detailViewSubscription: Subscription;

  public isSmallScreen: boolean;

  constructor(private apiService: CanApiService,
    public dialog: MatDialog,
    private dialogService: CanDialogService,
    private actionService: CanActionService,
    private breakpointObserverService: CanBreakpointObserverService,
    private conditionValidationService: CanConditionValidationService) {
    this.displayDetailView = true;
  }

  ngOnInit() {
    // Validate Detail View Config
    DetailViewConfigValidator.validateDetailViewConfig(this.detailViewConfig);
    // Start Page Loader
    this.isLoad = true;
    // Header Name
    this.header = this.detailViewConfig.header;
    // Action def
    this.actionDef = this.detailViewConfig.action;
    // Displayed Item Definitions
    this.displayedFieldDefs = this.detailViewConfig.displayedFields;
    // Defining Field Per Row
    this.columnPerRow = this.detailViewConfig.columnPerRow || 1;
    // Screen Size
    this.breakpointObserverService.isSmallScreen.subscribe((res) => {
      this.isSmallScreen = res;
    });
    // Process Data
    this.processDetailViewData();

     // Refresh Table Event 
     if (this.detailViewConfig.refreshEvent) {
      this.detailViewConfig.refreshEvent.subscribe(event => {
        if (event) {
          // Refresh Table Data
          this.processDetailViewData();
        }
      })
    }
  }

  private processDetailViewData(): Promise<boolean> {
    return new Promise((resolve) => {
      // Page Loader Start
      this.isLoad = true;
      // Checking Default Data Source Existence
      if (this.detailViewConfig.dataSource) {
        // Assigning data
        this.dataSource = this.detailViewConfig.dataSource;
        // Emit Data to Parent
        this.getData.emit(this.dataSource);
        // Page Loader Stop
        this.isLoad = false;
        // process others data
        this.processOthersData(this.displayedFieldDefs, this.dataSource)
        // Resolving Promise
        resolve(true);
      } else { // If No Default Data Source Then Call API
        // Api Call
        this.detailViewSubscription = this.apiService.get(this.detailViewConfig.api)
          .subscribe(res => {
            if (res) {
              // Assigning data
              this.dataSource = CanHelper.mapValueWithApiKey(res, this.detailViewConfig.apiDataKey);
              // Emit Data to Parent
              this.getData.emit(this.dataSource);
              // process others data
              this.processOthersData(this.displayedFieldDefs, this.dataSource)
              // Page Loader Stop
              this.isLoad = false;
            } else {
              // Hide detail View
              this.displayDetailView = false;
            }
            // Resolving Promise
            resolve(true);
          }, (err) => {
            // Hide detail View
            this.displayDetailView = false;
          });
      }

    });
  }


  private processOthersData(displayedFields: CanDisplayedField[], data: object): void {
    for (const displayedField of displayedFields) {
      if (displayedField.type === 'api_group') {
        const api = Object.assign({}, displayedField.apiGroup.api);
        if (CanHelper.checkAndReplaceVariableInUrl(api.apiPath, data)) {
          api.apiPath = CanHelper.checkAndReplaceVariableInUrl(api.apiPath, data) as string;
          this.apiService.request(api).subscribe((res) => {
            displayedField.apiGroup.dataSource = CanHelper.mapValueWithApiKey(res, displayedField.apiGroup.apiDataKey);
            this.processOthersData(displayedField.apiGroup.displayedFields, displayedField.apiGroup.dataSource);
          });
        }
      } else if (displayedField.type === 'group') {
        this.processOthersData(displayedField.group.displayedFields, data);
      }
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
    return CanHelper.isEmpty(CanHelper.getValueWithApiKey(data, key, separators)) ? '-' : CanHelper.getValueWithApiKey(data, key, separators);
  }

  /**
   *
   * @param imageSrc:string
   *
   * Open Image Modal when view Image button click
   */
  public onImageDisplay(data, images: CanImages, width: number, index?: number): void {
    if (images.showAll && images.openType === 'link') {
      const imagesData = this.dialogService.getImages(data, images.imageItems)
      if (images.linkType === 'self') {
        this.actionService.onOpenSelfUrl(imagesData[index].image.src);
      } else {
        this.actionService.onOpenExternalUrl(imagesData[index].image.src);
      }
    } else {
      this.dialogService.onImageDisplay(data, images.imageItems, width, index);
    }
  }

  /**
  * 
  * @param data : object 
  * @param images : CanImageItem[]
  * Return Images Count
  */
  public getImageCount(data, images: CanImageItem[]) {
    if (data && images) {
      return this.dialogService.getImages(data, images).length;
    }
    return 0;
  }

  /**
  * 
  * @param images : CanImageItem[]
  * Return Images
  */
  public getImages(data, images: CanImageItem[]): CanImage[] {
    let result = [];
    if (data && images) {
      result = this.dialogService.getImages(data, images);
    }
    return result;
  }


  /**
   *
   * @param docSrc:string
   * @param extension:string
   *
   * Open Document when button click
   */
  public onDocumentDisplay(data, documents: CanDocuments, width: number, index?: number): void {

    if (documents.showAll && documents.openType === 'link') {
      const documentsData = this.dialogService.getDocuments(data, documents.documentItems)
      if (documents.linkType === 'self') {
        this.actionService.onOpenSelfUrl(documentsData[index].document.src);
      } else {
        this.actionService.onOpenExternalUrl(documentsData[index].document.src);
      }
    } else {
      this.dialogService.onDocumentsDisplay(data, documents.documentItems, width, index);
    }
  }

  /**
  * 
  * @param documents : CanDocumentItem[]
  * Return Documents Count
  */
  public getDocumentCount(data, documents: CanDocumentItem[]) {
    if (data && documents) {
      return this.dialogService.getDocuments(data, documents).length;
    }
    return 0;
  }

  /**
  * 
  * @param documents : CanDocumentItem[]
  * Return Documents
  */
  public getDocuments(data, documents: CanDocumentItem[]): CanDocument[] {
    let result = [];
    if (data && documents) {
      result = this.dialogService.getDocuments(data, documents);
    }
    return result;
  }

  /**
   * 
   * @param src : string
   * Get document icon
   */
  public getDocumentIcon(src: string): string {
    return this.dialogService.getDocumentIcon(src);
  }

  /**
   * 
   * @param index : number
   * @param item :any
   * For documents and images
   */
  public trackByIndex(index: number, item: any): number {
    return index;
  }

  /**
  *
  * @param url:string
  *
  * OPEN URL In Same Tab
  */
  public onOpenSelfUrl(data, url: string): void {
    this.actionService.onOpenSelfUrl(CanHelper.replaceVariableInUrl(url, data));
  }

  /**
   *
   * @param url:string
   *
   * Opne URL in New Tab
   */
  public onOpenExternalUrl(data, url: string): void {
    this.actionService.onOpenExternalUrl(CanHelper.replaceVariableInUrl(url, data));
  }

  /**
   * 
   * @param value : any
   * @param enumValues :CanValueItem[]
   * Returns value to display in case of enum
   */
  displayValueForEnum(value: string, enumValues: CanValueItem[]) {
    if (enumValues && enumValues.length) {
      // Find value index
      const index = enumValues.findIndex(val => val.value === value);
      // If value present
      if (index > -1) {
        // Return display value
        return enumValues[index].viewValue;
      }
    }
    return value;
  }

  /**
  * 
  * @param value : any
  * @param enumValues :CanValueItem[]
  * Returns background Color to display in case of enum
  */
  displayBackgroundForEnum(value: string, enumValues: CanValueItem[]) {
    if (enumValues && enumValues.length) {
      // Find value index
      const index = enumValues.findIndex(val => val.value === value);
      // If value present
      if (index > -1 && enumValues[index].backgroundColor) {
        // Return display value
        return enumValues[index].backgroundColor;
      }
    }
    return '';
  }

  /**
   * 
   * @param value : any
   * @param enumValues :CanValueItem[]
   * Returns color to display in case of enum
   */
  displayColorForEnum(value: string, enumValues: CanValueItem[]) {
    if (enumValues && enumValues.length) {
      // Find value index
      const index = enumValues.findIndex(val => val.value === value);
      // If value present
      if (index > -1 && enumValues[index].color) {
        // Return display value
        return enumValues[index].color;
      }
    }
    return '';
  }

  /**
  * 
  * @param value : any
  * @param enumValues :CanValueItem[]
  * Returns value to display in case of enum
  */
  displayIconForEnum(value: string, enumIcons: CanEnumIconItem[]) {
    if (enumIcons && enumIcons.length) {
      // Find value index
      const index = enumIcons.findIndex(val => val.value === value);
      // If value present
      if (index > -1) {
        // Return display value
        return enumIcons[index].icon;
      }
    }
    return false;
  }

  /**
   *
   * @param url: string
   *
   * Checking Complete URL or not
   */
  public isUrl(url: string): boolean {
    return CanHelper.validateUrl(url);
  }

  /**
   * Apply action
   */
  public applyAction(action) {
    this.actionService.applyAction(action, this.dataSource).then((response: boolean) => {
      if (response) {
        // Reload data
        this.processDetailViewData();
      }
    });
  }

  /**
   * 
   * @param displayCondition :CanConditionConfig
   * @param data :object
   * Check whether to display or not
   */
  public displayValidate(displayCondition: CanConditionConfig) {
    // Checking Display Condition Existence
    if (displayCondition) {
      return this.conditionValidationService.validate(displayCondition, this.dataSource);
    }
    return true;
  }
}
