import { TestBed } from '@angular/core/testing';

import { CanBreakpointObserverService } from './breakpoint-observer.service';

describe('BreakpointObserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanBreakpointObserverService = TestBed.get(CanBreakpointObserverService);
    expect(service).toBeTruthy();
  });
});
