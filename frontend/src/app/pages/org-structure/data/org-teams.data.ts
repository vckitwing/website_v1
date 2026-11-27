/**
 * The party's teams (wings, movements, councils, centres), as supplied by the owner, in the supplied order and wording
 * (the repeated Social Harmony Council and students' body entries were removed at the owner's request).
 * `kind` is only for the filter buttons and follows the word the Tamil name ends with
 * (அணி / பாசறை = wing, இயக்கம் = movement, பேரவை = council, மையம் = centre, anything else = other).
 */
export type TeamKind = 'wing' | 'movement' | 'council' | 'centre' | 'other';

export interface OrgTeam {
  readonly kind: TeamKind;
  readonly name: { readonly ta: string; readonly en: string };
}

const team = (kind: TeamKind, ta: string, en: string): OrgTeam => ({ kind, name: { ta, en } });

export const ORG_TEAMS: readonly OrgTeam[] = [
  team('other', 'கட்சி', 'Party'),
  team('wing', 'இளஞ்சிறுத்தைகள் எழுச்சி பாசறை', 'Young Panthers Awakening Wing / Camp'),
  team('movement', 'மகளிர் விடுதலை இயக்கம்', 'Women’s Liberation Movement'),
  team('movement', 'உழைக்கும் மக்கள் பண்பாட்டு இயக்கம்', 'Working People’s Cultural Movement'),
  team('wing', 'பொறியாளர் அணி', 'Engineers’ Wing'),
  team('centre', 'விளையாட்டு திறன் மேம்பாட்டு மையம்', 'Sports Skill Development Center'),
  team('council', 'அரசு ஊழியர் ஐக்கியப் பேரவை', 'Government Employees’ United Council'),
  team('centre', 'மருத்துவ தொண்டு மையம்', 'Medical Service Center'),
  team('council', 'கிறித்தவ சமூக நீதி பேரவை', 'Christian Social Justice Council'),
  team('movement', 'சுற்றுச்சூழல் பாதுகாப்பு இயக்கம்', 'Environmental Protection Movement'),
  team('wing', 'வணிகர் அணி', 'Traders’ / Merchants’ Wing'),
  team('council', 'சமூக நல்லிணக்கப் பேரவை', 'Social Harmony Council'),
  team('other', 'தொழிலாளர் விடுதலை முன்னணி (அமைப்பு சார்)', 'Labour Liberation Front (Organized Sector)'),
  team('other', 'தொழிலாளர் விடுதலை முன்னணி (அமைப்பு சாரா)', 'Labour Liberation Front (Unorganized Sector)'),
  team('movement', 'நில உரிமை மீட்பு இயக்கம்', 'Land Rights Retrieval / Reclamation Movement'),
  team('movement', 'விவசாயத் தொழிலாளர் விடுதலை இயக்கம்', 'Agricultural Workers’ Liberation Movement'),
  team('council', 'இசுலாமிய ஜனநாயக பேரவை', 'Islamic Democratic Council'),
  team('movement', 'கல்வி பொருளாதார விழிப்புணர்வு இயக்கம்', 'Education & Economic Awareness Movement'),
  team('wing', 'தொண்டரணி (பயிற்சி)', 'Volunteer Wing (Training)'),
  team('movement', 'மது மற்றும் போதைப் பொருள் ஒழிப்பு விழிப்புணர்வு இயக்கம்', 'Liquor & Narcotics Eradication Awareness Movement'),
  team('council', 'கலை மற்றும் இலக்கியப் பேரவை', 'Art & Literature Council'),
  team('wing', 'முற்போக்கு மாணவர் அணி/கழகம் (பள்ளி / கல்லூரி)', 'Progressive Students’ Wing / Federation (School / College)'),
  team('movement', 'விவசாய பாதுகாப்பு இயக்கம்', 'Agriculture Protection Movement'),
  team('wing', 'தொண்டரணி (பாதுகாப்பு)', 'Volunteer Wing (Security / Protection)'),
  team('centre', 'ஆவண மையம்', 'Documentation / Archive Center'),
  team('centre', 'காட்சி ஊடக மையம்', 'Visual Media Center'),
  team('centre', 'சமூக ஊடக மையம்', 'Social Media Center'),
  team('wing', 'தகவல் தொழில்நுட்ப அணி', 'Information Technology (IT) Wing'),
  team('centre', 'அச்சு ஊடக மையம்', 'Print Media Center'),
  team('movement', 'தூய்மை பணியாளர் மேம்பாட்டு இயக்கம்', 'Sanitation Workers’ Welfare / Development Movement'),
  team('other', 'தொழிலாளர் விடுதலை முன்னணி (TASMAC)', 'Labour Liberation Front (TASMAC)'),
  team('wing', 'வழக்கறிஞர் அணி', 'Lawyers’ Wing'),
  team('other', 'அனைத்து ஆசிரியர் கூட்டமைப்பு', 'All Teachers’ Federation'),
  team('council', 'மீனவர் மேம்பாட்டு பேரவை', 'Fishermen Welfare / Development Council'),
  team('wing', 'ஓவியர் அணி', 'Painters’ / Artists’ Wing'),
  team('council', 'தமிழ்தேசிய எழுச்சி பேரவை', 'Tamil Nationalist Awakening Council'),
  team('other', 'சமத்துவ வழக்கறிஞர் சங்கம்', 'Equality Lawyers’ Association'),
  team('other', 'கருத்தியல் பரப்பு குழு', 'Ideological Propaganda / Outreach Committee')
];

/** The word shown at the top of a team's card. */
export const TEAM_KIND_LABELS: Record<TeamKind, { readonly en: string; readonly ta: string }> = {
  wing: { en: 'Wing', ta: 'அணி' },
  movement: { en: 'Movement', ta: 'இயக்கம்' },
  council: { en: 'Council', ta: 'பேரவை' },
  centre: { en: 'Centre', ta: 'மையம்' },
  other: { en: 'Body', ta: 'அமைப்பு' }
};

export const TEAM_FILTERS: readonly { readonly id: 'all' | TeamKind; readonly en: string; readonly ta: string }[] = [
  { id: 'all', en: 'All', ta: 'அனைத்தும்' },
  { id: 'wing', en: 'Wings', ta: 'அணிகள்' },
  { id: 'movement', en: 'Movements', ta: 'இயக்கங்கள்' },
  { id: 'council', en: 'Councils', ta: 'பேரவைகள்' },
  { id: 'centre', en: 'Centres', ta: 'மையங்கள்' },
  { id: 'other', en: 'Others', ta: 'பிற' }
];

export const TEAM_COPY = {
  title: { en: 'Teams and wings', ta: 'அணிகளும் அமைப்புகளும்' },
  lede: { en: 'The bodies through which the party works with different sections of people.', ta: 'பல்வேறு மக்கள் பிரிவினருடன் கட்சி செயல்படும் அமைப்புகள்.' },
  search: { en: 'Find a team', ta: 'அணியைத் தேடுக' },
  searchPlaceholder: { en: 'For example: women, media', ta: 'எடுத்துக்காட்டு: மகளிர், ஊடக' },
  filter: { en: 'Show by type', ta: 'வகை வாரியாகக் காட்டு' },
  none: { en: 'No team matches.', ta: 'பொருந்தும் அணி எதுவும் இல்லை.' },
  reset: { en: 'Show all teams', ta: 'அனைத்து அணிகளையும் காட்டு' }
} as const;
