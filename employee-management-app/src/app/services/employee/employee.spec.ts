import { TestBed } from '@angular/core/testing';

import { EmployeeService } from '../../services/employee/employee.service';

describe('Employee', () => {
  let service: EmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
