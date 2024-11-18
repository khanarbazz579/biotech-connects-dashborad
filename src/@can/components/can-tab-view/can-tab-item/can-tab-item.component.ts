import { Component, OnInit, Inject, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { CanTab } from 'src/@can/types/tab-view.type';

@Component({
  selector: 'can-tab-item',
  templateUrl: './can-tab-item.component.html',
  styleUrls: ['./can-tab-item.component.scss']
})
export class CanTabItemComponent implements OnInit {

  @ViewChild('displayComponent', { static: true, read: ViewContainerRef }) displayComponent: ViewContainerRef;

  constructor(@Inject('tabContentInjector') private tabContent: CanTab,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.createDynamicComponent();
  }

  /**
  * Create Dynamic Component based on Config
  */
  public createDynamicComponent(): void {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.tabContent.component);
    let componentRef = this.displayComponent.createComponent(componentFactory);
    if (this.tabContent.inputData && this.tabContent.inputData.length) {
      for (const each of this.tabContent.inputData) {
        componentRef.instance[each.key] = each.value;
      }
    }
  }
}
