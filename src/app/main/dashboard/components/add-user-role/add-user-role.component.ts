import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})
export class AddUserRoleComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  @Input() userId: string;
  formData: CanForm;
  constructor() { }

  ngOnInit() {
    this.formData = {
      type: 'create',
      discriminator: 'formConfig',
      columnPerRow: 1,
      sendAll: true,
      formFields: [
        {
          name:'roleId',
          type : 'select',
          placeholder:'role',
          // multipleSelect : true,
          select :{

            type :'api',
            api : {
              apiPath: `/roles`,
              method: 'GET',
            },
            apiValueKey : 'id',
            apiViewValueKey : 'name'
          }
        },
        {
          name: 'isActive',
          type: 'toggle',
          defaultValue : true,
          placeholder: 'Is Active',
        },
        {
          name: 'userId',
          type: 'hidden',
          placeholder: null,
          defaultValue: this.userId,
        }
        
      ],

      submitApi: {
        apiPath: `/user-role`,
        method: 'POST'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "User Role updated successfully!"
    }
  }
  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }
}
