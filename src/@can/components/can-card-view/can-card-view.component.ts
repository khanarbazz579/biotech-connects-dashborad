import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewChecked, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CanCardView, CanCardValueItem, CanCardActionButton, CanCardImage } from 'src/@can/types/card-view.type';
import { Subscription } from 'rxjs';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanHelper } from 'src/@can/utils/helper.util';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CanActionService } from 'src/@can/services/action/action.service';
import { CanAutoUnsubscribe } from 'src/@can/decorators/auto-unsubscribe';
import { CanAction, CanConditionConfig } from 'src/@can/types/shared.type';
import { DatePipe } from '@angular/common';
import { CanImage } from 'src/@can/types/image.type';

// NPM Packages
import * as _ from 'underscore';
import { CanBreakpointObserverService } from 'src/@can/services/breakpoint-observer/breakpoint-observer.service';
import { HttpParams } from '@angular/common/http';
import { CanConditionValidationService } from 'src/@can/services/condition-validation/condition-validation.service';

@Component({
  selector: 'can-card-view',
  templateUrl: './can-card-view.component.html',
  styleUrls: ['./can-card-view.component.scss'],
  animations: [trigger('indicatorRotate', [
    state('collapsed', style({ transform: 'rotate(0deg)' })),
    state('expanded', style({ transform: 'rotate(180deg)' })),
    transition('expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
    ),
  ])]

})

// Unsubcribe all subscriptions automatically on ngOnDestroy
@CanAutoUnsubscribe
export class CanCardViewComponent implements OnInit, AfterViewChecked {
  windowScrolled: boolean = false;
  @ViewChild('cardContainer', { static: false }) private cardContainer: ElementRef;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  // Card View Config
  @Input() cardViewConfig: CanCardView;

  // Data Source
  public dataSource: Array<object>;

  // Data
  public data: any;

  // Page Loader
  public isLoad: boolean;

  // Check for content Expand
  public expanded: Array<boolean> = [];

  // Column Per Row
  public columnPerRow: number;

  public _ = _;

  public isSmallScreen: boolean;

  public scrollDisabled: boolean = false;

  public scrolled: boolean;

  public page: number = 1;

  // Action Buttons
  public actionButtons: CanCardActionButton[];

  // Passing API Response to Parent Component
  @Output() getData = new EventEmitter<any>(true);

  // Passing Action Data to Parent Component
  @Output() getActionData = new EventEmitter<any>(true);

  // Subscriptions
  private cardViewSubscription: Subscription;


  constructor(private apiService: CanApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private actionService: CanActionService,
    private datePipe: DatePipe,
    private breakpointObserverService: CanBreakpointObserverService,
    private conditionValidationService: CanConditionValidationService) { }

  ngOnInit() {
    // Def's action buttons
    this.actionButtons = this.cardViewConfig.actionButtons ? this.cardViewConfig.actionButtons : [];
    // Defs' columnPerRow
    this.columnPerRow = this.cardViewConfig.columnPerRow || 1;
    if (!this.cardViewConfig.isArray || !this.cardViewConfig.apiLimit || this.cardViewConfig.dataSource) {
      this.scrollDisabled = true;
    }
    // Screen Size
    this.breakpointObserverService.isSmallScreen.subscribe((res) => {
      this.isSmallScreen = res;
    });
    // Process Data
    this.processCardViewData();
     // Refresh Table Event 
     if (this.cardViewConfig.refreshEvent) {
      this.cardViewConfig.refreshEvent.subscribe(event => {
        if (event) {
          // Refresh Table Data
          this.processCardViewData();
        }
      })
    }
  }

  ngAfterViewChecked() {
    // Detect changes
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Process card view dsta
   */
  private processCardViewData(): void {
    this.processData().then((res) => {
      // Check for array
      if (!this.cardViewConfig.isArray) {
        this.dataSource = [this.data];
        this.columnPerRow = 1;
      } else {
        this.dataSource = this.data;
      }
    });
  }

  /**
   * Process Data
   */
  private processData(): Promise<boolean> {
    return new Promise((resolve) => {
      // Checking Default Data Source Existence
      if (this.cardViewConfig.dataSource) {
        // Assigning data
        this.data = this.cardViewConfig.dataSource;
        // Emit Data to Parent
        this.getData.emit(this.data);
        // Resolving Promise
        resolve(true);
      } else { // If No Default Data Source Then Call API
        // Start Loader
        this.isLoad = true;
        if (this.cardViewConfig.apiLimit) {
          if (!this.cardViewConfig.api.params) {
            this.cardViewConfig.api.params = new HttpParams();
          }
          // Set page and page limit
          this.cardViewConfig.api.params = this.cardViewConfig.api.params
            .set('page', this.page.toString())
            .set('limit', this.cardViewConfig.apiLimit.toString());
        }
        // Api Call
        this.cardViewSubscription = this.apiService.get(this.cardViewConfig.api)
          .subscribe(res => {
            if (res) {
              // Assigning data
              const data = CanHelper.mapValueWithApiKey(res, this.cardViewConfig.apiDataKey);

              if (this.page > 1 && this.data && _.isArray(this.data) && this.data.length && _.isArray(data)) {
                data.forEach(element => {
                  this.data.push(element);
                });
              } else {
                this.data = data;
              }

              if (!this.scrollDisabled) {
                if (_.isArray(this.data)) {
                  if (this.data.length < this.cardViewConfig.apiLimit) {
                    this.scrollDisabled = true;
                  }
                } else {
                  this.scrollDisabled = true;
                }
                this.page = this.page + 1;
              }
              // Emit Data to Parent
              this.getData.emit(this.data);
            }
            // Stop Loader
            this.isLoad = false;
            // Resolving Promise
            resolve(true);
          }, err => {
            // Stop Loader
            this.isLoad = false;
          });
      }
    });
  }

  /**
   * 
   * @param cardValueItem :CanCardValueItem
   * Get value
   */
  public getValue(cardValueItem: CanCardValueItem, dataSource: object) {
    let value: any;
    // Check for cardValueItem
    if (cardValueItem) {
      // Check for cardValueItem type      
      if (cardValueItem.valueType === 'fixed') {
        value = cardValueItem.value;
      } else if (cardValueItem.valueType === 'dynamic') {
        value = CanHelper.mapDynamicTextWithApiKey(dataSource, cardValueItem.dynamicText);
     
      } else {
        value = CanHelper.getValueWithApiKey(dataSource, cardValueItem.key, cardValueItem.keySeparators);
      }

      // Set for date
      if (value && cardValueItem.type === 'date') {
        // Check for displayDateType
        // if(cardValueItem.valueType === 'dynamic'){
        //   if(isNaN(Date.parse(value))){
        //    let values = value.split(' ');
        //    for (let index = 0; index < values.length; index++) {
        //      if(!isNaN(Date.parse(values[index]))){
        //        let dateValue;
        //       if (cardValueItem.displayDateType) {
        //          dateValue = this.datePipe.transform(values[index], cardValueItem.displayDateType)
        //       }else{
        //          dateValue = this.datePipe.transform(values[index],  "dd/MM/yy hh:mm:ss")
        //       }
        //       value = value.replace(values[index],dateValue);
        //     }
        //    } 
        //   }
        // } else 
        
        if (cardValueItem.displayDateType) {
          value = this.datePipe.transform(value, cardValueItem.displayDateType)
        } else {
          value = this.datePipe.transform(value, "dd/MM/yy hh:mm:ss")
        }
      }

    }
    return value;
  }

  /**
   * 
   * @param cardValueItem :CanCardValueItem
   * @param dataSource :object
   * Get value after adding prefix and suffix
   */
  getValueWithSuffixAndPrefix(cardValueItem: CanCardValueItem, dataSource: object): string {
    if (!cardValueItem) {
      return '';
    }
    let value = this.getValue(cardValueItem, dataSource);
    // Check for prefix
    if (cardValueItem.prefix) {
      value = cardValueItem.prefix + value;
    }
    // Check for suffix
    if (cardValueItem.suffix) {
      value = value + cardValueItem.suffix;
    }
    return value;
  }

  /**
   * 
   * @param action :CanAction
   * Apply action
   */
  public applyAction(action: CanAction, dataSource: object): void {
    this.getActionData.emit(dataSource);
    this.actionService.applyAction(action, dataSource).then((response: boolean) => {
      // Check for response
      if (response) {
        this.page = 1;
        // Reload data
        this.processCardViewData();
      }
    });
  }

  /**
   * 
   * @param cardContent 
   * @param i : number
   */
  public expandableIcon(cardContent: any, i: number): boolean {
    let show = false;
    // Check for cardContent
    if (cardContent) {
      // Check for expanded
      if (this.expanded[i]) {
        // Set value to true
        show = true;
      } else {
        // Set value
        show = cardContent.clientHeight < cardContent.scrollHeight;
      }
    }
    return show;
  }

  /**
   * 
   * @param image :CanCardImage
   * @param dataSource :object
   */
  public createImagesData(image: CanCardImage, dataSource: object) {
    // Init imagesData
    const imagesData: CanImage[] = [];
    // Loop on image items
    image.images.forEach(element => {
      // Get value
      const value = this.getValue(element, dataSource);
      // Check for value 
      if (value) {
        // Check whether its an array using config
        if (element.isArray) {
          // Check whether its an array 
          if (_.isArray(value)) {
            // Loop value
            value.forEach(val => {
              // Get image value
              const image = CanHelper.mapValueWithApiKey(val, element.imageApiKey)
              // Check for image value
              if (image) {
                // Create image data
                const imageData: CanImage = {
                  image: {
                    src: image,
                    alt: element.imageAlt
                  }
                }
                // Push the image data
                imagesData.push(imageData);
              }
            });
          }
        } else {
          // Create image data
          const imageData: CanImage = {
            image: {
              src: value,
              alt: element.imageAlt
            }
          }
          // Push the image data
          imagesData.push(imageData);
        }
      }
    });
    // Return imagesData
    return imagesData;
  }

  onScroll(event) {
    this.processCardViewData();
  }

  gotToTop() {
    this.cardContainer.nativeElement.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

  }

  checkScroll(event) {
    if (event && event.target.scrollTop > 0) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
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


}
