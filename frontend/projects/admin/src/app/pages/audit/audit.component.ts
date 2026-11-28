import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiService, errorMessage } from '../../core/api.service';
import { AuditEntry } from '../../core/models';

@Component({
  selector: 'adm-audit',
  imports: [DatePipe],
  templateUrl: './audit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditComponent {
  private readonly api = inject(ApiService);
  readonly entries = signal<AuditEntry[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.entries.set(await this.api.audit());
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }
}
