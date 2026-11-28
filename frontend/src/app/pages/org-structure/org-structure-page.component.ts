import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, Input, OnDestroy, signal, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { createContactAnimation } from '../contact/contact-animation';
import { ORG_COPY, ORG_LEVELS, ORG_ROLES, OrgRole } from './data/org-structure.data';
import { TeamFlowId } from './data/org-team-hierarchy.data';
import { ORG_TEAMS, TEAM_COPY } from './data/org-teams.data';
import { createGlidingRows, GlidingRows } from './org-rows';
import { OpenTeam, OrgTeamOverlayComponent } from './org-team-overlay.component';
import { OrgTeamsComponent } from './org-teams.component';

const BY_ID = new Map(ORG_ROLES.map((role) => [role.id, role]));
const MAX_RESULTS = 8;

/**
 * Org Structure > Org View: the organisation as an interactive chart, read from top to bottom so it fits a phone.
 * The main line of command runs down the middle; offices sit beside it (all always shown); the local bodies run
 * as parallel branches that join again at the polling booth. Choosing a role lights up its line from the President and
 * opens a panel (a bottom sheet on phones) with who it reports to and who works under it.
 * On phones, roles of the same level sit in a row that moves slowly sideways (see org-rows.ts).
 */
@Component({
  selector: 'vck-org-structure-page',
  standalone: true,
  imports: [NgTemplateOutlet, OrgTeamsComponent, OrgTeamOverlayComponent],
  templateUrl: './org-structure-page.component.html',
  // reuses the contact page's page / heading / button styles (the `ct-*` classes), then adds its own
  styleUrls: ['../contact/contact-page.component.scss', './org-structure-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgStructurePageComponent implements AfterViewInit, OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  @Input({ required: true }) language: 'en' | 'ta' = 'en';
  @ViewChild('pageRoot', { static: true }) private pageRoot!: ElementRef<HTMLElement>;

  readonly copy = ORG_COPY;
  readonly levels = ORG_LEVELS;
  readonly teamsTitle = TEAM_COPY.title;

  readonly selectedId = signal<string | null>(null);
  readonly query = signal('');
  /** The team whose hierarchy is open over the page. */
  readonly teamOpen = signal<OpenTeam | null>(null);
  readonly selected = computed(() => {
    const id = this.selectedId();
    return id ? (BY_ID.get(id) ?? null) : null;
  });
  /** The chosen role and everyone above it. */
  readonly line = computed<ReadonlySet<string>>(() => {
    const found = new Set<string>();
    const visit = (id: string): void => {
      if (found.has(id)) return;
      found.add(id);
      BY_ID.get(id)?.parents.forEach(visit);
    };
    const id = this.selectedId();
    if (id) visit(id);
    return found;
  });
  /** From the President down to the chosen role (where lines join, the first one is shown). */
  readonly chain = computed<OrgRole[]>(() => {
    const chain: OrgRole[] = [];
    for (let role = this.selected(); role; role = role.parents.length ? (BY_ID.get(role.parents[0]) ?? null) : null) chain.unshift(role);
    return chain;
  });
  readonly parents = computed(() => (this.selected()?.parents ?? []).map((id) => BY_ID.get(id)!));
  readonly children = computed(() => {
    const id = this.selectedId();
    return id ? ORG_ROLES.filter((role) => role.parents.includes(id)) : [];
  });
  /** Search matches either language, whatever language the page is in. */
  readonly results = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) return [];
    return ORG_ROLES.filter((role) =>
      [role.title, role.scope, ...(role.members ?? [])].some((pair) => !!pair && `${pair.en} ${pair.ta}`.toLowerCase().includes(term))
    ).slice(0, MAX_RESULTS);
  });

  private disposeAnimation?: () => void;
  private rows?: GlidingRows;
  private destroyed = false;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.rows = createGlidingRows(
      Array.from(this.pageRoot.nativeElement.querySelectorAll<HTMLElement>('.og-row')),
      () => this.selectedId() !== null || this.query().trim() !== '' || this.teamOpen() !== null
    );
    void createContactAnimation(this.pageRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) dispose();
        else this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the organisation page animation.', error)
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
    this.rows?.dispose();
  }

  role(id: string): OrgRole {
    return BY_ID.get(id)!;
  }

  /** Choosing the same role again lets go of it. */
  select(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
    // phones: the details open as a bottom sheet, so move a card it would cover up into the visible part
    if (this.selectedId() === id && this.sheetLayout()) window.setTimeout(() => this.keepAboveSheet(id), 40);
  }

  /** Narrow screens show the details as a bottom sheet (keep in step with the stylesheet). */
  private sheetLayout(): boolean {
    return matchMedia('(max-width: 1000px)').matches;
  }

  private card(id: string): HTMLElement | null {
    return this.pageRoot.nativeElement.querySelector<HTMLElement>(`#org-${id}`);
  }

  private scrollBehaviour(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  private keepAboveSheet(id: string): void {
    const card = this.card(id);
    if (!card) return;
    const box = card.getBoundingClientRect();
    // the sheet takes up to 62% of the screen
    if (box.top < 0 || box.bottom > window.innerHeight * 0.36) card.scrollIntoView({ block: 'start', behavior: this.scrollBehaviour() });
  }

  clear(): void {
    this.selectedId.set(null);
  }

  /** Choose a role from the panel or the search and bring it into view. */
  show(id: string): void {
    this.selectedId.set(id);
    this.query.set('');
    window.setTimeout(() => {
      const card = this.card(id);
      // `inline` brings a card in a sideways row (phones) to the middle of it
      card?.scrollIntoView({ block: this.sheetLayout() ? 'start' : 'center', inline: 'center', behavior: this.scrollBehaviour() });
      card?.focus({ preventScroll: true });
    }, 60);
  }

  /** From the committee's details: open a body's own hierarchy. */
  openFlow(flow: TeamFlowId, event: Event): void {
    const team = ORG_TEAMS.find((t) => t.flow === flow);
    if (team) this.teamOpen.set({ team, from: event.currentTarget as HTMLElement });
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    const first = this.results()[0];
    if (first) this.show(first.id);
  }

  /** From a role's panel down to the list of teams (the panel closes so it does not cover the list). */
  showTeams(): void {
    this.clear();
    window.setTimeout(() => this.jump('teams'), 60);
  }

  jump(levelId: string): void {
    this.pageRoot.nativeElement.querySelector(`#level-${levelId}`)?.scrollIntoView({ block: 'start', behavior: this.scrollBehaviour() });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.teamOpen()) return; // the window over the page handles its own Escape
    if (this.query()) this.query.set('');
    else this.clear();
  }
}
