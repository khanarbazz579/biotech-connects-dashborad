import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-edit-internal',
  templateUrl: './edit-internal.component.html',
  styleUrls: ['./edit-internal.component.scss']
})
export class EditInternalComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  @Input() userId: string;
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
          value:'mobile',
          pattern: {
            value: '^[6-9]\\d{9}$',
            errorMessage: 'Invalid Mobile Number.'
          },
        },

        {
          name: 'email',
          type: 'text',
          placeholder: 'Email',
          value:'email',
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
        }

      ],
      getApi:{
        apiPath: `/users/${this.userId}`,
        method:'GET'
      },
      apiDataKey:'data',
      submitApi: {
        apiPath: `/users/${this.userId}`,
        method: 'PATCH'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Internal user updated successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

}
