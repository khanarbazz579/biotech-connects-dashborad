import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  @Input() roleId: string;
  formData: CanForm;
  constructor() { }

  ngOnInit() {
    this.formData = {
      type: 'edit',
      discriminator: 'formConfig',
      columnPerRow: 1,
      formFields: [        
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: 'name',
          
          required: {
            value: true,
            errorMessage: 'Name is required.'
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
      ],
      getApi:{
        apiPath: `/permissions/${this.roleId}`,
        method:'GET'
      },
      submitApi: {
        apiPath: `/permissions/${this.roleId}`,
        method: 'PATCH'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Permissions updated successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

}
