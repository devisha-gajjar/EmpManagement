import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { DepartmentService } from './department.service';
import { Department } from '../../types/department.model';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DepartmentService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch departments via GET', () => {
    const mockDepartments: Department[] = [
      { id: 1, name: 'Finance' },
      { id: 2, name: 'Engineering' }
    ];

    service.getDepartments().subscribe(departments => {
      expect(departments.length).toBe(2);
      expect(departments).toEqual(mockDepartments);
    });

    const req = httpMock.expectOne('http://localhost:5119/api/Department');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(mockDepartments);
  });
});
