import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth-guard';
import { CookieService } from 'ngx-cookie-service';

describe('authGuard (Jest)', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockCookieService: jest.Mocked<CookieService>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...params) =>
    TestBed.runInInjectionContext(() => authGuard(...params));

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockCookieService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<CookieService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CookieService, useValue: mockCookieService },
      ],
    });
  });

  it('should return true if token exists', () => {
    mockCookieService.get.mockReturnValue('valid-token');

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should return false and navigate to /login if token is missing', () => {
    mockCookieService.get.mockReturnValue('');

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
