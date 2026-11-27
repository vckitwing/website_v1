/**
 * The party's organisation, as supplied by the owner (a flowchart). `parents` are the reporting lines; the chart's
 * shape (which role sits on the main line, which beside it) is described separately in `ORG_LEVELS`.
 */
export type Pair = { readonly en: string; readonly ta: string };

export interface OrgRole {
  readonly id: string;
  readonly title: Pair;
  /** The area or body the role covers. */
  readonly scope?: Pair;
  /** Several roles at this level rank equally. */
  readonly sameCadre?: boolean;
  /** Bodies or people listed inside the role's card. */
  readonly members?: readonly Pair[];
  readonly parents: readonly string[];
}

export const ORG_ROLES: readonly OrgRole[] = [
  // ---- central leadership
  { id: 'president', title: { ta: 'தலைவர்', en: 'President / Leader' }, parents: [] },
  { id: 'general-secretary', title: { ta: 'பொதுச்செயலாளர்', en: 'General Secretary' }, parents: ['president'] },
  { id: 'treasurer', title: { ta: 'பொருளாளர்', en: 'Treasurer' }, parents: ['general-secretary'] },
  { id: 'spokesperson', title: { ta: 'செய்தி தொடர்பாளர்', en: 'Spokesperson' }, parents: ['treasurer'] },
  { id: 'hq-secretary', title: { ta: 'தலைமை நிலையச் செயலாளர்', en: 'Headquarters Secretary' }, parents: ['general-secretary'] },
  { id: 'organizing-secretary', title: { ta: 'அமைப்புச் செயலாளர்', en: 'Organizing Secretary' }, parents: ['general-secretary'] },
  {
    id: 'high-level-committee',
    title: { ta: 'உயர்நிலைக் குழு', en: 'High-Level Committee' },
    scope: { ta: 'செயற்குழு & பொதுக்குழு', en: 'Executive & General Council' },
    parents: ['general-secretary']
  },
  { id: 'deputy-general-secretaries', title: { ta: 'துணைப் பொதுச்செயலாளர்கள்', en: 'Deputy General Secretaries' }, parents: ['general-secretary'] },
  { id: 'state-secretaries', title: { ta: 'மாநிலச் செயலாளர்கள்', en: 'State Secretaries' }, scope: { ta: 'அனைத்து அணிகள்', en: 'All wings' }, parents: ['deputy-general-secretaries'] },

  // ---- zonal
  { id: 'zonal-secretary', title: { ta: 'மண்டலச் செயலாளர்', en: 'Zonal Secretary' }, scope: { ta: '1 நாடாளுமன்ற தொகுதி', en: '1 parliamentary constituency' }, parents: ['state-secretaries'] },
  { id: 'zonal-deputy-assembly', title: { ta: 'மண்டல துணைச் செயலாளர்', en: 'Zonal Deputy Secretary' }, scope: { ta: '2 சட்டமன்ற தொகுதிகள்', en: '2 assembly constituencies' }, parents: ['zonal-secretary'] },
  { id: 'zonal-deputy-admin', title: { ta: 'மண்டல துணைச் செயலாளர்', en: 'Zonal Deputy Secretary' }, scope: { ta: 'பொது நிர்வாகம்', en: 'General administration' }, parents: ['zonal-secretary'] },

  // ---- district
  { id: 'district-secretary', title: { ta: 'மாவட்டச் செயலாளர்', en: 'District Secretary' }, scope: { ta: '1 சட்டமன்ற தொகுதி', en: '1 assembly constituency' }, parents: ['zonal-deputy-assembly'] },
  {
    id: 'district-committee',
    title: { ta: 'மாவட்ட நிர்வாகக் குழு', en: 'District Executive Committee' },
    members: [
      { ta: 'மாவட்ட நிர்வாகக் குழு உறுப்பினர்கள்', en: 'District executive committee members' },
      { ta: 'இளஞ்சிறுத்தை எழுச்சி பாசறை', en: 'Young Panthers Awakening Wing' },
      { ta: 'மகளிர் விடுதலை இயக்கம்', en: 'Women’s Liberation Movement' }
    ],
    parents: ['district-secretary']
  },
  { id: 'district-treasurer', title: { ta: 'மாவட்டப் பொருளாளர் (அ) நிதிச் செயலாளர்', en: 'District Treasurer / Finance Secretary' }, parents: ['district-secretary'] },
  { id: 'district-spokesperson', title: { ta: 'மாவட்டச் செய்தி தொடர்பாளர்', en: 'District Spokesperson' }, parents: ['district-secretary'] },
  { id: 'district-deputies', title: { ta: 'மாவட்ட துணைச் செயலாளர்கள்', en: 'District Deputy Secretaries' }, parents: ['district-secretary'] },
  { id: 'district-organizers', title: { ta: 'மாவட்ட அமைப்பாளர்கள்', en: 'District Organizers' }, parents: ['district-secretary'] },

  // ---- local bodies
  { id: 'union-secretaries', title: { ta: 'ஒன்றியச் செயலாளர்கள்', en: 'Union Secretaries' }, sameCadre: true, parents: ['district-organizers'] },
  { id: 'town-secretaries', title: { ta: 'நகரச் செயலாளர்கள்', en: 'Town / Municipal Secretaries' }, sameCadre: true, parents: ['district-organizers'] },
  { id: 'town-panchayat-secretaries', title: { ta: 'பேரூராட்சிச் செயலாளர்கள்', en: 'Town Panchayat Secretaries' }, sameCadre: true, parents: ['district-organizers'] },
  { id: 'camp-secretaries', title: { ta: 'முகாம் செயலாளர்கள்', en: 'Camp Secretaries' }, sameCadre: true, parents: ['union-secretaries'] },
  { id: 'ward-circle-secretaries', title: { ta: 'வார்டு / வட்டச் செயலாளர்கள்', en: 'Ward / Circle Secretaries' }, sameCadre: true, parents: ['town-secretaries'] },
  { id: 'ward-secretaries', title: { ta: 'வார்டுச் செயலாளர்கள்', en: 'Ward Secretaries' }, sameCadre: true, parents: ['town-panchayat-secretaries'] },

  // ---- booth, volunteers, people
  {
    id: 'booth-agents',
    title: { ta: 'வாக்குச்சாவடி முகவர்கள்', en: 'Polling Booth Agents' },
    scope: { ta: 'BLA1, BLA2', en: 'BLA1, BLA2' },
    parents: ['camp-secretaries', 'ward-circle-secretaries', 'ward-secretaries']
  },
  { id: 'volunteers', title: { ta: 'தொண்டர்கள்', en: 'Volunteers / Cadres' }, parents: ['booth-agents'] },
  { id: 'people', title: { ta: 'மக்கள்', en: 'People' }, scope: { ta: 'பொது மக்கள்', en: 'The general public' }, parents: ['volunteers'] }
];

/** One step down the chart: a role on the main line (with the offices that sit beside it), or parallel branches. */
export type OrgTier =
  | { readonly kind: 'role'; readonly id: string; readonly offices?: readonly string[] }
  | { readonly kind: 'branches'; readonly columns: readonly (readonly string[])[] };

export interface OrgLevel {
  readonly id: 'central' | 'zonal' | 'district' | 'local' | 'ground';
  readonly title: Pair;
  readonly tiers: readonly OrgTier[];
}

export const ORG_LEVELS: readonly OrgLevel[] = [
  {
    id: 'central',
    title: { ta: 'தலைமை', en: 'Central leadership' },
    tiers: [
      { kind: 'role', id: 'president' },
      { kind: 'role', id: 'general-secretary', offices: ['treasurer', 'hq-secretary', 'organizing-secretary', 'high-level-committee'] },
      { kind: 'role', id: 'deputy-general-secretaries' },
      { kind: 'role', id: 'state-secretaries' }
    ]
  },
  {
    id: 'zonal',
    title: { ta: 'மண்டலம்', en: 'Zone' },
    tiers: [
      { kind: 'role', id: 'zonal-secretary', offices: ['zonal-deputy-admin'] },
      { kind: 'role', id: 'zonal-deputy-assembly' }
    ]
  },
  {
    id: 'district',
    title: { ta: 'மாவட்டம்', en: 'District' },
    tiers: [
      { kind: 'role', id: 'district-secretary', offices: ['district-committee', 'district-treasurer', 'district-spokesperson', 'district-deputies'] },
      { kind: 'role', id: 'district-organizers' }
    ]
  },
  {
    id: 'local',
    title: { ta: 'உள்ளாட்சி', en: 'Local bodies' },
    tiers: [
      {
        kind: 'branches',
        columns: [
          ['union-secretaries', 'camp-secretaries'],
          ['town-secretaries', 'ward-circle-secretaries'],
          ['town-panchayat-secretaries', 'ward-secretaries']
        ]
      }
    ]
  },
  {
    id: 'ground',
    title: { ta: 'களம்', en: 'Ground' },
    tiers: [
      { kind: 'role', id: 'booth-agents' },
      { kind: 'role', id: 'volunteers' },
      { kind: 'role', id: 'people' }
    ]
  }
];

export const ORG_COPY = {
  eyebrow: { en: 'ORG STRUCTURE', ta: 'இயக்கக் கட்டமைப்பு' } as Pair,
  title: { en: 'How the party is organised', ta: 'கட்சியின் அமைப்புக் கட்டமைப்பு' } as Pair,
  lede: {
    en: 'From the President to the people: tap any role to see who it reports to and who works under it.',
    ta: 'தலைவர் முதல் மக்கள் வரை: எந்தப் பொறுப்பையும் அழுத்தினால், அது யாருக்குக் கீழ் செயல்படுகிறது, அதன் கீழ் யார் செயல்படுகிறார்கள் என்பதைக் காணலாம்.'
  } as Pair,
  search: { en: 'Find a role', ta: 'பொறுப்பைத் தேடுக' } as Pair,
  searchPlaceholder: { en: 'For example: district, treasurer', ta: 'எடுத்துக்காட்டு: மாவட்டம், பொருளாளர்' } as Pair,
  noResult: { en: 'No role matches.', ta: 'பொருந்தும் பொறுப்பு எதுவும் இல்லை.' } as Pair,
  jump: { en: 'Go to level', ta: 'நிலைக்குச் செல்க' } as Pair,
  sameCadre: { en: 'Same cadre', ta: 'சம நிலை' } as Pair,
  detailsTitle: { en: 'Role details', ta: 'பொறுப்பின் விவரம்' } as Pair,
  detailsHint: { en: 'Choose a role in the chart to see its reporting line.', ta: 'விவரங்களைக் காண வரைபடத்தில் ஒரு பொறுப்பைத் தேர்ந்தெடுக்கவும்.' } as Pair,
  reportsTo: { en: 'Reports to', ta: 'மேல் பொறுப்பு' } as Pair,
  leads: { en: 'Works under this role', ta: 'இதன் கீழ் செயல்படுவோர்' } as Pair,
  chain: { en: 'Line from the President', ta: 'தலைவரிலிருந்து வரும் தொடர்' } as Pair,
  includes: { en: 'Includes', ta: 'இதில் அடங்குவோர்' } as Pair,
  bodies: { en: 'bodies inside', ta: 'அமைப்புகள்' } as Pair,
  nobody: { en: 'None', ta: 'இல்லை' } as Pair,
  close: { en: 'Close', ta: 'மூடு' } as Pair
} as const;
