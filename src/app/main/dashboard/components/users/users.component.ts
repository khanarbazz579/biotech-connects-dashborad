import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanFabButton, CanFabButtonPosition } from 'src/@can/types/fab-button.type';
import { CanIconType } from 'src/@can/types/shared.type';
import { CanTable } from 'src/@can/types/table.type';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserRoleComponent } from './edit-user-role/edit-user-role.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor() {}
  public tableData: CanTable;
  public fabButtonConfig: CanFabButton;

  ngOnInit() {
    // Table Data Init
    this.tableData = {
      discriminator: "tableConfig",
      displayedColumns: [
        {
          header: "Name",
          type: "text",
          value: "name",
          // keySeparators: [" "],
        },

        {
          header: "Phone",
          type: "text",
          value: "mobile",
          
        },
        {
          header: "Email",
          type: "text",
          value: "email",
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
        // {
        //   header: 'Role',
        //   type: 'text',
        //   value: 'role',
        // },
        {
          header: "Created At",
          type: "date",
          value: "createdAt",
          dateDisplayType: "dd/MM/yy",
        },
      ],
      fieldActions: [
        // {
        //   action: {
        //     actionType: "link",
        //     link: {
        //       url: "/dashboard/user-detail/${id}",
        //       target: "self",
        //       type: "url",
        //     },
        //   },
        //   icon: {
        //     type: CanIconType.Material,
        //     name: "note_add",
        //     tooltip: "Internal Detail",
        //     color: "blue",
        //   },
        // },
        {
          action: {
            actionType: "modal",
            modal: {
              component: EditUserRoleComponent,
              inputData: [
                {
                  inputKey: "userId",
                  type: "key",
                  key: "id",
                },
              ],
              header: "Edit User Role",
              width: 600,
            },
          },
          icon: {
            name: "add role",
            tooltip: "Edit User Role",
          },
        },
        {
          action: {
            actionType: "modal",
            modal: {
              component: EditUserComponent,
              inputData: [
                {
                  inputKey: "userId",
                  type: "key",
                  key: "id",
                },
              ],
              header: "Edit Internal User",
              width: 600,
            }
          },
          icon: {
            name: "edit",
            tooltip: "Edit Internal User",
          },
        },
      ],
      filters: [
        {
          filtertype: "api",
          placeholder: "Search Name/Phone No.",
          type: "text",
          key: "id",
          searchType: "autocomplete",
          autoComplete: {
            type: "api",
            apiValueKey: "id",
            apiViewValueKey: "name",
            autocompleteParamKeys: ["name", "email", "mobile"],
            api: {
              apiPath: "/users",
              method: "GET",
              params: new HttpParams().set("type", "internal"),
            },
            apiDataKey: "data",
          },
        },

        // {
        //   filtertype: "api",
        //   placeholder: " Select Status",
        //   type: "dropdown",
        //   key: "status",
        //   value: [
        //     { value: "active", viewValue: "Active" },
        //     { value: "inactive", viewValue: "Inactive" },
        //   ],
        // },

        // {
        //   filtertype: "api",
        //   placeholder: "Creation Date",
        //   type: "date",
        //   key: "createdAt",
        //   date: {
        //     enabledRange: true,
        //     enabledTime: false,
        //     dateRange: {
        //       keys: {
        //         from: "from",
        //         to: "to",
        //       },
        //     },
        //   },
        // },
      ],
      api: {
        apiPath: "/users",
        method: "GET",
        // params: new HttpParams().set("type", "internal"),
      },
      countApi: {
        apiPath: "/users/count",
        method: "GET",
        // params: new HttpParams().set("type", "internal"),
      },
      countApiDataKey: "count",
      pagination: {
        pageSizeOptions: [50, 100],
      },
      header: "Users",
    };

    this.fabButtonConfig = {
      icon: {
        name: "add",
        tooltip: "Add User",
      },
      type: "modal",
      position: CanFabButtonPosition.BottomRight,
      modal: {
        component: AddUserComponent,
        inputData: [],
        width: 600,
        header: "Add User",
      },
    };
  }
}
