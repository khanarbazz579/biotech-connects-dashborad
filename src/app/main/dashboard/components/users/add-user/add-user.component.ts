import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CanApiService } from 'src/@can/services/api/api.service';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { CanApi } from 'src/@can/types/api.type';
import { CanForm } from 'src/@can/types/form.type';
import { MapUserRoleComponent } from '../map-user-role/map-user-role.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  formData: CanForm;
  @Output() outputEvent = new EventEmitter<boolean>(false);

  constructor(
    private notificationService: CanNotificationService,
    private dialog: MatDialog,
    private apiService: CanApiService, 
  ) { }

  ngOnInit() {
    this.formData = {
      type: 'create',
      discriminator: 'formConfig',
      columnPerRow: 1,
      doNothingOnFormSubmit:true,
      sendAll:true,
      formFields: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          required: {
            value: true,
            errorMessage: 'Name is required!'
          },
          pattern: {
            value: "^[a-zA-Z_ ]*$",
            errorMessage: 'Name must be in proper case.'
          },
  
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
          required: {
            value: true,
            errorMessage: 'Password is required!'
          },
          pattern: {
            value: "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
            errorMessage: 'Password must be in proper case.'
          },
  
        },
        {
          name: 'mobile',
          type: 'text',
          placeholder: 'Mobile Number',
          required: {
            value: true,
            errorMessage: 'Mobile Number is required!'
          },
          // pattern: {
          //   value: '^[6-9]\\d{9}$',
          //   errorMessage: 'Invalid Mobile Number.'
          // },
        },

        {
          name: 'email',
          type: 'text',
          placeholder: 'Email',
          pattern: {
            value: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
            errorMessage: 'Invalid Email.'
          }
        },

        {
          name: 'status',
          type: 'select',
          placeholder: 'Is Active',
          value:'status',
          values: [
            { value: 'active', viewValue: 'active' },
            { value: 'inactive', viewValue: 'inactive' },
          ]
        },
        // {
        //   name :'type',
        //   type:'hidden',
        //   placeholder:null,
        //   defaultValue:'internal'
        // },
        {
          name: 'roleId',
          type: 'select',
          placeholder: 'Roles',
          // send:'notSend',
          // multipleSelect:true,
          select: {
            type: 'api',
            api: {
              apiPath: '/roles',
              method: 'GET'
            },
            // apiDataKey:'data',
            apiValueKey: "id",
            apiViewValueKey: "name",
          },
          required: {
            value: true,
            errorMessage: 'Roles is required.'
          },
        },

      ],
      submitApi: {
        apiPath: `/users`,
        method: 'POST'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
    }
    
  }

  submit(event:any){
    const userPost: CanApi = {
      apiPath: `/users`,
      method: 'POST'
    }
    this.apiService.request(userPost,event)
      .subscribe((res:any) => {
       this.mapRole(event,res.data);
      })
  }

  mapRole(reqBody:any, resBody:any){
    const userPost: CanApi = {
      apiPath: `/user-role`,
      method: 'POST'
    }
    const body = {
      userId: resBody.id,
      roleId: reqBody.roleId
    }
    this.apiService.request(userPost,body)
      .subscribe((res:any) => {
       this.formSubmitted(true);
      })
  }
  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

  FormSubmitResponse(event) {
    // If Manpower not found then open add manpower component
  console.log(event.data.id)
    if (!event.submitResponse) {
      this.notificationService.showSuccess("User created successfully!");
      const dialogRef = this.dialog.open(MapUserRoleComponent, {
        width: "600px",
        data: { userId: event.data.id }
      });
      dialogRef.afterClosed().subscribe(submitResponse => {
      });
 
    }

  }
}
