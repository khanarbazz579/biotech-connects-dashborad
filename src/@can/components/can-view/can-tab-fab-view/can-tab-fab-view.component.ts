import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CanTab } from 'src/@can/types/tab-view.type';
import { CanFabButton } from 'src/@can/types/fab-button.type';

@Component({
  selector: 'can-tab-fab-view',
  templateUrl: './can-tab-fab-view.component.html',
  styleUrls: ['./can-tab-fab-view.component.scss']
})
export class CanTabFabViewComponent implements OnInit {
  @Input() tabViewConfig: CanTab;
  @Input() fabButtonConfig: CanFabButton;
  @Input() header: string;
  public selectedTabIndex: number;

  public displayTab = true;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  reloadContent(reload: boolean) {
    if (reload) {
      this.displayTab = false;
      this.changeDetector.detectChanges();
      this.displayTab = true;
    }
  }
}
