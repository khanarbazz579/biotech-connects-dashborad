import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CanChart, CanChartType } from 'src/@can/types/chart.type';
import * as Highcharts from 'highcharts';
import { CanHelper } from 'src/@can/utils/helper.util';
import { CanApiService } from 'src/@can/services/api/api.service';
import { Subscription } from 'rxjs';
import { CanAutoUnsubscribe } from 'src/@can/decorators/auto-unsubscribe';
import { CanFieldAction } from 'src/@can/types/table.type';
import { CanActionService } from 'src/@can/services/action/action.service';
import { CanButton } from 'src/@can/types/shared.type';

@Component({
  selector: 'can-chart',
  templateUrl: './can-chart.component.html',
  styleUrls: ['./can-chart.component.scss']
})

// Unsubcribe all subscriptions automatically on ngOnDestroy
@CanAutoUnsubscribe
export class CanChartComponent implements OnInit {
  @Input() chartConfig: CanChart;

  // Passing API Response to Parent Component
  @Output() getData = new EventEmitter<any>(true);

  // Page Loader
  public isLoad: boolean;

  public dataSource: any;

  // Header Name
  public header: string;
  // Action defs for header
  public actionDef: CanFieldAction[];

  public footerActionDefs : CanButton[];

  private chart: any;

  // Subscriptions
  private chartSubscription: Subscription;

  // Options
  public options: any = {};

  constructor(private apiService: CanApiService,
    private actionService: CanActionService,) { }

  ngOnInit() {


  this.header = this.chartConfig.header;

  this.actionDef = this.chartConfig.action;

  this.footerActionDefs = this.chartConfig.footerAction;

    // Process chart data
    
    this.processChartData().then((res) => {
      if (this.dataSource) {
        this.createOptions();
        this.chart = Highcharts.chart('container', this.options);
      }
    });


      // Refresh chart Event 
      if (this.chartConfig.refreshEvent) {
        this.chartConfig.refreshEvent.subscribe(event => {
          if (event) {
      // Process chart data
        this.processChartData().then((res) => {
            if (this.dataSource) {
              this.createOptions();
              this.chart = Highcharts.chart('container', this.options);
            }
          });
          }
        })
      }
  }

  /**
   * Process Data
   */
  private processChartData(): Promise<boolean> {
    return new Promise((resolve) => {
      // Page Loader Start
      this.isLoad = true;
      // Checking Default Data Source Existence
      if (this.chartConfig.dataSource) {
        // Assigning data
        this.dataSource = this.chartConfig.dataSource;
        // Emit Data to Parent
        this.getData.emit(this.dataSource);
        // Page Loader Stop
        this.isLoad = false;
        // Resolving Promise
        resolve(true);
      } else { // If No Default Data Source Then Call API
        // Api Call
        this.chartSubscription = this.apiService.get(this.chartConfig.api)
          .subscribe(res => {
            if (res) {
              // Assigning data
              this.dataSource = CanHelper.mapValueWithApiKey(res, this.chartConfig.apiDataKey);
              // Emit Data to Parent
              this.getData.emit(this.dataSource);
            }
            // Page Loader Stop
            this.isLoad = false;
            // Resolving Promise
            resolve(true);
          }, (err) => {
            // Page Loader Stop
            this.isLoad = false;
          });
      }

    });
  }




  /**
   * Resize event
   */
  public onResize(): void {
    this.chart.reflow();
  }

  /**
   * Create options
   */
  private createOptions(): void {
    // Init options
    this.options = {};
    if (this.chartConfig.options) {
      // Set title
      this.setTitle();
      // Set subtitle
      this.setSubtitle();
      // Set legend
      this.setLegend()
    }
    // Set other options
    this.setOtherChartOptions()
    // Remove highcharts credits
    this.options.credits = { enabled: false };
  }

  /**
   * Set other chart options
   */
  private setOtherChartOptions(): void {
    // Init chart options
    this.options.chart = {};
    // Check chart type
    switch (this.chartConfig.type) {
      case CanChartType.Line:
        this.options.chart.type = 'line';
        break;
      case CanChartType.Area:
        this.options.chart.type = 'area';
        break;
      case CanChartType.Bar:
        this.options.chart.type = 'bar';
        break;
      case CanChartType.Column:
        this.options.chart.type = 'column';
        break;
      case CanChartType.Pie:
        this.options.chart.type = 'pie';
        break;
      case CanChartType.Donut:
        this.options.chart.type = 'pie';
        break;
      default:
        break;
    }
    // create series
    this.createSeries(this.chartConfig.type);
  }

  /**
   * Set Title
   */
  private setTitle(): void {
    // Check for title
    if (this.chartConfig.options.title) {
      // Set title
      this.options.title = this.chartConfig.options.title;
    }

  }


  /**
   * Set Subtitle
   */
  private setSubtitle(): void {
    // Check for title
    if (this.chartConfig.options.subtitle) {
      // Set title
      this.options.subtitle = this.chartConfig.options.subtitle;
    }
  }

  /**
   * Set Legend
   */
  private setLegend(): void {
    // Check for title
    if (this.chartConfig.options.legend) {
      // Set title
      this.options.legend = this.chartConfig.options.legend;
    }
  }

  /**
   * 
   * @param chartType :CanChartType
   */
  private createSeries(chartType: CanChartType): void {
    // Init series
    this.options.series = [];
    // CHeck for datasource
    if (this.dataSource) {
      // Get keys
      const keys = Object.keys(this.dataSource);
      // Loop keys
      keys.forEach((key, i) => {
        // Check for index and type 
        if (i > 0 && (chartType === CanChartType.Donut || chartType === CanChartType.Pie)) {
          return;
        }
        // Defs data
        const data = this.dataSource[key];
        let seriesData = [];
        // Loop data
        data.forEach((obj) => {
          // Get keys
          const pK = Object.keys(obj);
          // Init value
          let value;
          // Check for chart type
          if (chartType === CanChartType.Pie || chartType === CanChartType.Donut) {
            // Set value
            value = { name: pK[0], y: obj[pK[0]] };
          } else {
            // Set value
            value = obj[pK[0]]?obj[pK[0]]:obj;
            // Check for index
            if (i === 0) {
              // Check for xAxis
              if (!this.options.xAxis) {
                // Init xAxis
                this.options.xAxis = {};
              }
              // Check for categories
              if (!this.options.xAxis.categories) {
                // Init categories
                this.options.xAxis.categories = []
              }
              // Add a key to categories
              if(obj['category']){
              this.options.xAxis.categories.push(obj['category']);
              }
              // this.options.xAxis.categories.push(pK[0]);
            }
          }
          // Add data to seriesData
          seriesData.push(value);
        });
        // Defs series
        const resultantSeries = { name: key, data: seriesData }
        // Check for donut
        if (chartType === CanChartType.Donut) {
          resultantSeries['innerSize'] = '50%';
        }
        // Add to series
        this.options.series.push(resultantSeries);
      })
    }
  }
   /**
   * Apply action
   */
  public applyAction(action) {
    this.actionService.applyAction(action, this.dataSource).then((response: boolean) => {
      if (response) {
        // Reload data
        this.processChartData();
      }
    });
  }
  //    /**
  //  * 
  //  * @param data :object
  //  * @param fieldActionDef :FieldAction
  //  */
  // public applyFieldAction(data: object, fieldActionDef: CanFieldAction, spinner: any) {
  //   if (spinner && fieldActionDef.action.actionType === 'ajax') {
  //     // Visible spinner
  //     spinner._elementRef.nativeElement.style.display = 'inline-block';
  //   }
  //   this.actionService.applyAction(fieldActionDef.action, data).then((response) => {
  //     if (response) {
  //       this.processChartData().then(() => {
  //         if (spinner && spinner._elementRef.nativeElement.style.display !== 'none') {
  //           // Hide spinner
  //           spinner._elementRef.nativeElement.style.display = 'none';
  //         }
  //       });
  //     } else {
  //       if (spinner && spinner._elementRef.nativeElement.style.display !== 'none') {
  //         // Hide spinner
  //         spinner._elementRef.nativeElement.style.display = 'none';
  //       }
  //     }
  //   });
  // }

}
