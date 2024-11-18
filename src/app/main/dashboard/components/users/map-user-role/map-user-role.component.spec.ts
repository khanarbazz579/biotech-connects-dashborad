import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapUserRoleComponent } from './map-user-role.component';

describe('MapUserRoleComponent', () => {
  let component: MapUserRoleComponent;
  let fixture: ComponentFixture<MapUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
