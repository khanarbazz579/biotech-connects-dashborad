import { Component, OnInit, Input } from '@angular/core';
import { CanBulkAction } from 'src/@can/types/table.type';

@Component({
  selector: 'can-table-bulk-actions',
  templateUrl: './can-table-bulk-actions.component.html',
  styleUrls: ['./can-table-bulk-actions.component.scss']
})
export class CanTableBulkActionsComponent implements OnInit {
  @Input() bulkActionConfig: CanBulkAction[];

  constructor() { }

  ngOnInit() {
  }

}
