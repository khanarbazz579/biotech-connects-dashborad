import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CanApiService } from "src/@can/services/api/api.service";
import { CanApi } from "src/@can/types/api.type";
import * as moment from "moment";

// import * as Highcharts from 'highcharts';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  //   Highcharts: typeof Highcharts = Highcharts;
  //   chartOptions: {};

  public properties = [];
  public propertyId: any = 1;
  public dates;
  public today = moment().format("MM/DD/YYYY");
  public selectedDate: any = {
    from: moment().startOf("month"),
    to: moment().endOf("month"),
  };

  constructor(
    private apiService: CanApiService,
    private ref: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.getProperty();

    this.dates = [
      {
        date: {
          from: moment().subtract(2, "years").startOf("month"),
          to: moment().endOf("month"),
        },
        type: "Current month",
      },
      {
        date: {
          from: moment().subtract(1, "months").startOf("month"),
          to: moment().subtract(1, "months").endOf("month"),
        },
        type: "Previous month",
      },
      {
        date: {
          from: moment().subtract(2, "months").startOf("month"),
          to: moment().endOf("month"),
        },
        type: "Last 3 months",
      },
    ];
    // this.dates = [
    //   {
    //     date: {
    //       from: moment().subtract(7, "days"),
    //       to: moment().subtract(1, "days"),
    //     },
    //     type: "Current Week",
    //   },
    //   {
    //     date: {
    //       from: moment().subtract(14, "days"),
    //       to: moment().subtract(7, "days"),
    //     },
    //     type: "Previous week",
    //   },
    //   {
    //     date: {
    //       from: moment().subtract(2, "months").startOf("month"),
    //       to: moment().endOf("month"),
    //     },
    //     type: "Last 3 months",
    //   },
    // ];
    // BankList Get APi
    await this.getProperty();
  }

  getProperty() {
    return new Promise((resolve, reject) => {
      const getProperties: CanApi = {
        apiPath: "/properties",
        method: "GET",
      };
      this.apiService.request(getProperties).subscribe((res: any[]) => {
        this.properties = res;
        this.ref.detectChanges();
        resolve(res);
      });
    });
  }
}
// this.chartOptions =  {
//     chart: {
//         type: 'area'
//     },
//     title: {
//         text: 'Historic and Estimated Worldwide Population Growth by Region'
//     },
//     subtitle: {
//         text: 'Source: Wikipedia.org'
//     },
//     xAxis: {
//         categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
//         tickmarkPlacement: 'on',
//         title: {
//             enabled: false
//         }
//     },
//     yAxis: {
//         title: {
//             text: 'Billions'
//         },
//         labels: {
//             formatter: function () {
//                 return this.value / 1000;
//             }
//         }
//     },
//     tooltip: {
//         split: true,
//         valueSuffix: ' millions'
//     },
//     plotOptions: {
//         area: {
//             stacking: 'normal',
//             lineColor: '#666666',
//             lineWidth: 1,
//             marker: {
//                 lineWidth: 1,
//                 lineColor: '#666666'
//             }
//         }
//     },
//     series: [{
//         name: 'Asia',
//         data: [502, 635, 809, 947, 1402, 3634, 5268]
//     }, {
//         name: 'Africa',
//         data: [106, 107, 111, 133, 221, 767, 1766]
//     }, {
//         name: 'Europe',
//         data: [163, 203, 276, 408, 547, 729, 628]
//     }, {
//         name: 'America',
//         data: [18, 31, 54, 156, 339, 818, 1201]
//     }, {
//         name: 'Oceania',
//         data: [2, 2, 2, 6, 13, 30, 46]
//     }]
// }
