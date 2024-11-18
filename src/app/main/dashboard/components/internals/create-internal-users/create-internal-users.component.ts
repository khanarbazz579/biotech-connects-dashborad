import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CanNotificationService } from 'src/@can/services/notification/notification.service';
import { ApiType } from 'src/@can/types/api.type';
import { CanFormStepper, CanFormStepperLayout } from 'src/@can/types/form-stepper.type';
import { CanForm } from 'src/@can/types/form.type';
import { MapUserRoleComponent } from '../../users/map-user-role/map-user-role.component';

@Component({
  selector: 'app-create-internal-users',
  templateUrl: './create-internal-users.component.html',
  styleUrls: ['./create-internal-users.component.scss']
})
export class CreateInternalUsersComponent implements OnInit {
  // formStepperConfig: CanFormStepper;
  formData: CanForm;
  @Output() outputEvent = new EventEmitter<boolean>(false);

  constructor(
    private notificationService: CanNotificationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.formData = {
      type: 'create',
      discriminator: 'formConfig',
      columnPerRow: 1,
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
          name: 'mobile',
          type: 'text',
          placeholder: 'Mobile Number',
          pattern: {
            value: '^[6-9]\\d{9}$',
            errorMessage: 'Invalid Mobile Number.'
          },
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
        {
          name :'type',
          type:'hidden',
          placeholder:null,
          defaultValue:'internal'
        }

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

