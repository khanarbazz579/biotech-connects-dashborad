import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Injector, Output, EventEmitter } from '@angular/core';
import { CanTabView, CanTab, CanTabInputItem } from 'src/@can/types/tab-view.type';
import { MatTabGroup } from '@angular/material';
import { CanTabItemComponent } from './can-tab-item/can-tab-item.component';

@Component({
  selector: 'can-tab-view',
  templateUrl: './can-tab-view.component.html',
  styleUrls: ['./can-tab-view.component.scss']
})
export class CanTabViewComponent implements OnInit, AfterViewInit {
  // Getting Config from Parent Component
  @Input() tabViewConfig: CanTabView;

  @Output() tabIndexChanged = new EventEmitter<any>(true);

  @Input() selectedIndex: number;

  // Tabs
  public tabs: CanTab[];

  // Check for loaded tab
  public loaded = [];

  // Lazyloading
  public lazyLoading: boolean;

  public Injector = Injector;

  public component = CanTabItemComponent;

  public injectors = [];

  // Tab group element for changing css
  @ViewChild('tabGroup', { static: false }) tabGroup: MatTabGroup;

  constructor(private inj: Injector) { }

  ngOnInit() {
    this.selectedIndex = this.selectedIndex ? this.selectedIndex : 0;
    // Defs' tabs
    this.tabs = this.tabViewConfig.tabs;
    // Defs' lazyLoading
    this.lazyLoading = this.tabViewConfig.lazyLoading;
    // Set tab to be loaded
    this.loaded[this.selectedIndex] = true;
    // Set injectors
    for (const eachTab of this.tabs) {
      this.injectors.push(Injector.create([
        { provide: 'tabContentInjector', useValue: eachTab }
      ], this.inj))
    }
  }

  ngAfterViewInit(): void {
    // Check for tabGroup element
    if (this.tabGroup) {
      // Set Color
      if (this.tabViewConfig.color) {
        this.tabGroup.color = this.tabViewConfig.color;
      }

      // Set Background Color
      if (this.tabViewConfig.backgroundColor) {
        this.tabGroup.backgroundColor = this.tabViewConfig.backgroundColor;
      }

    }
  }

  /**
   * 
   * @param index :number
   * Tab change event
   */
  tabChanged(index: number) {
    // Check for tab loading state
    if (!this.loaded[index]) {
      this.loaded[index] = true;
    }
    // Check for loadsEveryTime
    if (this.tabViewConfig.loadsEveryTime) {
      for (let i = 0; i < this.loaded.length; i++) {
        if (i !== index) {
          this.loaded[i] = false;
        }
      }
    }
    this.tabIndexChanged.next(index);
  }
}
