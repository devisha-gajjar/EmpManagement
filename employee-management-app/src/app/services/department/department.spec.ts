import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService } from './department.service';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DepartmentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch departments', () => {
    const mockDepartments = [{ id: 1, name: 'HR' }, { id: 2, name: 'IT' }];

    service.getDepartments().subscribe(departments => {
      expect(departments).toEqual(mockDepartments);
    });

    const req = httpMock.expectOne('http://localhost:5119/api/Department');
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });
});
