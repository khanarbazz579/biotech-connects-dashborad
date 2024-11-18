import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CanImageModalComponent } from 'src/@can/modals/can-image-modal/can-image-modal.component';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanFormField } from 'src/@can/types/form.type';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'can-image-formatter',
  templateUrl: './can-image-formatter.component.html',
  styleUrls: ['./can-image-formatter.component.scss']
})
export class CanImageFormatterComponent implements OnInit {
  @ViewChild("image", { static: false })
  public imageElement: ElementRef;

  // Loader
  public isLoad: boolean = false;

  // Image source
  public imageSource = '';

  // Disable button
  public disableButton: boolean;

  public croppedImage: Blob;

  public imageEvent: any;

  constructor(
    private apiService: CanApiService,
    public dialogRef: MatDialogRef<CanImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: any, file: File, control: CanFormField }
  ) {
    this.isLoad = false;
    this.disableButton = true;
  }

  ngOnInit() {
    this.imageEvent = this.data.event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file;
  }
  imageLoaded() {
    this.disableButton = false;
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  /**
   * Close event
   */
  public onDismiss(): void {
    this.dialogRef.close(false);
  }

  /**
   * Confirm event
   */
  public onConfirm(): void {
    // Start loader
    this.isLoad = true;
    // disable button
    this.disableButton = true;
    // initialze form data
    const formData: FormData = new FormData();
    // Append file to formdata
    formData.append(this.data.control.file.payloadName, this.blobToFile(this.croppedImage));
    // Api request
    this.apiService.request(this.data.control.file.api, formData).subscribe((res) => {
      // Stop loader
      this.isLoad = false;
      // enable button
      this.disableButton = false;
      // Close dialog
      this.dialogRef.close(res);
    }, err => {
      // Stop loader
      this.isLoad = false;
      // enable buttons
      this.disableButton = false;
    })
  }

  /**
   * 
   * @param blob :Blob
   * Convert blob to file
   */
  private blobToFile(blob: Blob): File {
    return new File([blob], this.data.file.name)
  }

}
