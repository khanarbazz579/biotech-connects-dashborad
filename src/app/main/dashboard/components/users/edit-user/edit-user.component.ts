import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

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
          type: 'number',
          placeholder: 'Mobile Number',
          value:'mobile',
          // pattern: {
          //   value: '^[6-9]\\d{9}$',
          //   errorMessage: 'Invalid Mobile Number.'
          // },
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
          name: 'isActive',
          type: 'toggle',
          placeholder: 'Is Active',
          value:'isActive',
          
        },

      ],
      getApi:{
        apiPath: `/users/${this.userId}`,
        method:'GET'
      },
      // apiDataKey:'data',
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
      submitSuccessMessage: "User updated successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }

}
