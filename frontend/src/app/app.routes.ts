import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // =========================
  // LOGIN
  // =========================
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(m => m.Login)
  },

  // =========================
  // DEFAULT
  // =========================
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // =========================
  // DASHBOARD
  // =========================
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  // =========================
  // SITES
  // =========================
  {
    path: 'sites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/sites/sites')
        .then(m => m.Sites)
  },

  // =========================
  // LABOUR
  // =========================
  {
    path: 'labour',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/labour/labour')
        .then(m => m.LabourComponent)
  },

  // =========================
  // LABOUR STATEMENT
  // =========================
  {
    path: 'labour-statement/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/labour-statement/labour-statement')
        .then(m => m.LabourStatement)
  },

  // =========================
  // MEASUREMENTS
  // =========================
  {
    path: 'measurements',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/measurements/measurements')
        .then(m => m.Measurements)
  },

  // =========================
  // TEAMS / JODI
  // =========================
  {
    path: 'teams',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/teams/teams')
        .then(m => m.Teams)
  },

  // =========================
  // ATTENDANCE
  // =========================
  {
    path: 'attendance',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/attendance/attendance')
        .then(m => m.AttendanceComponent)
  },

  // =========================
  // LABOUR TRANSFER
  // =========================
  {
    path: 'transfers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/transfers/transfers')
        .then(m => m.Transfers)
  },

  // =========================
  // CLIENT PAYMENTS
  // =========================
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/payments/payments')
        .then(m => m.Payments)
  },

  // =========================
  // UNKNOWN URL
  // =========================
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];