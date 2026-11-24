import { Routes } from '@angular/router';
import { signedInGuard, superAdminGuard } from './core/guards';

export const routes: Routes = [
  { path: 'login', title: 'Sign in · VCK Admin', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  {
    path: '',
    canActivate: [signedInGuard],
    loadComponent: () => import('./pages/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'conferences' },
      { path: 'conferences', title: 'Conferences · VCK Admin', loadComponent: () => import('./pages/conferences/conferences.component').then((m) => m.ConferencesComponent) },
      { path: 'history', title: 'History · VCK Admin', loadComponent: () => import('./pages/history/history.component').then((m) => m.HistoryComponent) },
      { path: 'users', title: 'Users · VCK Admin', canActivate: [superAdminGuard], loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent) },
      { path: 'audit', title: 'Activity log · VCK Admin', canActivate: [superAdminGuard], loadComponent: () => import('./pages/audit/audit.component').then((m) => m.AuditComponent) },
      { path: 'account', title: 'My account · VCK Admin', loadComponent: () => import('./pages/account/account.component').then((m) => m.AccountComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
