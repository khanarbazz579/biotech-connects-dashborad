import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CanDetailView } from "src/@can/types/detail-view.type";
import { CanTabView } from "src/@can/types/tab-view.type";

@Component({
  selector: "app-internal-details",
  templateUrl: "./internal-details.component.html",
  styleUrls: ["./internal-details.component.scss"],
})
export class InternalDetailsComponent implements OnInit {
  public internalId: any;

  public detailViewData: CanDetailView;
  public tabViewConfig: CanTabView;

  constructor(private activedRoute: ActivatedRoute) {
    // Fetching Path Params
    this.activedRoute.paramMap.subscribe(
      (paramMap) => (this.internalId = parseInt(paramMap.get("id")))
    );
  }

  ngOnInit() {
    // Detail View Config Init
    this.detailViewData = {
      discriminator: "detailViewConfig",
      columnPerRow: 1,
      labelPosition: "top",

      action: [
  
      ],
      displayedFields: [
        {
          type: "group",
          group: {
            columnPerRow: 4,
            labelPosition: "top",
            displayedFields: [
              {
                header: "First Name",
                type: "text",
                value: "firstName",
              },
              {
                header: "Middle Name",
                type: "text",
                value: "middleName",
              },
              {
                header: "Last Name",
                type: "text",
                value: "lastName",
              },
              {
                header: "Name",
                type: "text",
                value: "firstName middleName lastName",
                keySeparators: [" "],
              },
              {
                header: "Email",
                type: "text",
                value: "email",
              },
              // {
              //   header:'Business Name',
              //   type:'text',
              //   value:'businessName'
              // },
              {
                header: "Phone",
                type: "text",
                value: "mobile",
              },
              {
                header: "Type",
                type: "text",
                value: "type",
              },
              {
                header: "Status",
                type: "text",
                value: "status",
              },
            ],
          },
        },
      ],
      header: "Internal Information",
      api: {
        apiPath: `/users/${this.internalId}`,
        method: "GET",
      },
    };
  }


}
