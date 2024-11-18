import { CanApi } from "./api.type";
import { CanFieldAction } from "./table.type";
import { CanButton } from "./shared.type";
import { EventEmitter } from "@angular/core";

export interface CanChart {
  type: CanChartType;
  options?: CanChartOptions;
  api?: CanApi;
  dataSource?: object;
  apiDataKey?: string;
  header?: string;
  action?: CanFieldAction[];
  footerAction?: CanButton[];
  refreshEvent?: EventEmitter<boolean>;
}

export enum CanChartType {
  Line = 1,
  Area = 2,
  Bar = 3,
  Column = 4,
  Pie = 5,
  Donut = 6,
}

export interface CanChartOptions {
  title?: {
    text: string;
    verticalAlign?: "top" | "bottom";
  };
  subtitle?: {
    text: string;
    verticalAlign?: "top" | "bottom";
  };
  legend?: {
    enabled: boolean;
    align: "right" | "left";
    verticalAlign: "top" | "bottom" | "middle";
    layout: "horizontal" | "vertical" | "proximate";
  };
  tooltip?: {
    shared?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
  };
  xAxis?: {
    categories?: string[];
    title?: {
      text: string;
    };
  };
  yAxis?: {
    title?: {
      text: string;
    };
  };
}
