import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss']
})
export class CreatePermissionComponent implements OnInit {

  constructor() { }

  @Output() outputEvent = new EventEmitter<boolean>(false);
  formData: CanForm;


  ngOnInit() {
    this.formData = {
      type: 'create',
      discriminator: 'formConfig',
      columnPerRow: 1,
      formFields: [
        
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          required: {
            value: true,
            errorMessage: 'Name is required.'
          }
        },
        {
          name: 'status',
          type: 'select',
          placeholder: 'Is Active',
          values: [
            { value: 'active', viewValue: 'active' },
            { value: 'inactive', viewValue: 'inactive' },
          ]
        }
      ],
      submitApi: {
        apiPath: `/permissions`,
        method: 'POST'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Permission created successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }
}
