import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, signal, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { CONTACT_COPY, CONTACT_EMAIL, OFFICE, OFFICE_MAP_URL } from './data/contact.data';
import { createContactAnimation } from './contact-animation';

@Component({
  selector: 'vck-contact-page',
  standalone: true,
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent implements AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('pageRoot', { static: true }) private pageRoot!: ElementRef<HTMLElement>;

  readonly copy = CONTACT_COPY;
  readonly email = CONTACT_EMAIL;
  readonly office = OFFICE;
  readonly mapUrl = OFFICE_MAP_URL;
  readonly copied = signal(false);

  private disposeAnimation?: () => void;
  private copiedTimer?: number;
  private destroyed = false;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    void createContactAnimation(this.pageRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) dispose();
        else this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK contact page animation.', error)
    );
  }

  /** Copies the office address (the e-mail address is a mailto link already). */
  copyAddress(): void {
    const text = `${this.office.label.en}, ${this.office.address.en}`;
    const done = (): void => {
      this.copied.set(true);
      window.clearTimeout(this.copiedTimer);
      this.copiedTimer = window.setTimeout(() => this.copied.set(false), 2200);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => undefined);
    }
  }

  /** There is no mail server behind this site, so the form hands the message to the visitor's own email app. */
  compose(event: Event, form: HTMLFormElement): void {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim() || this.copy.defaultSubject[this.language];
    const message = String(data.get('message') ?? '').trim();
    const body = name ? `${message}\n\n— ${name}` : message;
    window.location.href = `mailto:${this.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.copiedTimer);
    this.disposeAnimation?.();
  }
}
