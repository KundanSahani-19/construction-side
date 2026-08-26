import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  private apiUrl =
    'https://construction-side-api.onrender.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Email enter karo.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Password enter karo.';
      return;
    }

    this.loading = true;

    this.http.post<any>(
      `${this.apiUrl}/login`,
      {
        email: this.email.trim(),
        password: this.password
      }
    ).subscribe({

      next: (response) => {

        this.loading = false;

        if (!response?.success || !response?.token) {
          this.errorMessage =
            response?.message || 'Login failed.';
          return;
        }

        // JWT token save
        localStorage.setItem(
          'authToken',
          response.token
        );

        // User information save
        if (response.user) {
          localStorage.setItem(
            'authUser',
            JSON.stringify(response.user)
          );
        }

        // Dashboard par redirect
        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Login failed. Please try again.';

      }

    });
  }
}