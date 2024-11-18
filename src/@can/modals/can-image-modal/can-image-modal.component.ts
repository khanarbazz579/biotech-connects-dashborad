// In-Built
import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// NPM Packages
import { saveAs } from 'file-saver';

// Custom
import { CanImage } from 'src/@can/types/image.type';

@Component({
  selector: 'can-image-modal',
  templateUrl: './can-image-modal.component.html',
  styleUrls: ['./can-image-modal.component.scss']
})

export class CanImageModalComponent {
  public imagesData: CanImage[];
  public selectedIndex: number;

  @ViewChild('allImagesPanel', { static: false }) public allImagesPanel: ElementRef<any>;

  constructor(
    public dialogRef: MatDialogRef<CanImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imagesData: CanImage[], index: number  }
  ) {
  }

  ngOnInit() {
    this.imagesData = this.data.imagesData;
    this.selectedIndex = this.data.index;
  }


  // Close Open Modal
  public closeModal(): void {
    this.dialogRef.close();
  }

  // Download Image
  public onDownloadImage(imageSrc: string): void {
    saveAs(imageSrc, Date.now() + '.jpg');
  }

  // Image Gallery Previous Scroll
  public onPreviousScrollPosition(): void {
    this.allImagesPanel.nativeElement.scrollLeft -= 40;
  }

  // Image Gallery Next Scroll
  public onNextScrollPosition(): void {
    this.allImagesPanel.nativeElement.scrollLeft += 40;
  }

  // Previous Scroll Button Disabled Check
  public previousDisableCheck(): boolean {
    if (this.allImagesPanel && this.allImagesPanel.nativeElement) {
      if (this.allImagesPanel.nativeElement.scrollLeft) {
        return true;
      }
    }
    return false;
  }

  // Next Scroll Button Display Check
  public nextDisableCheck(): boolean {
    if (this.allImagesPanel && this.allImagesPanel.nativeElement) {
      if (this.allImagesPanel.nativeElement.scrollLeft < this.allImagesPanel.nativeElement.scrollWidth - this.allImagesPanel.nativeElement.offsetWidth) {
        return true;
      }
    }
    return false;
  }

}
