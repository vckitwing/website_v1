import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, Input, OnDestroy, signal, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { createContactAnimation } from '../contact/contact-animation';
import { DEFAULT_AMOUNT, DONATE_COPY, DONATION, DONATION_AMOUNTS } from './data/donate.data';

@Component({
  selector: 'vck-donate-page',
  standalone: true,
  templateUrl: './donate-page.component.html',
  // The donate page reuses the contact page's page / card / button styles (the `ct-*` classes), then adds its own.
  styleUrls: ['../contact/contact-page.component.scss', './donate-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonatePageComponent implements AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('pageRoot', { static: true }) private pageRoot!: ElementRef<HTMLElement>;

  readonly copy = DONATE_COPY;
  readonly donation = DONATION;
  readonly amounts = DONATION_AMOUNTS;
  readonly amount = signal(DEFAULT_AMOUNT);
  /** Key of the value that was just copied (to show "Copied" on its button for a moment). */
  readonly copiedKey = signal<string | null>(null);

  /** The UPI deep link for the chosen amount: it opens the visitor's UPI app (phones; desktops usually ignore it). */
  readonly upiHref = computed(() => {
    const params = new URLSearchParams({
      pa: this.donation.upi.id,
      pn: this.donation.upi.payeeName,
      am: String(this.amount()),
      cu: 'INR',
      tn: 'Donation to VCK'
    });
    return `upi://pay?${params.toString()}`;
  });

  readonly bankRows = [
    { key: 'name', label: this.copy.accountName, value: this.donation.bank.accountName },
    { key: 'number', label: this.copy.accountNumber, value: this.donation.bank.accountNumber },
    { key: 'ifsc', label: this.copy.ifsc, value: this.donation.bank.ifsc },
    { key: 'bank', label: this.copy.bank, value: this.donation.bank.bankBranch },
    { key: 'type', label: this.copy.accountType, value: this.donation.bank.accountType }
  ] as const;

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
      (error: unknown) => console.error('Unable to initialize the VCK donate page animation.', error)
    );
  }

  choose(value: number): void {
    this.amount.set(value);
  }

  /** A typed amount: whole rupees, at least 1 (anything else keeps the current amount). */
  setCustom(raw: string): void {
    const value = Math.floor(Number(raw));
    if (Number.isFinite(value) && value >= 1) this.amount.set(Math.min(value, 10_000_000));
  }

  copyValue(key: string, text: string): void {
    if (!navigator.clipboard?.writeText) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copiedKey.set(key);
      window.clearTimeout(this.copiedTimer);
      this.copiedTimer = window.setTimeout(() => this.copiedKey.set(null), 2200);
    }, () => undefined);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.copiedTimer);
    this.disposeAnimation?.();
  }
}
