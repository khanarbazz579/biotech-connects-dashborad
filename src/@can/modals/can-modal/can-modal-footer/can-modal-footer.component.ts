// In-Built
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Types
import { CanModalFooter, CanModalFooterButton } from 'src/@can/types/shared.type';

// Services
import { CanActionService } from 'src/@can/services/action/action.service';

@Component({
  selector: 'can-modal-footer',
  templateUrl: './can-modal-footer.component.html',
  styleUrls: ['./can-modal-footer.component.scss']
})
export class CanModalFooterComponent implements OnInit {

  @Input() footer: CanModalFooter;
  @Input() dataSource: CanModalFooter;

  @Output() reloadContent = new EventEmitter<boolean>(true);
  @Output() closeModal = new EventEmitter<boolean>(true);

  constructor(private actionService: CanActionService) { }

  ngOnInit() {
  }

  /**
   * Apply action
   */
  public applyAction(button: CanModalFooterButton): void {
    switch (button.action.type) {
      case 'modal':
        this.actionService.modalAction(button.action.modal, this.dataSource).then((response: boolean) => {
          if (response) {
            // Reload data
            this.reloadContent.emit(response);
          }
        });
        break;
      case 'link':
        this.actionService.linkAction(button.action.link, this.dataSource).then((response: boolean) => {
          if (response) {
            // Reload data
            this.reloadContent.emit(response);
          }
        });
        break;
      case 'close':
        this.closeModal.emit(true);
        break;
    }
  }
}
