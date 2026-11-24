import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ROLE_LABELS } from '../../core/models';

@Component({
  selector: 'adm-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  readonly roleLabels = ROLE_LABELS;
  readonly busy = signal(false);
  readonly error = signal('');
  readonly done = signal(false);

  readonly form = inject(FormBuilder).nonNullable.group({
    current: ['', [Validators.required]],
    next: ['', [Validators.required, Validators.minLength(10)]],
    repeat: ['', [Validators.required]]
  });

  async submit(): Promise<void> {
    this.done.set(false);
    const { current, next, repeat } = this.form.getRawValue();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (next !== repeat) {
      this.error.set('The two new passwords do not match.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.changePassword(current, next);
      this.form.reset();
      this.done.set(true);
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }
}
