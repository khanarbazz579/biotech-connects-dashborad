export interface CanTabView {
   tabs: CanTab[];
   color? : 'primary' | 'accent' | 'warn';
   backgroundColor? : 'primary' | 'accent' | 'warn';
   lazyLoading: boolean;
   loadsEveryTime?: boolean;
}

export interface CanTab {
    component: any;
    label: string;
    inputData?: CanTabInputItem[];
}

export interface CanTabInputItem {
    key: string;
    value: any;
}