import { Routes } from '@angular/router';

export const routes: Routes = [

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
    loadComponent: () =>
      import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
  },


  // =========================
  // SITES
  // =========================

  {
    path: 'sites',
    loadComponent: () =>
      import('./pages/sites/sites')
        .then(m => m.Sites)
  },


  // =========================
  // LABOUR
  // =========================

  {
    path: 'labour',
    loadComponent: () =>
      import('./pages/labour/labour')
        .then(m => m.LabourComponent)
  },


  // =========================
  // LABOUR STATEMENT
  // =========================

  {
    path: 'labour-statement/:id',
    loadComponent: () =>
      import('./pages/labour-statement/labour-statement')
        .then(m => m.LabourStatement)
  },


  // =========================
  // MEASUREMENTS
  // =========================

  {
    path: 'measurements',
    loadComponent: () =>
      import('./pages/measurements/measurements')
        .then(m => m.Measurements)
  },


  // =========================
  // TEAMS / JODI
  // =========================

  {
    path: 'teams',
    loadComponent: () =>
      import('./pages/teams/teams')
        .then(m => m.Teams)
  },


  // =========================
  // ATTENDANCE
  // =========================

  {
    path: 'attendance',
    loadComponent: () =>
      import('./pages/attendance/attendance')
        .then(m => m.AttendanceComponent)
  },


  // =========================
  // LABOUR TRANSFER
  // =========================

  {
    path: 'transfers',
    loadComponent: () =>
      import('./pages/transfers/transfers')
        .then(m => m.Transfers)
  },


  // =========================
  // CLIENT PAYMENTS
  // =========================

  {
    path: 'payments',
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