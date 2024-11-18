import { Component, OnInit, Input } from '@angular/core';
import { CanBulkAction } from 'src/@can/types/table.type';
import { CanTableDownloadService } from 'src/@can/services/table/table-download.service';

@Component({
  selector: 'can-download',
  templateUrl: './can-download.component.html',
  styleUrls: ['./can-download.component.scss']
})
export class CanDownloadComponent implements OnInit {
  @Input() downloadConfig: CanBulkAction;
  public spinner = false;

  constructor(private tableDownloadService: CanTableDownloadService) { }

  ngOnInit() {
  }

  /**
   * Download File
   */
  public async download() {
    this.spinner = true;
    await this.tableDownloadService.download(this.downloadConfig.download);
    this.spinner = false;
  }

}
