// In-Built
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material';

// Helpers
import { CanHelper } from 'src/@can/utils/helper.util';

// Types
import { CanFieldAction, CanDownload } from 'src/@can/types/table.type';
import { CanApi } from 'src/@can/types/api.type';
import { CanModal, CanLink, CanAction } from 'src/@can/types/shared.type';

// Components
import { CanModalComponent } from 'src/@can/modals/can-modal/can-modal.component';

// Services
import { CanTableDownloadService } from 'src/@can/services/table/table-download.service';
import { CanDialogService } from 'src/@can/services/dialog/dialog.service';
import { CanApiService } from 'src/@can/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CanActionService {

  constructor(private router: Router,
    private tableDownloadService: CanTableDownloadService,
    public dialog: MatDialog,
    private dialogService: CanDialogService,
    private apiService: CanApiService
  ) { }

  /**
   *
   * @param url:string
   *
   * OPEN URL In Same Tab
   */
  public onOpenSelfUrl(url: string, data?: object): void {
    // Valid Complete URL eg: http:// || https://
    if (CanHelper.validateUrl(url)) {
      location.href = url;
    } else { // Not Complete URL eg: /dashboard
      if (data) {
        const navigationExtras: NavigationExtras = {
          queryParams: { data: JSON.stringify(data) }
        }
        this.router.navigate([url], navigationExtras)
        // this.router.navigateByUrl(url, navigationExtras);
      } else {
        this.router.navigateByUrl(url);
      }
    }
  }

  /**
   *
   * @param url:string
   *
   * Opne URL in New Tab
   */
  public onOpenExternalUrl(url: string): void {
    // Valid Complete URL eg: http:// || https://
    if (CanHelper.validateUrl(url)) {
      window.open(url, '_blank');
    } else { // Not Complete URL eg: /dashboard
      const navigateUrl = `${location.protocol}//${location.host}${url}`;
      window.open(navigateUrl, '_blank');
    }
  }


  /**
   * 
   * @param actionDef :CanAction
   * @param data :object
   * Check for action type and apply accordingly
   */
  public applyAction(actionDef: CanAction, data: object): Promise<any> {
    return new Promise(async (resolve) => {
      // Check action type 
      if (actionDef.actionType === 'link') {
        this.linkAction(actionDef.link, data).then(res => {
          resolve(res);
        })
      } else if (actionDef.actionType === 'modal') {
        this.modalAction(actionDef.modal, data).then(res => {
          resolve(res);
        })
      } else if (actionDef.actionType === 'download') {
        this.downloadAction(actionDef.download, data).then(res => {
          resolve(res);
        })
      } else if (actionDef.actionType === 'ajax') {
        this.ajaxAction(actionDef, data).then(res => {
          resolve(res);
        })
      } else if (actionDef.actionType === 'function') {
        const res = await actionDef.executableFunction();
        resolve(res);
      }
    });
  }

  /**
   * 
   * @param modal :CanModal
   * @param data :object
   */
  public modalAction(modal: CanModal, data: object): Promise<any> {
    return new Promise(resolve => {
      // Init inputData
      const inputData = {};
      // Loop inputData
      for (const each of modal.inputData) {
        // Check for type 
        if (each.type === 'fixed') {
          // In case of fixed value
          inputData[each.inputKey] = each.value;
        } else if (each.type === 'key') {
          // In case of key
          inputData[each.inputKey] = CanHelper.mapValueWithApiKey(data, each.key);
        }
      }
      // open modal component
      const dialogRef = this.dialog.open(CanModalComponent, {
        disableClose: modal.disableClose ? modal.disableClose : false,
        width: modal.width ? modal.width + "px" : "auto",
        maxHeight: '90vh',
        panelClass: 'custom-modal-sizing',
        data: { component: modal.component, inputData: inputData, header: modal.header, footer: modal.footer, dataSource: data }
      });

      // Check for reload of table after modal is closed
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * 
   * @param link :CanLink
   * @param data :object
   */
  public linkAction(link: CanLink, data: object): Promise<any> {
    return new Promise(resolve => {
      // Get variables from url
      const variables = CanHelper.getVariablesFromUrl(link.url);
      let url = link.url;
      // Replace each variable with value
      for (const variable of variables) {
        url = url.replace('${' + variable + '}', CanHelper.mapValueWithApiKey(data, variable));
      }
      let shareData;
      // Check for type 
      if (link.type === 'obj') {
        // Send data in case of 'obj'
        if (data) {
          shareData = {};
          shareData['type'] = link.type;
          shareData['value'] = data;
        }
      } else if (link.type === 'fetchKey') {
        // Send key in case of 'fetchKey'
        if (CanHelper.mapValueWithApiKey(data, link.value)) {
          shareData = {};
          shareData['type'] = link.type;
          shareData['value'] = CanHelper.mapValueWithApiKey(data, link.value);
        }
      }
      // Check target
      if (link.target === 'self') {
        // In case of self
        this.onOpenSelfUrl(url, shareData);
      } else {
        // In case of external
        this.onOpenExternalUrl(url);
      }
      resolve(false);
    });
  }

  /**
   * 
   * @param download :CanDownload
   * @param data :object
   */
  public downloadAction(download: CanDownload, data: object): Promise<any> {
    return new Promise(resolve => {
      // Add query params to api
      if (download.params && download.params.length) {
        if (!download.api.params) {
          download.api.params = new HttpParams();
        }
        for (const each of download.params) {
          download.api.params = download.api.params.set(each, data[each]);
        }
      }
      // download file
      this.tableDownloadService.download(download);
      resolve(false);
    });
  }

  /**
   * 
   * @param actionDef :CanAction
   * @param data :object
   */
  public ajaxAction(actionDef: CanAction, data: object): Promise<any> {
    return new Promise(resolve => {
      // Open confirm dialog
      this.dialogService.confirmDialog(actionDef.confirm).then((response) => {
        // Check for response
        if (response) {
          const bodyData = {};
          if (actionDef.bodyParams && actionDef.bodyParams.length) {
            for (const each of actionDef.bodyParams) {
              bodyData[each.key] = each.value;
            }
          }

          // To remove instance of object
          const api: CanApi = Object.assign({}, actionDef.api);
          // Get variables from url
          const variables = CanHelper.getVariablesFromUrl(api.apiPath);
          // Replace each variable with value
          for (const variable of variables) {
            api.apiPath = api.apiPath.replace('${' + variable + '}', CanHelper.mapValueWithApiKey(data, variable));
          }

          // Update data 
          this.apiService.request(api, bodyData).subscribe((res) => {
            resolve(true);
          }, (error) => {
            resolve(false);
          });
        } else {
          resolve(false);
        }
      });
    });
  }
}
