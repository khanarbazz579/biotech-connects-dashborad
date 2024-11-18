import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  CanMiniCardView,
  CanCardActionButton,
  CanMiniCardItem,
} from "src/@can/types/mini-card.type";
import { CanApiService } from "src/@can/services/api/api.service";
import { CanActionService } from "src/@can/services/action/action.service";
import { DatePipe } from "@angular/common";
import { CanBreakpointObserverService } from "src/@can/services/breakpoint-observer/breakpoint-observer.service";
import { CanAction } from "src/@can/types/shared.type";
import { Subscription } from "rxjs";
import { CanHelper } from "src/@can/utils/helper.util";

import * as _ from "underscore";
import { CanFieldAction } from 'src/@can/types/table.type';

@Component({
  selector: "can-mini-card",
  templateUrl: "./can-mini-card.component.html",
  styleUrls: ["./can-mini-card.component.scss"],
})
export class CanMiniCardComponent implements OnInit {
  // Mini Card Config
  @Input() miniCardConfig: CanMiniCardView;

  // Underscore Package
  public _ = _;

  // Data Source
  public dataSource: Array<object>;

  public headerActionDefs: CanFieldAction[];

  // Page Loader
  public isLoad: boolean;

  // Action Buttons
  public actionButtons: CanCardActionButton[];

  // Screen Observer
  public isSmallScreen: boolean;

  // Passing API Response to Parent Component
  @Output() getData = new EventEmitter<any>(true);

  // Passing Action Data to Parent Component
  @Output() getActionData = new EventEmitter<any>(true);

  // Subscriptions
  private miniCardViewSubscription: Subscription;

  constructor(
    private apiService: CanApiService,
    private actionService: CanActionService,
    private datePipe: DatePipe,
    private breakpointObserverService: CanBreakpointObserverService
  ) {}

  ngOnInit() {
    this.headerActionDefs = this.miniCardConfig.headerAction;
    // Def's action buttons
    this.actionButtons = this.miniCardConfig.actionButtons
      ? this.miniCardConfig.actionButtons
      : [];
    // Screen Size
    this.breakpointObserverService.isSmallScreen.subscribe((res) => {
      this.isSmallScreen = res;
    });
    // Process Data
    this.processData();

      // Refresh Card Event 
      if (this.miniCardConfig.refreshEvent) {
        this.miniCardConfig.refreshEvent.subscribe(event => {
          if (event) {
            // Refresh Data
            this.processData();

          }
        })
      }
  }

  /**
   * Process Data
   */
  private processData(): Promise<boolean> {
    return new Promise((resolve) => {
      // Checking Default Data Source Existence
      if (this.miniCardConfig.dataSource) {
        // Assigning data
        this.dataSource = this.miniCardConfig.dataSource;
        // Emit Data to Parent
        this.getData.emit(this.dataSource);
        // Resolving Promise
        resolve(true);
      } else {
        // If No Default Data Source Then Call API
        // Start Loader
        this.isLoad = true;
        // Api Call
        this.miniCardViewSubscription = this.apiService
          .get(this.miniCardConfig.api)
          .subscribe(
            (res) => {
              if (res) {
                // Assigning data
                const data = CanHelper.mapValueWithApiKey(
                  res,
                  this.miniCardConfig.apiDataKey
                );
                this.dataSource = data;
              }
              // Emit Data to Parent
              this.getData.emit(this.dataSource);
              // Stop Loader
              this.isLoad = false;
              // Resolving Promise
              resolve(true);
            },
            (err) => {
              // Stop Loader
              this.isLoad = false;
            }
          );
      }
    });
  }

  /**
   *
   * @param cardValueItem :CanCardValueItem
   * Get value
   */
  public getValueWithApiKey(miniCardItem: CanMiniCardItem, dataSource: object) {
    let value: any = "";
    // Check for cardValueItem
    if (miniCardItem) {
      value = CanHelper.getValueWithApiKey(
        dataSource,
        miniCardItem.value,
        miniCardItem.keySeparators
      );
      return value;
    }
    return value;
  }

  /**
   *
   * @param cardValueItem :CanCardValueItem
   * @param dataSource :object
   * Get value after adding prefix and suffix
   */
  getValueWithSuffixAndPrefix(
    cardValueItem: CanMiniCardItem,
    dataSource: object
  ): string {
    if (!cardValueItem) {
      return "";
    }
    let value = this.getValueWithApiKey(cardValueItem, dataSource);
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
    this.actionService
      .applyAction(action, dataSource)
      .then((response: boolean) => {
        // Check for response
        if (response) {
          // Reload data
          this.processData();
        }
      });
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
        this.processData().then(() => {
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
}
