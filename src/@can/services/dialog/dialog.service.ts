// In-Built
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

// Types
import { CanConfirmDialog } from 'src/@can/types/confirm-dialog.type';
import { CanImageItem, CanDocumentItem, CanDocument } from 'src/@can/types/shared.type';
import { CanImage } from 'src/@can/types/image.type';

// NPM Packages
import * as _ from 'underscore';

// Components
import { CanConfirmModalComponent } from 'src/@can/modals/can-confirm-modal/can-confirm-modal.component';
import { CanImageModalComponent } from 'src/@can/modals/can-image-modal/can-image-modal.component';
import { CanDocumentModalComponent } from 'src/@can/modals/can-document-modal/can-document-modal.component';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

@Injectable({
  providedIn: 'root'
})
export class CanDialogService {

  constructor(public dialog: MatDialog) { }

  /**
   * 
   * @param confirmData : ConfirmMessage
   * 
   * create confirm message dialog and send result
   */
  public confirmDialog(confirmData: CanConfirmDialog): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(CanConfirmModalComponent, {
        disableClose: true,
        data: confirmData
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        resolve(dialogResult);
      });
    })
  }

  /**
   *
   * @param imageSrc:string
   *
   * Open Image Modal when view Image button click
   */
  public onImageDisplay(data: object, images: CanImageItem[], width: number, index?: number): void {
    const imagesData = this.getImages(data, images);
    this.dialog.open(CanImageModalComponent, {
      width: width ? width + "px" : "600px",
      disableClose: true,
      panelClass: 'image-modal',
      data: { imagesData: imagesData, index: index ? index : 0 }
    });
  }

  /**
   * 
   * @param data :object
   * @param images : CanImageItem[]
   * Return images as CanImage[] 
   */
  public getImages(data: object, images: CanImageItem[]): CanImage[] {
    // Init imagesData
    const imagesData: CanImage[] = []
    // Loop images
    images.forEach((image) => {
      // Check for type
      if (image.type === 'url') {
        // Add it to imagesData
        imagesData.push(this.createImageData(image.src, image.alt));
      } else {
        // Get value
        const value = CanHelper.mapValueWithApiKey(data, image.value);
        // Check for array
        if (image.isArray) {
          // Check for type as array
          if (_.isArray(value)) {
            // Loop values
            value.forEach((element) => {
              // add it to imagesData
              imagesData.push(this.createImageData(CanHelper.mapValueWithApiKey(element, image.key), image.alt));
            });
          }
        } else {
          // add it to imagesData
          imagesData.push(this.createImageData(value, image.alt));
        }
      }
    });
    return imagesData;
  }


  /**
   * 
   * @param src : string
   * @param alt : string
   * 
   * Create ImageData as CanImage
   */
  public createImageData(src: string, alt: string): CanImage {
    const imageData: CanImage = {
      image: {
        src: src || 'Image',
        alt: alt
      }
    };
    return imageData;
  }

  /**
   *
   * @param documents:string
   *
   * Open Document Modal when view button click
   */
  public onDocumentsDisplay(data: object, documents: CanDocumentItem[], width: number, index?: number): void {
    const documentsData = this.getDocuments(data, documents);
    this.dialog.open(CanDocumentModalComponent, {
      width: width ? width + "px" : "600px",
      disableClose: true,
      panelClass: 'document-modal',
      data: { documentsData: documentsData, index: index ? index : 0 }
    });
  }

  /**
   * 
   * @param data :object
   * @param documents : CanDocumentItem[]
   * Return documents as CanDocument[] 
   */
  public getDocuments(data: object, documents: CanDocumentItem[]): CanDocument[] {
    // Init documentsData
    const documentsData: CanDocument[] = []
    // Loop documents
    documents.forEach((document) => {
      // Check for type
      if (document.type === 'url') {
        // Add it to documentsData
        documentsData.push(this.createDocumentData(document.url, document.extension));
      } else {
        // Get value
        const value = CanHelper.mapValueWithApiKey(data, document.value);
        // Check for array
        if (document.isArray) {
          // Check for type as array
          if (_.isArray(value)) {
            value.forEach((element) => {
              // add it to documentsData
              documentsData.push(this.createDocumentData(CanHelper.mapValueWithApiKey(element, document.key), document.extension));
            });
          }
        } else {
          // add it to documentsData
          documentsData.push(this.createDocumentData(value, document.extension));
        }
      }
    });
    return documentsData;
  }

  /**
   * 
   * @param src : string
   * @param extension : string
   * 
   * Create DocumentData as CanDocument
   */
  public createDocumentData(src: string, extension: string): CanDocument {
    const documentData: CanDocument = {
      document: {
        src: src,
        extension: extension
      }
    };
    return documentData;
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
