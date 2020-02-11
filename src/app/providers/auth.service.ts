import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import AuthData from '../models/AuthData.model';
import Token from '../models/Token.model';
import { AuthorizationType } from '../models/AuthorizationType.models';

const apiUrl = `${environment.apiUrl}`;
const signupPath = `${apiUrl}/${environment.signUpPath}`;
const loginPath = `${apiUrl}/${environment.loginPath}`;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private token: string | Token = '';
  private tokenTimeout: any;
  private tokenDetails: Token;
  private userId: string;
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  registration(authData: AuthData) {
    try {
      this.http.post(signupPath, authData).subscribe(() => {
        this.access(authData);
        this.router.navigate(['/dashboard']);
      });
    } catch (err) {
      this.authStatusListener.next(false);
    }
  }
  access(authData: AuthData) {
    this.http.post(loginPath, authData).subscribe((response: Token) => {
      const token = response.token;
      this.token = token;
      this.authStatusListener.next(true);
      if (token) {
        this.getTokenTimeout(response.expiresIn);
        this.isAuthenticated = true;
        this.userId = response.id;
        this.authStatusListener.next(true);

        const { type, expiresIn } = response;
        this.storeAuthData({ token, expiresIn, id: this.userId, type });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  logoutUser() {
    this.isAuthenticated = false;
    this.token = null;
    clearTimeout(this.tokenTimeout);
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    this.authStatusListener.next(false);
  }

  getAuthStatus(): Token {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    const id = localStorage.getItem('id');
    const type = localStorage.getItem('type');

    if (token && expiresIn) {
      return {
        token,
        expiresIn: Number(expiresIn),
        id,
        type: type as AuthorizationType,
      };
    }
  }

  autoConfigAuthUser() {
    this.tokenDetails = this.getAuthStatus();
    if (!this.tokenDetails) {
      return;
    }
    const timestamp = new Date();
    const expirationDate = this.tokenDetails.expiresIn - timestamp.getTime();
    if (expirationDate > 0) {
      this.token = this.tokenDetails.token;
      this.isAuthenticated = true;
      this.getTokenTimeout(expirationDate / 1000);
      this.authStatusListener.next(true);
    }
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
  }

  storeAuthData(data: Token) {
    const timeStamp = new Date();
    const expireIn = timeStamp.getTime() + data.expiresIn * 5000;
    localStorage.setItem('token', data.token);
    localStorage.setItem('expiresIn', expireIn.toString());
    localStorage.setItem('id', data.id);
    localStorage.setItem('type', data.type);
  }

  getTokenTimeout(expiresIn: number) {
    this.tokenTimeout = setTimeout(() => {
      this.logoutUser();
    }, expiresIn * 1000);
  }
}