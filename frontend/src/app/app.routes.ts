import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Routes } from '@angular/router';
import { PAGE_PATHS } from './routing/pages';

/**
 * The router only owns the address. `AppComponent` reads it and shows the page itself (the home sections stay mounted
 * between pages), so every route points at this empty component.
 */
@Component({
  selector: 'vck-page-route',
  standalone: true,
  templateUrl: './page-route.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageRouteComponent {}

export const routes: Routes = [
  ...PAGE_PATHS.map((path) => ({ path, component: PageRouteComponent, pathMatch: 'full' as const })),
  { path: '**', component: PageRouteComponent }
];
