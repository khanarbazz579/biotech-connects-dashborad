import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CanNavigationService } from "src/@can/services/navigation/navigation.service";
import { CanSidenav } from "src/@can/types/navigation.type";
import { CanNav } from "src/@can/types/app-core.type";
import { CanAuthService } from "src/@can/services/auth/auth.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CanBreakpointObserverService } from "src/@can/services/breakpoint-observer/breakpoint-observer.service";
import { CanIconType } from "src/@can/types/shared.type";


/** @title Responsive sidenav */
@Component({
  selector: "can-sidenav",
  templateUrl: "can-sidenav.component.html",
  styleUrls: ["can-sidenav.component.scss"],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      ),
    ]),
  ],
})
export class CanSidenavComponent implements OnInit, OnDestroy {
  navigations: CanSidenav[] = [];

  navConfig: CanNav;

  CanIconType = CanIconType;

  @ViewChild("snav", { static: true }) snav: any;

  public isSmallScreen: boolean;



  constructor(
    private navigationService: CanNavigationService,
    private authService: CanAuthService,
    private breakpointObserverService: CanBreakpointObserverService,
  

  ) {
    // Nav Config Init
    this.navConfig = this.navigationService.getNavConfig();
  }

  ngOnInit() {
  
    this.navigations = this.navigationService.getSideNavigations();
    this.breakpointObserverService.isSmallScreen.subscribe((res) => {
      this.isSmallScreen = res;
    });
    
  }

  // Logout
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {}


  /**
   *
   * @param nav :CanSidenav
   * Change state of the group
   */
  changeGroupState(nav: CanSidenav) {
    // Check state
    if (nav.expanded) {
      // collapse
      this.collapseNestedGroups(nav);
    } else {
      // Expand
      nav.expanded = true;
    }
  }

  /**
   *
   * @param nav :CanSidenav
   * Collapse group and its childs
   */
  collapseNestedGroups(nav: CanSidenav) {
    // Collapse
    nav.expanded = false;
    nav.group.forEach((element) => {
      // Check for group type
      if (element.type === "group") {
        this.collapseNestedGroups(element);
      }
    });
  }

  fullscreen() {
    let elem = document.documentElement;
    let methodToBeInvoked =
      elem.requestFullscreen ||
      elem["webkitRequestFullScreen"] ||
      elem["mozRequestFullscreen"] ||
      elem["msRequestFullscreen"];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  isFullScreen() {
    const full_screen_element =
      document.fullscreenElement ||
      document["webkitFullscreenElement"] ||
      document["mozFullScreenElement"] ||
      document["msFullscreenElement"] ||
      null;

    // If no element is in full-screen
    if (full_screen_element === null) return false;
    else return true;
  }

  exitFullScreen() {
    let elem = document;
    let methodToBeInvoked =
      document.exitFullscreen ||
      document["mozCancelFullScreen"] ||
      document["webkitExitFullscreen"] ||
      document["msExitFullscreen"];
    if (methodToBeInvoked) methodToBeInvoked.call(elem);
  }

  /**
   * Close side navigation on mobile view
   */
  closeSideNav() {
    if (this.isSmallScreen) {
      this.snav.close();
    }
  }
}
