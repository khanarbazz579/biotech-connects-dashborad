import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CanUpload } from 'src/@can/types/table.type';
import { FileInput } from 'ngx-material-file-input';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanDialogService } from 'src/@can/services/dialog/dialog.service';
import { CanAutoUnsubscribe } from 'src/@can/decorators/auto-unsubscribe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'can-upload',
  templateUrl: './can-upload.component.html',
  styleUrls: ['./can-upload.component.scss']
})

// Unsubscribe all subscriptions on ngOnDestroy
@CanAutoUnsubscribe
export class CanUploadComponent implements OnInit {
  // Upload config
  @Input() uploadConfig: CanUpload;

  // Event emit to parent to update data
  @Output() updateTable = new EventEmitter<boolean>(true);
  public selectedFile: FileInput;

  // Subscription
  private uploadSubscription: Subscription;
  constructor(private apiService: CanApiService,
    private dialogService: CanDialogService) { }

  ngOnInit() {
  }

  /**
   * Upload File
   */
  public upload() {
    // Check that file is selected
    if (this.selectedFile) {
      this.dialogService.confirmDialog(this.uploadConfig.confirm).then((response) => {
        if (response) {
          // get file from file input
          const file = this.selectedFile.files[0];
          // initialze form data
          const formData: FormData = new FormData();
          // add file to formdata
          formData.append(this.uploadConfig.payloadName, file, file.name);
          // call the api
          this.uploadSubscription = this.apiService.request(this.uploadConfig.api, formData).subscribe((res) => {
            this.updateTable.emit(true);
          });
        }
      });
    }
  }
}
