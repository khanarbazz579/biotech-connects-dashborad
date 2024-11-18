// In-Built
import { Directive, Input, OnInit, ViewContainerRef, TemplateRef } from '@angular/core';

// Types
import { CanPermission } from 'src/@can/types/permission.type';
import { CanPermissionService } from 'src/@can/services/permission/permission.service';

@Directive({
  selector: '[canValidatePermission]'
})
export class CanValidatePermissionDirective {

  @Input() set canValidatePermission(permission: CanPermission) {
    if (this.permissionService.validatePermission(permission)) {
      if (!this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: CanPermissionService) {
  }
}
