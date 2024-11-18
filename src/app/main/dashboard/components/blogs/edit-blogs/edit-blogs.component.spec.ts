import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlogsComponent } from './edit-blogs.component';

describe('EditBlogsComponent', () => {
  let component: EditBlogsComponent;
  let fixture: ComponentFixture<EditBlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
