import { TestBed } from '@angular/core/testing';

import { EmployeeService } from '../../services/employee/employee.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

// describe('Employee', () => {
//   let service: EmployeeService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(EmployeeService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });



describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch employees', () => {
    const mockEmployees = [{ id: 1, name: 'devisha' }, { id: 2, name: 'isha' }];

    service.getEmployees().subscribe(employee => {
      expect(employee).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne('http://localhost:5119/api/Employee');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  //post call

  it('should test add employee', () => {
    const mockEmployee = { id: 1, name: 'devisha' };
    const response = 
  });
});