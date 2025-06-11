import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentListComponent } from '../department/department-list';

describe('DepartmentList', () => {
  let component: DepartmentListComponent;
  let fixture: ComponentFixture<DepartmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
