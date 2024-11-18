// In-Built
import { Component, OnInit, Inject, ComponentFactoryResolver, ViewChild, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Types
import { CanModalFooter } from 'src/@can/types/shared.type';

@Component({
  selector: 'can-modal',
  templateUrl: './can-modal.component.html',
  styleUrls: ['./can-modal.component.scss']
})
export class CanModalComponent implements OnInit {

  @ViewChild('displayComponent', { static: true, read: ViewContainerRef }) displayComponent: ViewContainerRef;

  public header: string;
  public footer: CanModalFooter;
  public dataSource: object
  public showComponent: boolean = true;
  public reload: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<CanModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.header = this.data.header;
    this.footer = this.data.footer;
    this.dataSource = this.data.dataSource;
    this.createDynamicComponent();
  }


  /**
   * Create Dynamic Component based on Config
   */
  public createDynamicComponent(): void {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.component);
    let componentRef = this.displayComponent.createComponent(componentFactory);
    const inputKeys = Object.keys(this.data.inputData);
    for (const each of inputKeys) {
      componentRef.instance[each] = this.data.inputData[each];
    }
    // Share data
    componentRef.instance['dataSource'] = this.dataSource;
    if (componentRef.instance['outputEvent']) {
      componentRef.instance['outputEvent'].subscribe(val => {
        this.dialogRef.close(val);
      });
    }
  }

  // Close Open Modal
  public closeModal() {
    this.dialogRef.close(this.reload);
  }

  // Reload Content Changes
  public reloadContent(reload: boolean): void {
    if (reload) {
      this.reload = reload;
      this.changeDetector.detectChanges();
      this.displayComponent.clear()
      this.createDynamicComponent();
    }
  }

  // Close Modal From Footer Button
  closeModalFromFooter(close: boolean): void {
    if (close) {
      this.dialogRef.close(this.reload);
    }
  }

}
