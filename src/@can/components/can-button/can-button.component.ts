import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CanButton } from 'src/@can/types/shared.type';

@Component({
  selector: 'can-button',
  templateUrl: './can-button.component.html',
  styleUrls: ['./can-button.component.scss']
})
export class CanButtonComponent implements OnInit {
  @Input() buttonConfig: CanButton;

  @Input() disabled: boolean;

  @Output() onClick = new EventEmitter<any>(true);

  constructor() { }

  ngOnInit() {
  }

  click() {
    this.onClick.emit(true);
  }

}
