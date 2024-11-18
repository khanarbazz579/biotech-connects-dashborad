import { Component, OnInit } from '@angular/core';
import { CanFabButton, CanFabButtonPosition } from 'src/@can/types/fab-button.type';
import { CanIconType } from 'src/@can/types/shared.type';
import { CanTable } from 'src/@can/types/table.type';
import { CreatePermissionComponent } from './create-permission/create-permission.component';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  constructor() { }

  public tableConfig: CanTable;
  public fabButtonConfig: CanFabButton;

  ngOnInit() {
      // Table Data Init
      this.tableConfig = {
        discriminator: 'tableConfig',
        displayedColumns: [
          {
            header: 'Name',
            type: 'text',
            value: 'name',
          },
          // {
          //   header: 'Status',
          //   type: 'text',
          //   value: 'isActive',
          // },
          {
            header: 'Is Active',
            type: 'enum_icon',
            value: 'isActive',
            enumIcons: [
            
              {
                value: true,
                icon: {
                  type: CanIconType.Material,
                  name: "fiber_manual_record",
                  tooltip: "active",
                  color: "#10d817",
                },
              },
              {
                value: false,
                icon: {
                  type: CanIconType.Material,
                  name: "fiber_manual_record",
                  tooltip: "inactive",
                  color: "#ee3f37",
                },
              }
            ],
          },
        ],
        fieldActions: [
  
          // {
          //   action: {
          //     actionType: 'modal',
          //     modal: {
          //       component: EditPermissionComponent,
          //       inputData: [
          //         {
          //           inputKey: 'roleId',
          //           type: 'key',
          //           key: 'id'
          //         }
          //       ],
          //       header: 'Edit Permission',
          //       width: 600
          //     }
          //   },
          //   icon: {
          //     name: 'edit permission',
          //     tooltip: 'Edit Permission',
          //   }
          // }
        ],
        filters: [
          {
            filtertype: 'api',
            placeholder: 'Search',
            type: 'text',
            key: 'id',
            searchType: 'autocomplete',
            autoComplete: {
              type: 'api',
              apiValueKey: 'id',
              apiViewValueKey: 'name',
              autocompleteParamKeys: ['name'],
              api: {
                apiPath: '/permissions',
                method: 'GET'
              },
              apiDataKey: 'data'
            },
          },

          // {
          //   filtertype: "api",
          //   placeholder: "Status",
          //   type: "radio",
          //   key: "isActive",
          //   // value: [
          //   //   { value: "active", viewValue: "Active" },
          //   //   { value: "inactive", viewValue: "Inactive" },
          //   // ],
          // }
        ],
        api: {
          apiPath: '/permissions',
          method: 'GET'
        },
        
        countApi: {
          apiPath: '/permissions/count',
          method: 'GET',
  
        },
        countApiDataKey: 'count',
        pagination: {
          pageSizeOptions: [50, 100]
        },
        header: 'Permissions'
      }

      // Fab Button Config
    this.fabButtonConfig = {
      icon: {
        name: 'add',
        tooltip: 'Create New'
      },
      type: 'modal',
      position: CanFabButtonPosition.BottomRight,
      modal: {
        component: CreatePermissionComponent,
        inputData: [],
        width: 600,
        header: 'Add Permission'
      },
    }
  }
}
