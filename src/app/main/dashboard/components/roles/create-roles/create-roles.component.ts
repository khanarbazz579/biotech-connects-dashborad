import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  formData: CanForm;
  constructor() { }

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
          name: 'isActive',
          type: 'toggle',
          value: 'isActive',
          defaultValue : true,
          placeholder: 'Is Active',
        },

      ],
      submitApi: {
        apiPath: `/roles`,
        method: 'POST'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Role created successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }


}
