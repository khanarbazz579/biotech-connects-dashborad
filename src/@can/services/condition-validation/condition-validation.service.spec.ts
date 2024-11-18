import { TestBed } from '@angular/core/testing';

import { CanConditionValidationService } from './condition-validation.service';

describe('ConditionValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanConditionValidationService = TestBed.get(CanConditionValidationService);
    expect(service).toBeTruthy();
  });
});
