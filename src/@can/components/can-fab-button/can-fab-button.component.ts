import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CanFabButton, CanFabButtonPosition } from 'src/@can/types/fab-button.type';
import { MatDialog } from '@angular/material';
import { CanActionService } from 'src/@can/services/action/action.service';
import { CanPermission } from 'src/@can/types/permission.type';
import { CanIcon } from 'src/@can/types/shared.type';

@Component({
  selector: 'can-fab-button',
  templateUrl: './can-fab-button.component.html',
  styleUrls: ['./can-fab-button.component.scss']
})
export class CanFabButtonComponent implements OnInit {
  // Emits event to parent
  @Output() fabButtonOutputEvent = new EventEmitter<boolean>(false);
  // Fab button config
  @Input() fabButtonConfig: CanFabButton;
  // Fab button element for changing css
  @ViewChild('fabButton', { static: true }) fabButton: ElementRef;

  // Icon
  public icon: CanIcon;
  // Display Position 
  public position: CanFabButtonPosition;
  // Permission Config
  public permission: CanPermission;

  constructor(public dialog: MatDialog,
    private actionService: CanActionService) {
  }

  ngOnInit() {
    // Def's icon
    this.icon = this.fabButtonConfig.icon;
    // Def's position
    this.position = this.fabButtonConfig.position;
    // Def's permission
    this.permission = this.fabButtonConfig.permission;
    // Set position
    this.setFabButtonPosition();
  }

  /**
   * Button Click event
   */
  public onClick(): void {
    // Check action type 
    if (this.fabButtonConfig.type === 'link') {
      // Check target
      if (this.fabButtonConfig.link.target === 'self') {
        // In case of self
        this.actionService.onOpenSelfUrl(this.fabButtonConfig.link.url);
      } else {
        // In case of external
        this.actionService.onOpenExternalUrl(this.fabButtonConfig.link.url);
      }

    } else if (this.fabButtonConfig.type === 'modal') {
      // Implement modal action
      this.actionService.modalAction(this.fabButtonConfig.modal, this.fabButtonConfig.data).then((res: boolean)=> {
        // Emit event
        this.fabButtonOutputEvent.emit(res);
      });
    }
  }

  /**
   * Set Fab Button Position
   */
  public setFabButtonPosition(): void {
    // Check for type
    switch (this.position) {
      case CanFabButtonPosition.BottomRight:
        this.fabButton.nativeElement.style.right = '1%';
        this.fabButton.nativeElement.style.bottom = '2%';
        break;
      case CanFabButtonPosition.BottomLeft:
        this.fabButton.nativeElement.style.bottom = '2%';
        break;
      case CanFabButtonPosition.TopRight:
        this.fabButton.nativeElement.style.right = '1%';
        this.fabButton.nativeElement.style.top = '50px';
        break;
      case CanFabButtonPosition.TopLeft:
        this.fabButton.nativeElement.style.top = '50px';
        break;
    }
  }

}
