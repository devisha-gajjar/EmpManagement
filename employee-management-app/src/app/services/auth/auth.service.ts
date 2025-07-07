import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiUrl = 'http://localhost:5119/api/Auth/';

    constructor(private http: HttpClient) { }

    login(credentials: any): Observable<any> {
        return this.http.post(this.apiUrl + "login", credentials);
    }

    googleLogin(data: { idToken: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}google-login`, data);
    }

    facebookLogin(data: { accessToken: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}facebook-login`, data);
    }
}   