/**
 * The organisation inside a team, as supplied by the owner (flowcharts), shown when its card is opened.
 * Every team uses the common structure unless `org-teams.data.ts` gives it another one by id.
 */
import type { Pair } from './org-structure.data';

export type TeamFlowId = 'common' | 'youth' | 'women';

/** One step down a team's chart: one role, or roles of the same level side by side. */
export interface TeamFlowStep {
  readonly roles: readonly Pair[];
  /** The line to this step comes from the second role of the pair above, not from both. */
  readonly fromSecond?: boolean;
}

const role = (ta: string, en: string): Pair => ({ ta, en });

/** The Young Panthers Awakening Wing and the Women's Liberation Movement are organised the same way. */
const SHARED_FLOW: readonly TeamFlowStep[] = [
  { roles: [role('தலைவர்', 'President / Leader')] },
  { roles: [role('மாநில செயலாளர்', 'State Secretary')] },
  { roles: [role('மாநில துணைச் செயலாளர்', 'State Deputy Secretary')] },
  { roles: [role('மாவட்ட செயலாளர்', 'District Secretary')] },
  { roles: [role('நிதி செயலாளர் / பொருளாளர்', 'Finance Secretary / Treasurer'), role('மாவட்ட துணைச் செயலாளர்கள்', 'District Deputy Secretaries')] },
  { roles: [role('ஒன்றிய செயலாளர்கள்', 'Union Secretaries')], fromSecond: true },
  { roles: [role('ஒன்றிய துணைச் செயலாளர்கள்', 'Union Deputy Secretaries')] },
  { roles: [role('கிளை / முகாம் செயலாளர்', 'Branch / Camp Secretary')] }
];

/** All the other teams. */
const COMMON_FLOW: readonly TeamFlowStep[] = [
  { roles: [role('தலைவர்', 'President / Leader')] },
  { roles: [role('மாநில செயலாளர்', 'State Secretary')] },
  { roles: [role('மாநில துணைச் செயலாளர்', 'State Deputy Secretary')] },
  { roles: [role('மாவட்ட அமைப்பாளர்கள்', 'District Organizers')] },
  { roles: [role('நிதி செயலாளர் அல்லது பொருளாளர்', 'Finance Secretary or Treasurer'), role('மாவட்ட துணை அமைப்பாளர்கள்', 'District Deputy Organizers')] },
  { roles: [role('ஒன்றிய செயலாளர்கள்', 'Union Secretaries')], fromSecond: true },
  { roles: [role('ஒன்றிய துணைச் செயலாளர்கள்', 'Union Deputy Secretaries')] }
];

export const TEAM_FLOWS: Readonly<Record<TeamFlowId, readonly TeamFlowStep[]>> = {
  common: COMMON_FLOW,
  youth: SHARED_FLOW,
  women: SHARED_FLOW
};

export const TEAM_FLOW_COPY = {
  view: { en: 'View structure', ta: 'கட்டமைப்பைக் காண்க' } as Pair,
  heading: { en: 'Organisation structure', ta: 'அமைப்புக் கட்டமைப்பு' } as Pair,
  close: { en: 'Close', ta: 'மூடு' } as Pair
} as const;
