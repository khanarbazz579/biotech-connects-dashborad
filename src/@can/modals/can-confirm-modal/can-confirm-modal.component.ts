// In-Built
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Types
import { CanConfirmDialog } from 'src/@can/types/confirm-dialog.type';

// Components
import { CanModalComponent } from 'src/@can/modals/can-modal/can-modal.component';

@Component({
  selector: 'can-confirm-modal',
  templateUrl: './can-confirm-modal.component.html',
  styleUrls: ['./can-confirm-modal.component.scss']
})
export class CanConfirmModalComponent implements OnInit {

  public title: string;
  public message: string;
  public confirmText: string;
  public cancelText: string;
  constructor(
    public dialogRef: MatDialogRef<CanModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CanConfirmDialog
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.message = this.data.message;
    this.confirmText = this.data.buttonText.confirm;
    this.cancelText = this.data.buttonText.cancel;
  }

  // Confirm Action Handler
  public onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  // Dismiss Action Handler
  public onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
