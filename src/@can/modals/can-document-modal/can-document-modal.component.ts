// In-Built
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Packages
import { saveAs } from 'file-saver';

// Components
import { CanDocument } from 'src/@can/types/shared.type';

@Component({
  selector: 'can-document-modal',
  templateUrl: './can-document-modal.component.html',
  styleUrls: ['./can-document-modal.component.scss']
})
export class CanDocumentModalComponent implements OnInit {
  public documentsData: CanDocument[];
  public selectedIndex: number;

  constructor(
    public dialogRef: MatDialogRef<CanDocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documentsData: CanDocument[], index: number }
  ) {
  }

  ngOnInit() {
    this.documentsData = this.data.documentsData;
    this.selectedIndex = this.data.index;
  }

  // Download Doc
  public onDocDownload(docSrc: string, extension: string): void {
    if (extension) {
      saveAs(docSrc, Date.now() + '.' + extension);
    } else {
      saveAs(docSrc, Date.now());
    }
  }

  // Close Open Modal
  public closeModal() {
    this.dialogRef.close();
  }

  public getDocumentIcon(src: string): string {
    const imageExt = ['.png', '.jpg', '.jpeg', '.gif'];
    const audioExt = ['.mpeg', '.mp4', '.mp3', '.wav', '.webp'];
    const docExt = ['.xls', '.xlsx', '.doc', '.docx', '.pdf', '.txt'];
    if (src) {
      for (let ext of imageExt) {
        if (src.endsWith(ext)) {
          return 'image';
        }
      }
      for (let ext of audioExt) {
        if (src.endsWith(ext)) {
          return 'play_circle_outline';
        }
      }
    }
    return 'description';
  }


}
