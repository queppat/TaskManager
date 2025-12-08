import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError, firstValueFrom } from 'rxjs';
import { TokenManager, TokenValidation } from './token-manager.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id?: number;
  username?: string;
  email?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenManager = inject(TokenManager);

  private readonly userSignal = signal<User | null>(null);
  private readonly loadingSignal = signal(true);
  private readonly initializedSignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly initialized = this.initializedSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  readonly apiUrl = '/api/auth';

  async initialize(): Promise<void> {
    if (this.initializedSignal()) {
      return;
    }

    this.loadingSignal.set(true);

    try {
      const token = this.tokenManager.getToken();

      if (!token) {
        this.userSignal.set(null);
        this.loadingSignal.set(false);
        this.initializedSignal.set(true);
        return;
      }

      const validation = this.tokenManager.validateToken(token);

      switch (validation.reason) {
        case 'VALID':
          this.userSignal.set(validation.user);
          this.loadingSignal.set(false);
          this.initializedSignal.set(true);
          break;

        case 'EXPIRED': {
          try {
            await firstValueFrom(this.refreshToken());
            const newToken = this.tokenManager.getToken();
            const newValidation = this.tokenManager.validateToken(newToken || '');

            if (newValidation.reason === 'VALID') {
              this.userSignal.set(newValidation.user);
            } else {
              this.userSignal.set(null);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            this.userSignal.set(null);
          }
          this.loadingSignal.set(false);
          this.initializedSignal.set(true);
          break;
        }

        case 'NO_TOKEN':
        case 'INVALID_TOKEN':
        default:
          this.userSignal.set(null);
          this.loadingSignal.set(false);
          this.initializedSignal.set(true);
          break;
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.userSignal.set(null);
      this.loadingSignal.set(false);
      this.initializedSignal.set(true);
    }
  }

  async refresh(): Promise<boolean> {
    try {
      await firstValueFrom(this.refreshToken());
      return !!this.getToken();
    } catch (error) {
      console.error('Refresh token failed:', error);
      await this.logout();
      return false;
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setAuthData(response);
        this.loadingSignal.set(false);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        this.setAuthData(response);
        this.loadingSignal.set(false);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        this.loadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/logout`, null, {
          headers: new HttpHeaders(),
          withCredentials: true,
          responseType: 'text'
        }).pipe(
          catchError((error) => {
            console.log('Logout request failed:', error);
            return throwError(() => error);
          })
        )
      );
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      this.clearAuthData();
      this.router.navigate(['/login']);
    }
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, null, {
      headers: new HttpHeaders(),
      withCredentials: true
    }).pipe(
      tap((response) => {
        this.setAuthData(response);
      }),
      catchError((error) => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private setAuthData(response: AuthResponse): void {
    if (response.accessToken) {
      this.tokenManager.setToken(response.accessToken);
      const user = this.tokenManager.getUserFromToken(response.accessToken);
      if (user) {
        this.userSignal.set(user);
      }
    }
  }

  clearAuthData(): void {
    this.tokenManager.clearToken();
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenManager.getToken();
  }

  getUser(): User | null {
    return this.userSignal();
  }

  validateToken(): TokenValidation {
    return this.tokenManager.validateToken();
  }
}