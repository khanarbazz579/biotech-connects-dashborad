// In-Built
import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

// Packages
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanBreakpointObserverService {
  public isSmallScreen = new BehaviorSubject(false);

  constructor(private breakpointObserver: BreakpointObserver) {

    /**
     * Observe Media Size 
     */
    breakpointObserver.observe([
      '(max-width: 768px)'
    ]).subscribe(result => {
      if (result.matches) {
        return this.isSmallScreen.next(true)
      } else {
        return this.isSmallScreen.next(false)
      }
    });
  }
}
