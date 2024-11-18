// Angular Modules
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

// Angular Material
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';

// NPM Packages
import * as _ from 'underscore';

// CUSTOM Modules
import { HttpParams } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import { CanHelper } from 'src/@can/utils/helper.util';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanDialogService } from 'src/@can/services/dialog/dialog.service';
import { CanColumnItem, CanImageItem, CanDocumentItem, CanValueItem, CanDocument, CanDocuments, CanEnumIconItem, CanImages, CanConditionConfig } from 'src/@can/types/shared.type';
import { CanActionService } from 'src/@can/services/action/action.service';
import {
  CanTable, CanFilter, CanBulkAction, CanBulkFieldAction,
  CanUpload, CanFieldAction
} from 'src/@can/types/table.type';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { CanAutoUnsubscribe } from 'src/@can/decorators/auto-unsubscribe';
import { TableConfigValidator } from 'src/@can/validators/table-config-validator';
import { ApiType } from 'src/@can/types/api.type';
import { CanBreakpointObserverService } from 'src/@can/services/breakpoint-observer/breakpoint-observer.service';
import { CanImage } from 'src/@can/types/image.type';
import { CanConditionValidationService } from 'src/@can/services/condition-validation/condition-validation.service';
import { CanTableDownloadService } from 'src/@can/services/table/table-download.service';

@Component({
  selector: 'can-table',
  templateUrl: './can-table.component.html',
  styleUrls: ['./can-table.component.scss']
})

@CanAutoUnsubscribe
export class CanTableComponent implements OnInit {

  // Underscore Package
  public _ = _;

  // Incoming Table Config from Parent Component
  @Input() tableConfig: CanTable;

  // Passing API Response to Parent Component
  @Output() getData = new EventEmitter<any>(true);

  // Passing API Response to Parent Component
  @Output() getFieldActionData = new EventEmitter<any>();

  // Page Loader
  public isLoad: boolean;

  // Table Config
  public displayedColumns: string[];
  public columnDefs: CanColumnItem[];
  public dataSource: any;
  public tableDataSource: MatTableDataSource<any>;
  public dataSourceType: string;
  public filterDefs: CanFilter[];
  public bulkActionDefs: CanBulkAction[];
  public bulkFieldActionDefs: CanBulkFieldAction[];
  public uploadDef: CanUpload;
  public fieldActionDefs: CanFieldAction[];
  public selection = new SelectionModel<Array<any>>(true, []);
  public header: string;
  public totalCount: number;
  public indexer: boolean;
  public isSmallScreen: boolean;
  public pageSizeOptions: Array<number>
  public apiLimit: number;
  public scrollDisabled: boolean;
  public downloadSpinner: boolean;

  // Helper class
  public Helper = CanHelper;
  // Paginator
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Subscription
  private tableSubscription: Subscription;
  private countSubscription: Subscription;
  private autoCompleteSubscription: Subscription;
  private bulkFieldActionSubscription: Subscription;

  constructor(
    private notificationService: CanNotificationService,
    private apiService: CanApiService,
    private dialogService: CanDialogService,
    private actionService: CanActionService,
    private breakpointObserverService: CanBreakpointObserverService,
    private conditionValidationService: CanConditionValidationService,
    private changeDetectorRef: ChangeDetectorRef,
    private tableDownloadService: CanTableDownloadService,
  ) {
    // Page Loader Init
    this.isLoad = false;
  }

  async ngOnInit() {
    // Validate Table Config
    TableConfigValidator.validateTableConfig(this.tableConfig);
    // Page Loader Start
    this.isLoad = true;
    // Column Item Definitions
    this.columnDefs = this.tableConfig.displayedColumns;
    // Filter Item Definitons
    this.filterDefs = this.tableConfig.filters;
    // Bulk Action Item Definitions
    this.bulkActionDefs = this.tableConfig.bulkActions;
    // Upload Definition
    this.uploadDef = this.tableConfig.upload;
    // Field Action Definition
    this.fieldActionDefs = this.tableConfig.fieldActions;
    // Bulk Field Action Item Definitions
    this.bulkFieldActionDefs = this.tableConfig.bulkFieldAction;
    // Header
    this.header = this.tableConfig.header;
    // Index column
    this.indexer = this.tableConfig.indexer;
    // Api Limit
    this.apiLimit = this.tableConfig.apiLimit ? this.tableConfig.apiLimit : 50;
    if (this.tableConfig.dataSource && this.tableConfig.dataSource.length >= 0) {
      this.apiLimit = this.tableConfig.dataSource.length;
    }
    this.disableScroll();
    // Paginator Page Options
    this.pageSizeOptions = this.tableConfig.pagination ? this.tableConfig.pagination.pageSizeOptions : [this.apiLimit];
    // Displayed Columns Definitions
    this.displayedColumns = await getDisplayedColumns(this.tableConfig);
    // Page Loader Stop
    this.isLoad = false;
    // Screen Size
    this.breakpointObserverService.isSmallScreen.subscribe((res) => {
      this.isSmallScreen = res;
    });
    if (this.filterDefs && this.filterDefs.length) {
      // apply set api filter
      this.setApiDataFilter();
    }
    // Process Table Data
    await this.processTableData();

    // Refresh Table Event 
    if (this.tableConfig.refreshEvent) {
      this.tableConfig.refreshEvent.subscribe(event => {
        if (event) {
          // Refresh Table Data
          this.processTableData();
        }
      })
    }
  }

  // Process Table Data
  public processTableData(): Promise<boolean> {
    return new Promise(resolve => {
      // Page Loader Start
      this.isLoad = true;
      // Checking Default Data Source Existence
      if (this.tableConfig.dataSource && this.tableConfig.dataSource.length >= 0) {
        // Output data to Parent Component
        this.getData.emit(this.tableConfig.dataSource);
        // Init Table Data Source
        this.tableDataSource = new MatTableDataSource(this.tableConfig.dataSource);
        // Page Loader Stop
        this.isLoad = false;
        // Init Paginator
        if (this.tableConfig.pagination) {
          this.tableDataSource.paginator = this.paginator;
        }
        // Data Source Type
        this.dataSourceType = 'LOCAL';
        // Total count 
        this.totalCount = this.tableConfig.dataSource.length;
        // Filters
        this.tableDataSource.filterPredicate = this.customFilterPredicate();
        this.applyLocalDataFilter();
        this.changeDetectorRef.detectChanges();
        // Resolving Promise
        resolve(true);
      } else { // If No Default Data Source Then Call API
        if (!this.tableConfig.api.params) {
          this.tableConfig.api.params = new HttpParams();
        }
        // Set page and page limit
        this.tableConfig.api.params = this.tableConfig.api.params
          .set('page', (this.paginator.pageIndex + 1).toString())
          .set('limit', this.paginator.pageSize.toString());
        // Api Call
        this.tableSubscription = this.apiService.list(this.tableConfig.api)
          .subscribe((res: any) => {
            // Output data to Parent Component
            this.getData.emit(res);
            const data = CanHelper.mapValueWithApiKey(res, this.tableConfig.apiDataKey);
            if (this.paginator.pageIndex > 0 && !this.scrollDisabled && this.dataSource && this.dataSource.length && data) {
              this.dataSource = [...this.dataSource, ...data]
              this.pageSizeOptions = [this.dataSource.length];
            } else {
              // Init dataSource
              this.dataSource = data;
            }
            if (this.paginator.pageIndex === 0) {
              this.disableScroll();
            }
            // Init Table Data Source
            this.tableDataSource = new MatTableDataSource(this.dataSource);
            // Page Loader Stop
            this.isLoad = false;
            // Init Paginator
            if (this.tableConfig.pagination) {
              this.tableDataSource.paginator = this.paginator;
            }
            // Data Source Type
            this.dataSourceType = 'API';
            // Show Notification
            if (this.tableConfig.successMessageKey) {
              this.notificationService.showSuccess(res[this.tableConfig.successMessageKey]);
            }
            // Filters
            this.tableDataSource.filterPredicate = this.customFilterPredicate();
            this.applyLocalDataFilter();
            // Resolving Promise
            this.getDataCount(this.paginator.pageIndex).then((res) => {
              this.setPaginationForLocalFilter();
              resolve(true);
            })
          }, (err) => {
            // Page Loader Stop
            this.isLoad = false;
          });
      }
    });
  }


  private getDataCount(pageIndex) {
    return new Promise(resolve => {
      // Checking Count Api Existence
      if (this.tableConfig.countApi) {
        this.tableConfig.countApi.params = this.tableConfig.api.params;
        // Api Call
        this.countSubscription = this.apiService.request(this.tableConfig.countApi)
          .subscribe((res: any) => {
            // Total count 
            this.totalCount = this.getValueWithApiKey(res, this.tableConfig.countApiDataKey);
            // Set Paginator Config
            this.paginator.pageIndex = pageIndex;
            // Resolving Promise
            resolve(true);
          });
      } else {
        resolve(true);
      }
    });
  }

  private disableScroll() {
    // Infinite scroll Disable condition
    this.scrollDisabled = this.tableConfig.pagination ? true : false;
    if (this.tableConfig.dataSource && this.tableConfig.dataSource.length >= 0) {
      this.scrollDisabled = true;
    }
  }

  /**
   * Paginator page change event
   */
  public paginatorPageChange(event) {
    this.processTableData();
  }

  /**
   *
   * @param imageSrc:string
   *
   * Open Image Modal when view Image button click
   */
  public onImageDisplay(data: object, images: CanImages, width: number, index?: number): void {
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
  public getImageCount(data: object, images: CanImageItem[]) {
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
  public getImages(data: object, images: CanImageItem[]): CanImage[] {
    let result = [];
    if (data && images) {
      result = this.dialogService.getImages(data, images);
    }
    return result;
  }

  getInlineImage(data: object, image: CanImageItem) {
    let result: CanImage;
    if (image.type === 'url') {
      result = this.dialogService.createImageData(image.src, image.alt);
    } else {
      const value = CanHelper.mapValueWithApiKey(data, image.value);
      if (value) {
        if (!image.isArray) {
          result = this.dialogService.createImageData(value, image.alt);
        }
      }
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
  public onDocumentDisplay(data: object, documents: CanDocuments, width: number, index?: number): void {

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
   * @param data : object 
   * @param documents : CanDocumentItem[]
   * Return Documents Count
   */
  public getDocumentCount(data: object, documents: CanDocumentItem[]) {
    if (data && documents) {
      return this.dialogService.getDocuments(data, documents).length;
    }
    return 0;
  }

  /**
  * @param data : object
  * @param documents : CanDocumentItem[]
  * Return Documents
  */
  public getDocuments(data: object, documents: CanDocumentItem[]): CanDocument[] {
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
  public onOpenSelfUrl(url: string, data: object): void {
    this.actionService.onOpenSelfUrl(CanHelper.replaceVariableInUrl(url, data));
  }

  /**
   *
   * @param url:string
   *
   * Opne URL in New Tab
   */
  public onOpenExternalUrl(url: string, data: object): void {
    this.actionService.onOpenExternalUrl(CanHelper.replaceVariableInUrl(url, data));
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
   * Returns value to disaplay in case of enum
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
   * ==================== TABLE FILTERS ====================
   */

  /**
   * Apply Local Data Filter
   */
  public applyLocalDataFilter() {
    if (this.filterDefs) {
      // Assigning filter
      this.tableDataSource.filter = JSON.stringify(this.filterDefs);
      this.setPaginationForLocalFilter();
    }
  }


  /**
   * Check for local filter and set paginator length accordingly
   */
  private setPaginationForLocalFilter() {
    // Init hasLocalFilter
    let hasLocalFilter = false;
    if (this.filterDefs) {
      for (const eachFilter of this.filterDefs) {
        if (eachFilter.filtertype === 'local' && eachFilter.selectedValue && eachFilter.selectedValue.toString().trim()) {
          hasLocalFilter = true;
          break;
        }
      }
    }
    // If local filter not found, paginator length
    if (!hasLocalFilter) {
      setTimeout(() => {
        this.paginator.length = this.totalCount;
      });
    }
  }

  private setApiDataFilter() {
    let hasFilter = false;
    // Initialize params to Api
    if (!this.tableConfig.api.params) {
      this.tableConfig.api.params = new HttpParams()
    }
    this.paginator.pageIndex = 0;
    this.tableConfig.api.params = this.tableConfig.api.params.append('page', (this.paginator.pageIndex + 1).toString()).append('limit', this.paginator.pageSize.toString());
    // Loop filters
    for (const filter of this.filterDefs) {
      // Check for api filters
      if (filter.filtertype === 'api') {
        if (!CanHelper.isEmpty(filter.selectedValue) && filter.selectedValue.toString().trim()) {
            if (filter.type === 'date') {
            if (filter.date && filter.date.enabledRange) {
              if (!filter.date.enabledTime) {
                filter.selectedValue[1].setHours(23, 59, 59, 999);
              }
              // Check api type
              if (this.apiService.getApiType(this.tableConfig.api) === ApiType.Loopback) {
                const range = { "between": [this.formatDate(filter.selectedValue[0]), this.formatDate(filter.selectedValue[1])] };
                this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, JSON.stringify(range));
              } else {
                const fromKey = filter.date.dateRange && filter.date.dateRange.keys ? filter.date.dateRange.keys.from : filter.key;
                const toKey = filter.date.dateRange && filter.date.dateRange.keys ? filter.date.dateRange.keys.to : filter.key;
                this.tableConfig.api.params = this.tableConfig.api.params.append(fromKey, this.formatDate(filter.selectedValue[0])).append(toKey, this.formatDate(filter.selectedValue[1]));
              }
            }
            else {
              if (!filter.date.enabledTime) {
                filter.selectedValue.setHours(0, 0, 0);
              }
              const startTime = new Date(filter.selectedValue);
              const endTime = new Date(new Date(filter.selectedValue).setHours(23, 59, 59));
              const range = { "between": [this.formatDate(startTime), this.formatDate(endTime)] };
              this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, JSON.stringify(range));
            }
          }
          if (filter.type === 'text') {
            if (filter.searchType === 'manual' || (filter.searchType === 'autocomplete' && filter.autoComplete.manualSelected)) {
              // Check for api type
              if (this.apiService.getApiType(this.tableConfig.api) === ApiType.Loopback) {
                this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' }));
              } else {
                this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, filter.selectedValue);
              }
            } else {
              // Check for api type
              if (this.apiService.getApiType(this.tableConfig.api) === ApiType.Loopback) {
              // this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, filter.selectedValue);
              this.tableConfig.api.params = isNaN(filter.selectedValue) && filter.selectedValue.split(' ').length > 1 ?this.tableConfig.api.params.append(filter.key,JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' })):this.tableConfig.api.params.append(filter.key, filter.selectedValue);

              // this.tableConfig.api.params = isNaN(parseInt(filter.selectedValue))?this.tableConfig.api.params.append(filter.key,JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' })):this.tableConfig.api.params.append(filter.key, filter.selectedValue);
              } else {
                this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, filter.selectedValue);
              }
            }
          }
          else {
          if (filter.type != 'date') {
              if(filter.multipleSelect){
                // this.tableConfig.api.params = this.tableConfig.api.params.append('or',JSON.stringify(
                //   {
                //     filter.key, 
                //     JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' })
                //   })) 
                const values = filter.selectedValue,or=[]
                for (let index = 0; index < values.length; index++) {
                  const filterObj = {}
                  filterObj[filter.key] ={"ilike":'%'+values[index]+'%'}
                  or.push(filterObj)    
                }
              this.tableConfig.api.params = this.tableConfig.api.params.append("or", JSON.stringify(or));

              }else{
              this.tableConfig.api.params = isNaN(filter.selectedValue) && filter.selectedValue.split(' ').length > 1 ?this.tableConfig.api.params.append(filter.key,JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' })):this.tableConfig.api.params.append(filter.key, filter.selectedValue);

                // this.tableConfig.api.params = this.tableConfig.api.params.append(filter.key, JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' }));
              }
            }
          }
          hasFilter = true;
        }
      }
    }
    return hasFilter;
  }

  // /**˝
  //  * 
  //  * @param removeFilter: boolean
  //  */
  // public applyApiDataFilter(removeFilter?: boolean,filter?:CanFilter) {
   
  //   if(!filter && !filter.multipleSelect){
  //     const hasFilter = this.setApiDataFilter();
  //     // If any filter is applied or removed, then process table data
  //     if (hasFilter || removeFilter) {
  //       this.processTableData();
  //     }
  //   }else if(removeFilter){
  //     this.applyPanelChange(false ,filter,true)
  //   }
  // }

    /**˝
   * 
   * @param removeFilter: boolean
   */
     public applyApiDataFilter(removeFilter?: boolean,filter?:CanFilter) {
      const hasFilter = this.setApiDataFilter();
      // If any filter is applied or removed, then process table data
      if (hasFilter || removeFilter) {
        this.processTableData();
      }
    }

  public applyPanelChange(event,filter : CanFilter,removeFilter?:boolean){
    if(filter && filter.multipleSelect && !event){
      const hasFilter = this.setApiDataFilter();
      // If any filter is applied or removed, then process table data
      if (hasFilter || removeFilter) {
        this.processTableData();
      }
    }else if(removeFilter){
      const hasFilter = this.setApiDataFilter();
      this.processTableData();

    }
  }
   /**˝
   * 
   * @param downloadFilter: boolean
   */
  public async applyApiDownloadFilter() {
    // Initiate Spineer
    this.downloadSpinner = true
    // Find Download Filter Def
    const filter = this.filterDefs.find(f => f.type === 'download');
    // Fetch Current Filters
    const filterKeys = this.tableConfig.api.params.keys();
    // Remove Extra Filters
    const pageIndex = filterKeys.indexOf('page');
    if (pageIndex >= 0) filterKeys.splice(pageIndex, 1);
    const limitIndex = filterKeys.indexOf('limit');
    if (limitIndex >= 0) filterKeys.splice(limitIndex, 1);
    // Validate if any required filter for download
    if (filter.download.requiredFilterKeys && filter.download.requiredFilterKeys.length) {
      for (let i = 0; i < filter.download.requiredFilterKeys.length; i++) {
        const filterKey = filter.download.requiredFilterKeys[i].key;
        const index = filterKeys.indexOf(filterKey);
        if (index < 0) {
          const key = filter.download.requiredFilterKeys[i].transformedKey ? filter.download.requiredFilterKeys[i].transformedKey : filter.download.requiredFilterKeys[i].key;
          this.notificationService.showError(`${key.toUpperCase()} filter should be selected!`);
          this.downloadSpinner = false;
          return;
        }
      }
    }
    // Append Current filter with download filter
    filterKeys.forEach(fKey => {
      if (filter.download.api.params) {
        // if (!filter.download.api.params.get(fKey)) {
        filter.download.api.params = filter.download.api.params.set(fKey, this.tableConfig.api.params.get(fKey));
        // }
      } else {
        filter.download.api.params = new HttpParams().set(fKey, this.tableConfig.api.params.get(fKey));
      }
    })
    // Download Data
    try {
      await this.tableDownloadService.download(filter.download);
      // Stop Spinner
      this.downloadSpinner = false;
    } catch (error) {
      // Stop Spinner
      this.downloadSpinner = false;
      throw error;
    }
  }

  /**
   * 
   * @param filterDef : Filter
   * @param spinner
   */
  public getAutocompletes(filterDef: CanFilter, spinner: any) {
    filterDef.autoComplete.minCharacters = filterDef.autoComplete.minCharacters ? filterDef.autoComplete.minCharacters : 1;
    // Initialize for autocomplete values
    filterDef.value = [];
    // Remove subscription
    if (this.autoCompleteSubscription) {
      this.autoCompleteSubscription.unsubscribe();
    }
    // Hide spinner
    spinner._elementRef.nativeElement.style.display = 'none';
    // Check for text
    if (filterDef.autoComplete && filterDef.autoComplete.autocompleteSearchText && filterDef.autoComplete.autocompleteSearchText.trim() && filterDef.autoComplete.autocompleteSearchText.length >= filterDef.autoComplete.minCharacters) {
      // Initialize params  
      if(!filterDef.autoComplete.api.params){
        filterDef.autoComplete.api.params = new HttpParams();
      }

      // Check for api type
      if (this.apiService.getApiType(filterDef.autoComplete.api) === ApiType.Loopback) {
        const objArr = [];
        for (const each of filterDef.autoComplete.autocompleteParamKeys) {
          const obj = {};
          obj[each] = { "ilike": '%' + filterDef.autoComplete.autocompleteSearchText + '%' };
          objArr.push(obj);
        }
        filterDef.autoComplete.api.params = filterDef.autoComplete.api.params.set('or', JSON.stringify(objArr));
      } else {
        filterDef.autoComplete.api.params = filterDef.autoComplete.api.params.set(filterDef.autoComplete.autocompleteParamKeys[0], filterDef.autoComplete.autocompleteSearchText);
      }

      // Visible spinner
      spinner._elementRef.nativeElement.style.display = 'block';
      // Get autocomplete list
      this.autoCompleteSubscription = this.apiService.request(filterDef.autoComplete.api).subscribe((res) => {
        // Initialize for autocomplete values
        filterDef.value = [];
        const data = CanHelper.mapValueWithApiKey(res, filterDef.autoComplete.apiDataKey);
        if (_.isArray(data)) {
          if(!data.length){
            this.notificationService.showSuccess('Data Not Found');
          }
          // Add values to particular format
          for (const each of data) {
            filterDef.value.push({ value: this.getValueWithApiKey(each, filterDef.autoComplete.apiValueKey), viewValue: this.getValueWithApiKey(each, filterDef.autoComplete.apiViewValueKey, filterDef.autoComplete.viewValueSeparators) });
          }
        }
        // Hide spinner
        spinner._elementRef.nativeElement.style.display = 'none';
      }, err => {
        // Hide spinner
        spinner._elementRef.nativeElement.style.display = 'none';
      })
    }
  }

  public getAutoCompletekeyEvent(event: any, filterDef: CanFilter): void {
    if (event.keyCode === 13 &&
      filterDef.autoComplete.freeTextSearch &&
      filterDef.autoComplete.autocompleteSearchText &&
      filterDef.autoComplete.autocompleteSearchText.trim() &&
      filterDef.autoComplete.autocompleteSearchText !== filterDef.selectedValue) {
      filterDef.selectedValue = filterDef.autoComplete.autocompleteSearchText;
      filterDef.autoComplete.manualSelected = true;
      this.applyApiDataFilter();
    }
  }


  /**
   * 
   * @param filterDef : Filter
   * @param value : ValueItem
   */
  public applyAutoCompleteFilter(filterDef: CanFilter, value: CanValueItem) {
    // Assign the autocomplete selected vale to filterDef
    filterDef.selectedValue = value.value;
    filterDef.autoComplete.manualSelected = false;
    // Apply the filter
    this.applyApiDataFilter();
  }

  /**
   * Check for local filter
   */
  private customFilterPredicate() {
    const myFilterPredicate = (data: any, filters: string): boolean => {
      // Parse filter object
      const filterObject = JSON.parse(filters);
      for (const eachFilter of filterObject) {
        let result = true;
        if (eachFilter.filtertype === 'local') {
          if (eachFilter.selectedValue && eachFilter.selectedValue.trim()) {
            result = false;
            // In case of particular fields
            if (eachFilter.keys && eachFilter.keys.length) {
              for (const eachKey of eachFilter.keys) {
                const value = this.getValueWithApiKey(data, eachKey);
                if (value && value.toString().toLowerCase().includes(eachFilter.selectedValue.toLowerCase())) {
                  result = true;
                  break;
                }
              }
            } else {
              // Check in all fields
              for (const eachKey of Object.keys(data)) {
                const value = this.getValueWithApiKey(data, eachKey);
                if (value && value.toString().toLowerCase().includes(eachFilter.selectedValue.toLowerCase())) {
                  result = true;
                  break;
                }
              }
            }
          }
        }
        if (!result) {
          return false;
        }
      }
      return true;
    }
    return myFilterPredicate;
  }

  /**
   * 
   * @param option :Value Item
   * 
   * It displays the value to be displayed on selected autocomplete filter
   */
  public displayFn(option: CanValueItem) {
    return option && option.viewValue ? option.viewValue : '';
  }

  /**
   * 
   * @param filterDef : Filter
   * 
   * Remove filter
   */
  public removeFilter(filterDef: CanFilter) {
    if (filterDef.filtertype === 'local') {
      filterDef.selectedValue = '';
      this.applyLocalDataFilter();
    } else {
      filterDef.selectedValue = undefined;
      if (filterDef.type === 'text' && filterDef.searchType === 'autocomplete') {
        // In case of autocomplete, make model value to empty
        filterDef.autoComplete.autocompleteSearchText = undefined;
      }
      if(filterDef.multipleSelect){
        this.tableConfig.api.params = this.tableConfig.api.params.delete("or");
      }else{
        this.tableConfig.api.params = this.tableConfig.api.params.delete(filterDef.key);
      }

      this.applyApiDataFilter(true);
    }
  }


  /**
   * 
   * @param data :object
   * @param fieldActionDef :FieldAction
   */
  public applyFieldAction(data: object, fieldActionDef: CanFieldAction, spinner: any) {
    // Output Field Action Data event to parent
    this.getFieldActionData.emit(data);
    // Ajax Type Action
    if (spinner && fieldActionDef.action.actionType === 'ajax') {
      // Visible spinner
      spinner._elementRef.nativeElement.style.display = 'inline-block';
    }
    this.actionService.applyAction(fieldActionDef.action, data).then((response) => {
      if (response) {
        this.processTableData().then(() => {
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



  /**
   * 
   * @param value : Date
   * 
   * format date for filter api
   */
  private formatDate(value: Date) {
    return value.toISOString();
  }

  /**
   * Check all rows selected or not
   */
  public isAllSelected() {
    return this.selection.selected.length === this.tableDataSource.data.length;
  }

  /** Selects all rows if they are not all selected; 
   * otherwise clear selection. */
  public masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.tableDataSource.data.forEach(row => this.selection.select(row));
  }

    /**
   * 
   * @param bulkFieldAction :CanBulkFieldAction
   */
  public applyBulkFieldAction(bulkFieldAction: CanBulkFieldAction) {
    console.log(this.tableConfig.api.params);
    // Check for value
    if (this.selection.hasValue()) {
      // Open confirm dialog
      this.dialogService.confirmDialog(bulkFieldAction.confirm).then((response) => {
        // Check for confirm dialog result
        if (response) {
          // Fetch Current Filters
          const filterKeys = this.tableConfig.api.params.keys();
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
              this.processTableData();
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
   * @param key :string
   */
  public getCurrencyValue(data: object, key: string) {
    // Get value
    const value = this.getValueWithApiKey(data, key);
    // Check whether value is number
    if (_.isNumber(parseFloat(value))) {
      // Return converted to float value
      return parseFloat(value);
    } else {
      return value;
    }
  }

  onScroll(event) {
    this.paginator.pageIndex = this.paginator.pageIndex + 1;
    this.processTableData();
  }
}


/**
 * ==================== HELPER FUNCTIONS ====================
 */

/**
 *
 * @param tableData:Table
 *
 * Filter Displayed Column Item
 */
function getDisplayedColumns(tableData: CanTable): Promise<string[]> {
  return new Promise<string[]>((resolve) => {
    const displayedColumns = [];
    // Add index column
    if (tableData.indexer) {
      displayedColumns.push('indexer');
    }
    // Add checkbox column in case of bulkaction
    if (tableData.bulkFieldAction && tableData.bulkFieldAction.length) {
      displayedColumns.push('bulkaction');
    }
    // Setting the Column Defs for Material Table
    tableData.displayedColumns.forEach((column, index) => {
      displayedColumns.push(column.header);
      if (index === tableData.displayedColumns.length - 1) {
        // In case of action fields
        if (tableData.fieldActions && tableData.fieldActions.length) {
          displayedColumns.push('action');
        }
        resolve(displayedColumns);
      }
    });
  });
}