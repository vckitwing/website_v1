import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, inject, signal, ViewChild } from '@angular/core';
import { SiteContentService } from '../../../../shared/content/site-content.service';
import { createHistoryAnimation } from './history-animation';

@Component({
  selector: 'vck-history-section',
  standalone: true,
  templateUrl: './history-section.component.html',
  styleUrl: './history-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistorySectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly milestones = inject(SiteContentService).history;
  readonly activeIndex = signal(0);

  private disposeAnimation?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createHistoryAnimation(this.sectionRoot.nativeElement, this.milestones.length, (index) => {
      if (this.activeIndex() !== index) this.activeIndex.set(index);
    }).then(
      (dispose) => {
        if (this.destroyed) {
          dispose();
          return;
        }
        this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK history animation.', error)
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
  }
}
