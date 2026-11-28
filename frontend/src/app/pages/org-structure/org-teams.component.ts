import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { TEAM_FLOW_COPY } from './data/org-team-hierarchy.data';
import { ORG_TEAMS, OrgTeam, TEAM_COPY, TEAM_FILTERS, TEAM_KIND_LABELS, TeamKind } from './data/org-teams.data';
import type { OpenTeam } from './org-team-overlay.component';

/** The list of the party's teams on the Org View page: search (both languages) and filter by type. */
@Component({
  selector: 'vck-org-teams',
  standalone: true,
  templateUrl: './org-teams.component.html',
  styleUrl: './org-teams.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgTeamsComponent {
  readonly language = input.required<'en' | 'ta'>();
  /** A team with a hierarchy was chosen. */
  readonly openTeam = output<OpenTeam>();

  readonly copy = TEAM_COPY;
  readonly filters = TEAM_FILTERS;
  readonly kindLabels = TEAM_KIND_LABELS;
  readonly flowCopy = TEAM_FLOW_COPY;

  readonly query = signal('');
  readonly kind = signal<'all' | TeamKind>('all');
  /** Search looks at both languages, whatever language the page is in. */
  private readonly found = computed(() => {
    const term = this.query().trim().toLowerCase();
    return term ? ORG_TEAMS.filter((t) => `${t.name.en} ${t.name.ta}`.toLowerCase().includes(term)) : ORG_TEAMS;
  });
  readonly teams = computed(() => (this.kind() === 'all' ? this.found() : this.found().filter((t) => t.kind === this.kind())));
  /** How many each filter button would show. */
  readonly counts = computed(() => {
    const counts: Record<string, number> = { all: this.found().length };
    for (const team of this.found()) counts[team.kind] = (counts[team.kind] ?? 0) + 1;
    return counts;
  });

  readonly summary = computed(() => {
    const shown = this.teams().length;
    const total = ORG_TEAMS.length;
    if (this.language() === 'ta') return shown === total ? `${total} அணிகள்` : `${total} அணிகளில் ${shown}`;
    return shown === total ? `${total} teams` : `${shown} of ${total} teams`;
  });

  show(team: OrgTeam, event: Event): void {
    const button = event.currentTarget as HTMLElement;
    this.openTeam.emit({ team, from: button.closest('li') ?? button });
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  reset(): void {
    this.query.set('');
    this.kind.set('all');
  }
}
