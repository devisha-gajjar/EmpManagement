import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthService (without TestBed)', () => {
    let httpClientMock: jest.Mocked<HttpClient>;
    let service: AuthService;

    beforeEach(() => {
        // Creating mock of HttpClient --> alternative of the testbed
        httpClientMock = {
            post: jest.fn(),
        } as unknown as jest.Mocked<HttpClient>;

        // using that mock to the service
        service = new AuthService(httpClientMock);
    });

    it('should call login API with correct data', () => {
        const credentials = { username: 'user', password: 'pass' };
        const response = { token: 'abc123' };
        httpClientMock.post.mockReturnValue(of(response));
        
        service.login(credentials).subscribe(res => {
            expect(res).toEqual(response);
        });

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'http://localhost:5119/api/Auth/login',
            credentials
        );
    });

    it('should call googleLogin API with correct token', () => {
        const data = { idToken: 'google-token' };
        const response = { success: true };
        httpClientMock.post.mockReturnValue(of(response));

        service.googleLogin(data).subscribe(res => {
            expect(res).toEqual(response);
        });

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'http://localhost:5119/api/Auth/google-login',
            data
        );
    });

    it('should call facebookLogin API with correct token', () => {
        const data = { accessToken: 'fb-token' };
        const response = { success: true };
        httpClientMock.post.mockReturnValue(of(response));

        service.facebookLogin(data).subscribe(res => {
            expect(res).toEqual(response);
        });

        expect(httpClientMock.post).toHaveBeenCalledWith(
            'http://localhost:5119/api/Auth/facebook-login',
            data
        );
    });
});
