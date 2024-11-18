import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent implements OnInit {


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
          value:'name',
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
      getApi:{
        apiPath: `/roles/${this.roleId}`,
        method:'GET'
      },
      submitApi: {
        apiPath: `/roles/${this.roleId}`,
        method: 'PATCH'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Role updated successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

}
