import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { CanApi } from 'src/@can/types/api.type';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss']
})
export class EditUserRoleComponent implements OnInit {

  
  @Output() outputEvent = new EventEmitter<boolean>(false);
  @Input() userId: string;
  userRoles:any[] =[]
  formData: CanForm;
  constructor(
    private apiService: CanApiService,
    private notificationService: CanNotificationService,

  ) { }

 async ngOnInit() {
    this.formData = {
      type: 'edit',
      discriminator: 'formConfig',
      columnPerRow: 1,
      doNothingOnFormSubmit:true,
      sendAll:true,
      formFields: [
        {
          name: 'roleId',
          type: 'select',
          placeholder: 'Roles',
          // multipleSelect: true,
          // send:'notSend',
          value:'roleId',
          select: {
            type: 'api',
            api: {
              apiPath: '/roles',
              method: 'GET',
           
            },
            // apiDataKey:'data',
            apiValueKey: "id",
            apiViewValueKey: "name",
          },
          required: {
            value: true,
            errorMessage: 'Roles is required.'
          },
        },{
          name: 'id',
          type: 'hidden',
          placeholder: null,
          value: 'id'
        }
          
      ],
      getApi:{
        apiPath: `/user-role/maps`,
        method:'GET',
        params:new HttpParams().append('userId',this.userId)
      },
      // apiDataKey:'data',
      submitApi: {
        apiPath: `/user-role/map-roles/${this.userId}`,
        method: 'PATCH'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Mapping updated successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }



  submit(event:any){
    const userPost: CanApi = {
      apiPath: `/user-role/${event.id}`,
      method: 'PATCH'
    }
    this.apiService.request(userPost,event)
      .subscribe((res:any) => {
        this.notificationService.showSuccess('Updated successfully')
        this.formSubmitted(true);
      },(error) => {
        this.notificationService.showError('Failed to update role');
      })
  }


}
