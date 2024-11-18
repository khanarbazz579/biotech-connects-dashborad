import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-map-user-role',
  templateUrl: './map-user-role.component.html',
  styleUrls: ['./map-user-role.component.scss']
})
export class MapUserRoleComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  formData: CanForm;
   userId: number;

  constructor(
    public dialogRef: MatDialogRef<MapUserRoleComponent>,
    private apiService: CanApiService,
    private notificationService: CanNotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any)
 { this.userId = this.data.userId }

  ngOnInit() {

  this.formData = {
      type: 'create',
      discriminator: 'formConfig',
      columnPerRow: 1,
      sendAll: true,
      formFields: [
        {
          name:'userId',
          placeholder:null,
          type:'hidden',
          defaultValue:this.userId
        },
        {
          name: 'roleIds',
          type: 'select',
          placeholder: 'Roles',
          multipleSelect: true,
          // send:'notSend',
          select: {
            type: 'api',
            api: {
              apiPath: '/roles',
              method: 'GET',
              params: new HttpParams()
              .append(
                "and",
                JSON.stringify([
                  { name: {'ne': 'customer'} },
                  { name: {'ne': 'Customer'} }
                ])
              ),
            },
            apiDataKey:'data',
            apiValueKey: "id",
            apiViewValueKey: "name",
          },
          required: {
            value: true,
            errorMessage: 'Roles is required.'
          },
        },
          
      ],
      header: 'Map Role',
      submitApi: {
        apiPath: `/user-role/map-roles`,
        method: 'POST'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "User Role Mapped successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
    this.closeModal();
  }
  closeModal(){
    this.dialogRef.close();
  }
}
