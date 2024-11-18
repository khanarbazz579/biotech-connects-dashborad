// In-Built Modules
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Custom Modules
import { CanModule } from "src/@can/can.module";
import { MainModule } from "./main/main.module";
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [
    // Main Component
    AppComponent,
  ],
  imports: [
    // In-Built Module
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Core Module
    CanModule,
    // APP Main Module
    MainModule,
    // APP Routing Module
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})

// Exports
export class AppModule {}
// /home/ankush/canProjects/can-frontend-boilerplate/src/app/main/dashboard/components/orders