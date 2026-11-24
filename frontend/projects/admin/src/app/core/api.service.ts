import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuditEntry,
  Conference,
  ConferenceInput,
  Milestone,
  MilestoneInput,
  Status,
  User,
  UserCreate,
  UserUpdate
} from './models';

/** A readable message from a failed request (FastAPI sends `detail` as text or as a list of field errors). */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Cannot reach the server. Check your connection and that the API is running.';
    const detail = (error.error as { detail?: unknown } | null)?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item: { loc?: (string | number)[]; msg?: string }) => `${(item.loc ?? []).slice(1).join(' ')}: ${item.msg ?? 'invalid'}`.replace(/^: /, ''))
        .join('; ');
    }
    return `The server returned an error (${error.status}).`;
  }
  return 'Something went wrong.';
}

/** Thin typed wrapper over the backend API. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  conferences(): Promise<Conference[]> {
    return firstValueFrom(this.http.get<Conference[]>(`${this.base}/conferences`));
  }
  createConference(body: ConferenceInput): Promise<Conference> {
    return firstValueFrom(this.http.post<Conference>(`${this.base}/conferences`, body));
  }
  updateConference(id: number, body: Partial<ConferenceInput>): Promise<Conference> {
    return firstValueFrom(this.http.patch<Conference>(`${this.base}/conferences/${id}`, body));
  }
  deleteConference(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/conferences/${id}`));
  }

  history(): Promise<Milestone[]> {
    return firstValueFrom(this.http.get<Milestone[]>(`${this.base}/history`));
  }
  createMilestone(body: MilestoneInput): Promise<Milestone> {
    return firstValueFrom(this.http.post<Milestone>(`${this.base}/history`, body));
  }
  updateMilestone(id: number, body: Partial<MilestoneInput>): Promise<Milestone> {
    return firstValueFrom(this.http.patch<Milestone>(`${this.base}/history/${id}`, body));
  }
  deleteMilestone(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/history/${id}`));
  }

  users(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${this.base}/users`));
  }
  createUser(body: UserCreate): Promise<User> {
    return firstValueFrom(this.http.post<User>(`${this.base}/users`, body));
  }
  updateUser(id: number, body: UserUpdate): Promise<User> {
    return firstValueFrom(this.http.patch<User>(`${this.base}/users/${id}`, body));
  }
  audit(): Promise<AuditEntry[]> {
    return firstValueFrom(this.http.get<AuditEntry[]>(`${this.base}/users/audit/log`));
  }

  changePassword(current_password: string, new_password: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.base}/auth/me/password`, { current_password, new_password }));
  }
}

export type { Status };
