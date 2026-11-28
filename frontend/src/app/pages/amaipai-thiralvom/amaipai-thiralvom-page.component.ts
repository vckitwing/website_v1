import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeaturedBookComponent } from '../../shared/featured-book/featured-book.component';

/** Publications > Amaipai Thiralvom: the floating 3D book on its own page (the home page shows the same book). */
@Component({
  selector: 'vck-amaipai-thiralvom-page',
  standalone: true,
  imports: [FeaturedBookComponent],
  templateUrl: './amaipai-thiralvom-page.component.html',
  styleUrl: './amaipai-thiralvom-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmaipaiThiralvomPageComponent {
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
}
