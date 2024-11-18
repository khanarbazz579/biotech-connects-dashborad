// In-Built Modules
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { InternalsComponent } from "./components/internals/internals.component";
import { RolesComponent } from "./components/roles/roles.component";
import { PermissionComponent } from "./components/permission/permission.component";
import { InternalDetailsComponent } from "./components/internals/internal-details/internal-details.component";

import { UsersComponent } from "./components/users/users.component";

import { BlogsComponent } from "./components/blogs/blogs.component";
/**
 * Declare App Related all routes here
 */
const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        redirectTo: "welcome",
        pathMatch: "full",
      },
      {
        path: "welcome",
        component: WelcomeComponent,
      },
   
    
      {
        path: "users",
        component: UsersComponent,
      },

      {
        path: "internal/:id",
        component: InternalDetailsComponent,
      },
      {
        path: "roles",
        component: RolesComponent,
      },
      {
        path: "permissions",
        component: PermissionComponent,
      },

      {
        path: 'blogs',
        component: BlogsComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouteModule {}
