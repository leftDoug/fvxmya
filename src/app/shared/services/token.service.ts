import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly AUTH_TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';
  private jwtHelper = new JwtHelperService();
  private isRefreshing = false;

  constructor() {}

  saveTokens(authToken: string, refreshToken: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, authToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    const decodedToken = this.jwtHelper.decodeToken(token);

    if (decodedToken) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    }

    return true;
  }

  removeTokens(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  startRefreshing(): void {
    this.isRefreshing = true;
  }

  stopRefreshing(): void {
    this.isRefreshing = true;
  }

  getIsRefreshing(): boolean {
    return this.isRefreshing;
  }

  hasTokens(): boolean {
    return !!this.getAuthToken() && !!this.getRefreshToken();
  }
}
