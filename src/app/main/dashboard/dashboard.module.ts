// In-Built Modules
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { CanSharedModule } from "src/@can/modules/shared.module";
import { DashboardRouteModule } from "./dashboard.route";
import { RouterModule } from "@angular/router";
import { WelcomeComponent } from "./components/welcome/welcome.component";

import { InternalsComponent } from "./components/internals/internals.component";
import { AddUserRoleComponent } from "./components/add-user-role/add-user-role.component";
import { RolesComponent } from "./components/roles/roles.component";
import { CreateRolesComponent } from "./components/roles/create-roles/create-roles.component";
import { EditRolesComponent } from "./components/roles/edit-roles/edit-roles.component";
import { PermissionComponent } from "./components/permission/permission.component";
import { CreatePermissionComponent } from "./components/permission/create-permission/create-permission.component";
import { EditPermissionComponent } from "./components/permission/edit-permission/edit-permission.component";
import { MapRolePermissionComponent } from "./components/map-role-permission/map-role-permission.component";
import { InternalDetailsComponent } from "./components/internals/internal-details/internal-details.component";
import { CreateInternalUsersComponent } from "./components/internals/create-internal-users/create-internal-users.component";

import { EditInternalComponent } from "./components/internals/edit-internal/edit-internal.component";
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { EditUserComponent } from './components/users/edit-user/edit-user.component';
import { MapUserRoleComponent } from "./components/users/map-user-role/map-user-role.component";
import { EditUserRoleComponent } from "./components/users/edit-user-role/edit-user-role.component";

import { BlogsComponent } from './components/blogs/blogs.component';
import { CreateBlogsComponent } from './components/blogs/create-blogs/create-blogs.component';
import { EditBlogsComponent } from './components/blogs/edit-blogs/edit-blogs.component';

@NgModule({
  declarations: [
    DashboardComponent,
    WelcomeComponent,
    InternalsComponent,
    AddUserRoleComponent,
    RolesComponent,
    CreateRolesComponent,
    EditRolesComponent,
    PermissionComponent,
    CreatePermissionComponent,
    EditPermissionComponent,
    MapRolePermissionComponent,
   
    InternalDetailsComponent,
    CreateInternalUsersComponent,
    MapUserRoleComponent,
    EditUserRoleComponent,
    EditInternalComponent,
    
    UsersComponent,
    AddUserComponent,
    EditUserComponent,

    BlogsComponent,
    CreateBlogsComponent,
    EditBlogsComponent,
  ],
  imports: [CanSharedModule, RouterModule],
  exports: [
    // Routes
    DashboardRouteModule,
  ],
  entryComponents: [
    AddUserRoleComponent,
    CreateRolesComponent,
    EditRolesComponent,
    CreatePermissionComponent,
    EditPermissionComponent,
    MapRolePermissionComponent,
    CreateInternalUsersComponent,
    MapUserRoleComponent,
    EditInternalComponent,
    EditUserRoleComponent,
    
    

    AddUserComponent,
    EditUserComponent,

    EditUserRoleComponent,

    CreateBlogsComponent,
    EditBlogsComponent
  ],
})
export class DashboardModule {}
