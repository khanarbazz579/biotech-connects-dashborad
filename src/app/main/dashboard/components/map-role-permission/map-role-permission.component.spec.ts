import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRolePermissionComponent } from './map-role-permission.component';

describe('MapRolePermissionComponent', () => {
  let component: MapRolePermissionComponent;
  let fixture: ComponentFixture<MapRolePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRolePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
