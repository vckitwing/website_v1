import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ROLE_LABELS } from '../../core/models';

interface NavItem {
  path: string;
  label: string;
  /** SVG path (24x24 viewBox, stroked) for the small icon. */
  icon: string;
}

interface NavGroup {
  title: string;
  superAdminOnly: boolean;
  items: NavItem[];
}

@Component({
  selector: 'adm-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  readonly roleLabels = ROLE_LABELS;

  /** Phones: whether the side menu is slid open. (On wider screens it is always visible.) */
  readonly menuOpen = signal(false);

  readonly groups: NavGroup[] = [
    {
      title: 'Content',
      superAdminOnly: false,
      items: [
        { path: '/conferences', label: 'Conferences', icon: 'M4 20V9l8-5 8 5v11M9 20v-6h6v6' },
        { path: '/history', label: 'History', icon: 'M12 7v5l3 2M21 12a9 9 0 1 1-3-6.7M21 4v5h-5' },
        { path: '/publications', label: 'Publications', icon: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11' },
        { path: '/media', label: 'Media', icon: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5h.01' }
      ]
    },
    {
      title: 'Administration',
      superAdminOnly: true,
      items: [
        { path: '/users', label: 'Users', icon: 'M16 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M20 20v-1a4 4 0 0 0-3-3.9M16 4.2a3.5 3.5 0 0 1 0 6.6' },
        { path: '/audit', label: 'Activity', icon: 'M4 6h16M4 12h16M4 18h10' }
      ]
    }
  ];

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
