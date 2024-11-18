import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CanForm } from 'src/@can/types/form.type';

@Component({
  selector: 'app-map-role-permission',
  templateUrl: './map-role-permission.component.html',
  styleUrls: ['./map-role-permission.component.scss']
})
export class MapRolePermissionComponent implements OnInit {

  @Output() outputEvent = new EventEmitter<boolean>(false);
  @Input() roleId: string;
  formData: CanForm;
  constructor() { }

  ngOnInit() {
    this.formData = {
      type: 'edit',
      discriminator: 'formConfig',
      columnPerRow: 1,
      sendAll: true,
      formFields: [
        {
          name:'permissionIds',
          type : 'select',
          placeholder:'Persmission',
          multipleSelect : true,
          value:'permissionIds',

          select :{
            type :'api',
            api : {
              apiPath: `/permissions`,
              method: 'GET',
            },
            apiDataKey:"data",
            apiValueKey : 'id',
            apiViewValueKey : 'name'
          }
        },
        {
          name: 'roleId',
          type: 'hidden',
          placeholder: null,
          defaultValue: this.roleId,
        }
      ],
      getApi:{
        apiPath: `/role-permission/mapped-roles`,
        method:'GET',
        params:new HttpParams().append('roleId',this.roleId)
      },
      apiDataKey:'data',
      submitApi: {
        apiPath: `/role-permission/mapp-permission/${this.roleId}`,
        method: 'PATCH'
      },
      formButton:
      {
        type: 'raised',
        color: 'primary',
        label: 'Save'
      },
      submitSuccessMessage: "Mapped role permission successfully!"
    }
  }

  formSubmitted(event: boolean) {
    this.outputEvent.emit(event);
  }
}
