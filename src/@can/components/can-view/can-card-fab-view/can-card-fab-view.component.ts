import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CanCardView } from 'src/@can/types/card-view.type';
import { CanFabButton } from 'src/@can/types/fab-button.type';

@Component({
  selector: 'can-card-fab-view',
  templateUrl: './can-card-fab-view.component.html',
  styleUrls: ['./can-card-fab-view.component.scss']
})
export class CanCardFabViewComponent implements OnInit {
  @Input() cardViewConfig: CanCardView
  @Input() fabButtonConfig: CanFabButton;
  @Input() header: string;
  public displayCardView = true;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  reloadContent(reload: boolean) {
    if (reload) {
      this.displayCardView = false;
      this.changeDetector.detectChanges();
      this.displayCardView = true;
    }
  }
}
