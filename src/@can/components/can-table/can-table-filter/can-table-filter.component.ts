import { Component, Input } from '@angular/core';

@Component({
  selector: 'can-table-filter',
  templateUrl: './can-table-filter.component.html',
  styleUrls: ['./can-table-filter.component.scss']
})

export class CanTableFilterComponent {

  @Input() dataSourceType: string;

  constructor() {

  }

  applyFilter(filterValue: string) {
  }
}
