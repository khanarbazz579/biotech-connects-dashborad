import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInternalUsersComponent } from './create-internal-users.component';

describe('CreateInternalUsersComponent', () => {
  let component: CreateInternalUsersComponent;
  let fixture: ComponentFixture<CreateInternalUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInternalUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInternalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
