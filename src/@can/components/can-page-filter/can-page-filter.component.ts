import { Component, OnInit, Input, } from "@angular/core";
import { Subscription } from 'rxjs';
import { CanActionService } from 'src/@can/services/action/action.service';
import { CanApiService } from "src/@can/services/api/api.service";
import { CanFilter } from 'src/@can/types/dashboard-view.type';
import { CanDashboard } from 'src/@can/types/dashboard-view.type';
import { HttpParams } from '@angular/common/http';
import {  CanValueItem } from 'src/@can/types/shared.type';
import * as _ from 'underscore';

// Angular Material
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ApiType } from 'src/@can/types/api.type';
import { CanHelper } from 'src/@can/utils/helper.util';



@Component({
  selector: 'can-page-filter',
  templateUrl: './can-page-filter.component.html',
  styleUrls: ['./can-page-filter.component.scss']
})
export class CanPageFilterComponent implements OnInit {

  @Input() dashboardConfig: CanDashboard;
    // Underscore Package
    public _ = _;

  public filterDefs: CanFilter[];
  public header: string;
  public tableDataSource: MatTableDataSource<any>;
  private autoCompleteSubscription: Subscription;

  constructor(
    private apiService: CanApiService,
    private actionService: CanActionService,
  ) { }

  ngOnInit() {
     // Header
     this.header = this.dashboardConfig.header;
         // Filter Item Definitons
    this.filterDefs = this.dashboardConfig.filters;
    // if (this.filterDefs && this.filterDefs.length) {
    //   // apply set api filter
    //   this.setApiDataFilter();
    // }
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
  }
    // If local filter not found, paginator length
  //   if (!hasLocalFilter) {
  //     setTimeout(() => {
  //       this.paginator.length = this.totalCount;
  //     });
  //   }
  // }

  public setApiDataFilter() {
    let hasFilter = false;
    // Initialize params to Api
    if (!this.dashboardConfig.api.params) {
      this.dashboardConfig.api.params = new HttpParams()
    }
    // this.paginator.pageIndex = 0;
    // this.dashboardConfig.api.params = this.dashboardConfig.api.params.append('page', (this.paginator.pageIndex + 1).toString()).append('limit', this.paginator.pageSize.toString());
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
              if (this.apiService.getApiType(this.dashboardConfig.api) === ApiType.Loopback) {
                const range = { "between": [this.formatDate(filter.selectedValue[0]), this.formatDate(filter.selectedValue[1])] };
                this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, JSON.stringify(range));
              } else {
                const fromKey = filter.date.dateRange && filter.date.dateRange.keys ? filter.date.dateRange.keys.from : filter.key;
                const toKey = filter.date.dateRange && filter.date.dateRange.keys ? filter.date.dateRange.keys.to : filter.key;
                this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(fromKey, this.formatDate(filter.selectedValue[0])).append(toKey, this.formatDate(filter.selectedValue[1]));
              }
            }
            else {
              if (!filter.date.enabledTime) {
                filter.selectedValue.setHours(0, 0, 0);
              }
              const startTime = new Date(filter.selectedValue);
              const endTime = new Date(new Date(filter.selectedValue).setHours(23, 59, 59));
              const range = { "between": [this.formatDate(startTime), this.formatDate(endTime)] };
              this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, JSON.stringify(range));
            }
          }
          if (filter.type === 'text') {
            if (filter.searchType === 'manual' || (filter.searchType === 'autocomplete' && filter.autoComplete.manualSelected)) {
              // Check for api type
              if (this.apiService.getApiType(this.dashboardConfig.api) === ApiType.Loopback) {
                this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, JSON.stringify({ "ilike": '%' + filter.selectedValue + '%' }));
              } else {
                this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, filter.selectedValue);
              }
            } else {
              // Check for api type
              if (this.apiService.getApiType(this.dashboardConfig.api) === ApiType.Loopback) {
                this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, filter.selectedValue);
              } else {
                this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, filter.selectedValue);
              }
            }
          }
          else {
            if (filter.type != 'date') {
              this.dashboardConfig.api.params = this.dashboardConfig.api.params.append(filter.key, filter.selectedValue);
            }
          }
          hasFilter = true;
        }
      }
    }
    return hasFilter;
  }

  /**˝
   * 
   * @param removeFilter: boolean
   */
  // public applyApiDataFilter(removeFilter?: boolean) {
  //   const hasFilter = this.setApiDataFilter();
  //   // If any filter is applied or removed, then process table data
  //   if (hasFilter || removeFilter) {
  //     this.processTableData();
  //   }
  // }

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
      filterDef.autoComplete.api.params = new HttpParams();

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
      // this.applyApiDataFilter();
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
    // this.applyApiDataFilter();
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
      this.dashboardConfig.api.params = this.dashboardConfig.api.params.delete(filterDef.key);
      // this.applyApiDataFilter(true);
    }
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
  // }

}
