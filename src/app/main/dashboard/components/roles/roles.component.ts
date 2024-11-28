import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanFabButton, CanFabButtonPosition } from 'src/@can/types/fab-button.type';
import { CanIconType } from 'src/@can/types/shared.type';
import { CanTable } from 'src/@can/types/table.type';
import { MapRolePermissionComponent } from '../map-role-permission/map-role-permission.component';
import { CreateRolesComponent } from './create-roles/create-roles.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

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
          {
            header: 'Is Active',
            type: 'enum_icon',
            value: 'status',
            enumIcons: [
            
              {
                value: 'active',
                icon: {
                  type: CanIconType.Material,
                  name: "fiber_manual_record",
                  tooltip: "active",
                  color: "#10d817",
                },
              },
              {
                value: 'inactive',
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
  
          {
            action: {
              actionType: 'modal',
              modal: {
                component: EditRolesComponent,
                inputData: [
                  {
                    inputKey: 'roleId',
                    type: 'key',
                    key: 'id'
                  }
                ],
                header: 'Edit Role',
                width: 600
              },
      // permission: { type: 'single', match: { key: 'UPDATE_ROLES', value: true }}

            },
            icon: {
              name: 'edit role',
              tooltip: 'Edit Role',
            }
          },
          {
            action: {
              actionType: 'modal',
              modal: {
                component: MapRolePermissionComponent,
                inputData: [
                  {
                    inputKey: 'roleId',
                    type: 'key',
                    key: 'id'
                  }
                ],
                header: 'Map Roles Permission',
                width: 600
              },

            },
            icon: {
              name: 'add role',
              tooltip: 'Map Role Permission',
            }
          }
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
                apiPath: '/roles',
                method: 'GET'
              },
              apiDataKey:'data'
            },
          },
          {
            filtertype: "api",
            placeholder: "Status",
            type: "dropdown",
            key: "status",
            value: [
              { value: "active", viewValue: "Active" },
              { value: "inactive", viewValue: "Inactive" },
            ],
          }
        ],
        api: {
          apiPath: '/roles',
          method: 'GET'
        },
        countApi: {
          apiPath: '/roles/count',
          method: 'GET'
  
        },
        countApiDataKey: 'count',
        pagination: {
          pageSizeOptions: [50, 100]
        },
        header: 'Roles'
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
        component: CreateRolesComponent,
        inputData: [],
        width: 600,
        header: 'Add Role'
      },
      // permission: { type: 'single', match: { key: 'CREATE_ROLES', value: true }}
      
    }
  }


}
