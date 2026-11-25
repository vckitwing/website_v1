import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role, TokenResponse, User } from './models';

const TOKEN_KEY = 'vck-admin-token';

/** Sign-in state. The token lives in sessionStorage, so closing the tab signs you out. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly signedIn = computed(() => this.user() !== null);
  readonly isSuperAdmin = computed(() => this.user()?.role === 'super_admin');
  /** Editors and super admins publish; contributors only save drafts. */
  readonly canPublish = computed(() => this.hasRole('super_admin', 'editor'));

  hasRole(...roles: Role[]): boolean {
    const user = this.user();
    return !!user && roles.includes(user.role);
  }

  token(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, { email, password }));
    try {
      sessionStorage.setItem(TOKEN_KEY, response.access_token);
    } catch {
      /* the session then lasts until reload */
    }
    this.user.set(response.user);
  }

  /** Restores the signed-in user after a page reload; false when there is no valid session. */
  async restore(): Promise<boolean> {
    if (this.user()) return true;
    if (!this.token()) return false;
    try {
      this.user.set(await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/auth/me`)));
      return true;
    } catch {
      this.clear();
      return false;
    }
  }

  logout(): void {
    this.clear();
    void this.router.navigate(['/login']);
  }

  private clear(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    this.user.set(null);
  }
}
