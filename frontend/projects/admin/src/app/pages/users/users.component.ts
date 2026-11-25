import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ROLE_LABELS, Role, User } from '../../core/models';

@Component({
  selector: 'adm-users',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly roles: Role[] = ['super_admin', 'editor', 'contributor'];
  readonly roleLabels = ROLE_LABELS;
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly formError = signal('');
  readonly saving = signal(false);
  readonly editing = signal<User | null>(null);

  readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    role: ['contributor' as Role],
    is_active: [true],
    password: ['']
  });

  constructor() {
    void this.load();
  }

  isMe(user: User): boolean {
    return this.auth.user()?.id === user.id;
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      this.users.set(await this.api.users());
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  openForm(user: User | null): void {
    this.editing.set(user);
    this.formError.set('');
    this.form.reset(
      user
        ? { email: user.email, name: user.name, role: user.role, is_active: user.is_active, password: '' }
        : { email: '', name: '', role: 'contributor', is_active: true, password: '' }
    );
    // a new user needs a password; an existing one keeps theirs unless a new one is typed
    const password = this.form.controls.password;
    password.setValidators(user ? [] : [Validators.required]);
    password.updateValueAndValidity();
    if (user) this.form.controls.email.disable();
    else this.form.controls.email.enable();
    this.dialog().nativeElement.showModal();
  }

  closeForm(): void {
    this.dialog().nativeElement.close();
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    const v = this.form.getRawValue();
    const current = this.editing();
    try {
      if (current) {
        const saved = await this.api.updateUser(current.id, {
          name: v.name.trim(),
          role: v.role,
          is_active: v.is_active,
          ...(v.password ? { password: v.password } : {})
        });
        this.users.update((list) => list.map((u) => (u.id === saved.id ? saved : u)));
      } else {
        const saved = await this.api.createUser({ email: v.email.trim(), name: v.name.trim(), role: v.role, password: v.password });
        this.users.update((list) => [...list, saved].sort((a, b) => a.name.localeCompare(b.name)));
      }
      this.closeForm();
    } catch (error) {
      this.formError.set(errorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }
}
