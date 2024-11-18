// In-Built Modules
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Custom Guards
import { CanAuthGuard } from "src/@can/guards/auth.guard";
import { CanNotFoundComponent } from "src/@can/components/can-not-found/can-not-found.component";

// Load Core Module
const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("src/@can/can.module").then((m) => m.CanModule),
    canActivate: [CanAuthGuard],
  },
  {
    path: "**",
    redirectTo: "404",
    pathMatch: "full",
  },
  {
    path: "404",
    component: CanNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
