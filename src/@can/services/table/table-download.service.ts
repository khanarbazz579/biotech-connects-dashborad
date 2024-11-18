// In-Built
import { Injectable } from '@angular/core';

// NPM Packages
import { saveAs } from 'file-saver';

// Types
import { CanDownload } from 'src/@can/types/table.type';

// Services
import { CanApiService } from 'src/@can/services/api/api.service';

@Injectable({
  providedIn: 'root'
})

export class CanTableDownloadService {


  constructor(private apiService: CanApiService) { }

  /**
   * 
   * @param downloadDef: CanDownload
   * 
   * Download any Type of Data
   */
  public download(downloadDef: CanDownload): Promise<boolean> {
    return new Promise((resolve) => {
      if (downloadDef.downloadType === 'url') {
        // In case of url
        saveAs(downloadDef.url, Date.now() + '.' + downloadDef.extension);
        resolve(true);
      } else {
        // In case of api
        this.apiService.list(downloadDef.api).subscribe((res) => {
          // If response is text
          if (downloadDef.api.responseType === 'text') {
            const blob = new Blob([res.toString()], { type: 'text/csv' })
            saveAs(blob, Date.now() + '.' + downloadDef.extension);
            resolve(true);
          } else if (downloadDef.api.responseType === 'blob') {
            // If respose is blob
            saveAs(res, Date.now() + '.' + downloadDef.extension);
            resolve(true);
          } else {
            // In case of json response
            // Assign data using key
            const data = downloadDef.apiDataKey ? res[downloadDef.apiDataKey] : res;
            // Specify how you want to handle null values here
            const replacer = (key, value) => value === null ? '' : value;
            // Get headers
            const header = Object.keys(data[0]);
            // create csv data
            let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
            csv.unshift(header.join(','));
            let csvArray = csv.join('\r\n');
            // Create a blob
            const blob = new Blob([csvArray], { type: downloadDef.blobType })
            // Download file with name
            saveAs(blob, Date.now() + '.' + downloadDef.extension);
            resolve(true);
          }
        });
      }
    });
  }
}
