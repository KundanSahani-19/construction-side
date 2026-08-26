import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl =
    'https://construction-side-api.onrender.com/api/auth';

  private readonly tokenKey = 'authToken';
  private readonly userKey = 'authUser';

  constructor(private http: HttpClient) {}

  // ==========================================
  // LOGIN
  // ==========================================

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        email: email.trim(),
        password
      }
    ).pipe(

      tap((response) => {

        if (
          response.success &&
          response.token
        ) {

          localStorage.setItem(
            this.tokenKey,
            response.token
          );

          if (response.user) {

            localStorage.setItem(
              this.userKey,
              JSON.stringify(response.user)
            );

          }

        }

      })

    );
  }

  // ==========================================
  // TOKEN
  // ==========================================

  getToken(): string | null {
    return localStorage.getItem(
      this.tokenKey
    );
  }

  // ==========================================
  // USER
  // ==========================================

  getUser(): AuthUser | null {

    const user =
      localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {

      return JSON.parse(user) as AuthUser;

    } catch {

      return null;

    }
  }

  // ==========================================
  // LOGIN STATUS
  // ==========================================

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.userKey
    );

  }
}