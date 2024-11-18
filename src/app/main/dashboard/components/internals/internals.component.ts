import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  CanFabButton,
  CanFabButtonPosition,
} from "src/@can/types/fab-button.type";
import { CanIconType } from "src/@can/types/shared.type";
import { CanTable } from "src/@can/types/table.type";
import { CreateInternalUsersComponent } from "./create-internal-users/create-internal-users.component";
import { EditInternalComponent } from "./edit-internal/edit-internal.component";

@Component({
  selector: "app-internal",
  templateUrl: "./internals.component.html",
  styleUrls: ["./internals.component.scss"],
})
export class InternalsComponent implements OnInit {
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
          value: "firstName middleName lastName",
          keySeparators: [" "],
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
        {
          action: {
            actionType: "link",
            link: {
              url: "/dashboard/user-detail/${id}",
              target: "self",
              type: "url",
            },
          },
          icon: {
            type: CanIconType.Material,
            name: "note_add",
            tooltip: "Internal Detail",
            color: "blue",
          },
        },
        // {
        //   action: {
        //     actionType: "modal",
        //     modal: {
        //       component: EditUserRoleComponent,
        //       inputData: [
        //         {
        //           inputKey: "userId",
        //           type: "key",
        //           key: "id",
        //         },
        //       ],
        //       header: "Edit User Roles",
        //       width: 600,
        //     },
        //   },
        //   icon: {
        //     name: "add role",
        //     tooltip: "Edit User Role",
        //   },
        // },
        {
          action: {
            actionType: "modal",
            modal: {
              component: EditInternalComponent,
              inputData: [
                {
                  inputKey: "userId",
                  type: "key",
                  key: "id",
                },
              ],
              header: "Edit Internal User",
              width: 600,
            },
            permission: {
              type: "single",
              match: { key: "UPDATE_USER", value: true },
            },
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
            autocompleteParamKeys: ["firstName", "lastName", "email", "mobile"],
            api: {
              apiPath: "/users",
              method: "GET",
              params: new HttpParams().set("type", "internal"),
            },
            apiDataKey: "data",
          },
        },

        {
          filtertype: "api",
          placeholder: " Select Status",
          type: "dropdown",
          key: "status",
          value: [
            { value: "active", viewValue: "Active" },
            { value: "inactive", viewValue: "Inactive" },
          ],
        },

        {
          filtertype: "api",
          placeholder: "Creation Date",
          type: "date",
          key: "createdAt",
          date: {
            enabledRange: true,
            enabledTime: false,
            dateRange: {
              keys: {
                from: "from",
                to: "to",
              },
            },
          },
        },
      ],
      api: {
        apiPath: "/users",
        method: "GET",
        params: new HttpParams().set("type", "internal"),
      },
      apiDataKey: "data",
      countApi: {
        apiPath: "/users/count",
        method: "GET",
        params: new HttpParams().set("type", "internal"),
      },
      countApiDataKey: "data.count",
      pagination: {
        pageSizeOptions: [50, 100],
      },
      header: "Internal Users",
    };

    this.fabButtonConfig = {
      icon: {
        name: "add",
        tooltip: "Add Internal User",
      },
      type: "modal",
      position: CanFabButtonPosition.BottomRight,
      modal: {
        component: CreateInternalUsersComponent,
        inputData: [],
        width: 600,
        header: "Add Internal User",
      },
      permission: {
        type: "single",
        match: { key: "CREATE_USER", value: true },
      },
    };
  }
}
