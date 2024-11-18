import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CanFabButton } from 'src/@can/types/fab-button.type';
import { CanTable } from 'src/@can/types/table.type';

@Component({
  selector: 'can-table-fab-view',
  templateUrl: './can-table-fab-view.component.html',
  styleUrls: ['./can-table-fab-view.component.scss']
})
export class CanTableFabViewComponent implements OnInit {
  @Input() tableConfig: CanTable
  @Input() fabButtonConfig: CanFabButton;
  @Input() header: string;
  // Passing Table API Response to Parent Component
  @Output() getTableData = new EventEmitter<any>(true);
  // Passing Table API Response to Parent Component
  @Output() getTableFieldActionData = new EventEmitter<any>();

  public displayTable = true;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }

  reloadContent(reload: boolean) {
    if (reload) {
      this.displayTable = false;
      this.changeDetector.detectChanges();
      this.displayTable = true;
    }
  }

  onTableData(event) {
    this.getTableData.emit(event);
  }

  onFieldActionData(event) {
    this.getTableFieldActionData.emit(event);
  }
}
