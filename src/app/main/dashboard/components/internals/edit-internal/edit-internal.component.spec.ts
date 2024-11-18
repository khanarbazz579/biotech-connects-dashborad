import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInternalComponent } from './edit-internal.component';

describe('EditInternalComponent', () => {
  let component: EditInternalComponent;
  let fixture: ComponentFixture<EditInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
