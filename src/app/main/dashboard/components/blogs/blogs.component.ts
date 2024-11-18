import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CanFabButton, CanFabButtonPosition } from 'src/@can/types/fab-button.type';
import { CanIconType } from 'src/@can/types/shared.type';
import { CanTable } from 'src/@can/types/table.type';
import { CreateBlogsComponent } from './create-blogs/create-blogs.component';
import { EditBlogsComponent } from './edit-blogs/edit-blogs.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

  constructor() {}
  public tableData: CanTable;
  public fabButtonConfig: CanFabButton;

  ngOnInit() {
    // Table Data Init
    this.tableData = {
      discriminator: "tableConfig",
      displayedColumns: [
        {
          header: 'Image',
          type: 'image',
          images: {
            showAll: true,
            openType: 'modal',
            imageItems: [
              {
                type: 'api',
                isArray: false,
                alt: 'Preview',
                value: 'bannedImage'
              }
            ]
          }
        },
        {
          header: "title",
          type: "text",
          value: "title",
        },

        {
          header: "description",
          type: "text",
          value: "description",
        },
       
        {
          header: "Author",
          type: "text",
          value: "createdBy.name",
        },
       
     
        {
          header: 'Status',
          type: 'enum_icon',
          value: 'status',
          enumIcons: [
            {
              value: "pending",
              icon: {
                type: CanIconType.Material,
                name: "fiber_manual_record",
                tooltip: "pending",
                color: "#ffeb3b",
              },
            },
            {
              value: "published",
              icon: {
                type: CanIconType.Material,
                name: "fiber_manual_record",
                tooltip: "approved",
                color: "#10d817",
              },
            },
            {
              value: "reject",
              icon: {
                type: CanIconType.Material,
                name: "fiber_manual_record",
                tooltip: "reject",
                color: "#ee3f37",
              },
            },
          ],
        },
        {
          header: "Created At",
          type: "date",
          value: "createdAt",
          dateDisplayType: "dd/MM/yy",
        },
        {
          header: "Published At",
          type: "date",
          value: "publishedAt",
          dateDisplayType: "dd/MM/yy",
        },
      ],
      fieldActions: [
        // {
        //   action: {
        //     actionType: "link",
        //     link: {
        //       url: "/dashboard/Balance/${id}",
        //       target: "self",
        //       type: "url",
        //     },
        //   },
        //   icon: {
        //     type: CanIconType.Material,
        //     name: "note_add",
        //     tooltip: "Balance Detail",
        //     color: "blue",
        //   },
        // },
        {
          action: {
            actionType: 'ajax',
            api: {
              apiPath: '/blogs/${id}',
              method: 'PATCH'
            },
            bodyParams: [
              {
                key: 'status',
                value: 'approved'
              }
            ],
            confirm: {
              title: 'Change Status',
              message: 'Are you sure you want to approved?',
              buttonText: {
                confirm: 'Confirm',
                cancel: 'Cancel'
              }
            },
            displayCondition: {
              type: 'single',
              match: {
                key: 'status',
                value: 'approved',
                operator: 'notEquals'
              }
            },
          },
          icon: {
            type: CanIconType.Flaticon,
            name: 'flaticon-round-done-button',
            tooltip: 'Verify',
            color: 'green'
          },
        },
        {
          action: {
            actionType: 'ajax',
            api: {
              apiPath: '/blogs/${id}',
              method: 'PATCH'
            },
            bodyParams: [
              {
                key: 'status',
                value: 'reject'
              }
            ],
            confirm: {
              title: 'Change Status',
              message: 'Are you sure you want to reject blog',
              buttonText: {
                confirm: 'Confirm',
                cancel: 'Cancel'
              }
            },
            displayCondition: {
              type: 'single',
              match: {
                key: 'status',
                value: 'reject',
                operator: 'notEquals'
              }
            },
          },
          icon: {
            type: CanIconType.Flaticon,
            name: 'flaticon-round-delete-button',
            tooltip: 'Reject',
            color: 'red'
          },
        },
        {
          action: {
            actionType: "modal",
            modal: {
              component: EditBlogsComponent,
              inputData: [
                {
                  inputKey: "blogId",
                  type: "key",
                  key: "id",
                },
              ],
              header: "Edit Blog",
              width: 600,
            },
          },
          icon: {
            name: "edit",
            tooltip: "Edit Blog",
          },
        },
      ],
      filters: [
      
      ],
      api: {
        apiPath: "/blogs",
        method: "GET",
        params: new HttpParams()            
        .append('include', JSON.stringify([{ all: true }]))
        .append("order", JSON.stringify([['id', 'ASC']]))
      },
      countApi: {
        apiPath: "/blogs/count",
        method: "GET",
      },
      countApiDataKey: "count",
      pagination: {
        pageSizeOptions: [50, 100],
      },
      header: "Blogs",
    };

    this.fabButtonConfig = {
      icon: {
        name: "add",
        tooltip: "Add Blog",
      },
      type: "modal",
      position: CanFabButtonPosition.BottomRight,
      modal: {
        component: CreateBlogsComponent,
        inputData: [
        ],
        width: 600,
        header: "Add Blog",
      },
    };
  }
}
