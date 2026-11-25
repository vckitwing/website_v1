/** The monthly magazine "Namathu Thamizhman" is the publication whose web address name is this. */
export const TAMIL_LAND_SLUG = 'namathu-thamizhman';

type Pair = { readonly en: string; readonly ta: string };

export const TAMIL_LAND_COPY = {
  eyebrow: { en: 'PUBLICATIONS', ta: 'வெளியீடுகள்' } as Pair,
  title: { en: 'Our Tamil Land', ta: 'நமது தமிழ்மண்' } as Pair,
  fallbackLede: { en: 'The monthly magazine of Viduthalai Chiruthaigal Katchi.', ta: 'விடுதலைச் சிறுத்தைகள் கட்சியின் மாத இதழ்.' } as Pair,
  latest: { en: 'Latest issue', ta: 'புதிய இதழ்' } as Pair,
  read: { en: 'Read this issue', ta: 'இந்த இதழைப் படிக்க' } as Pair,
  openLabel: { en: 'Read the latest issue', ta: 'புதிய இதழைப் படிக்க' } as Pair,
  note: { en: 'Read it here, online. This magazine cannot be downloaded or copied.', ta: 'இங்கேயே இணையத்தில் படிக்கலாம். இந்த இதழைப் பதிவிறக்கவோ நகலெடுக்கவோ முடியாது.' } as Pair,
  emptyTitle: { en: 'The first issue is coming soon', ta: 'முதல் இதழ் விரைவில்' } as Pair,
  emptyText: { en: 'Please check back shortly.', ta: 'சிறிது நேரத்தில் மீண்டும் வருக.' } as Pair,
  volume: { en: 'Vol', ta: 'தொகுதி' } as Pair,
  issue: { en: 'Issue', ta: 'இதழ்' } as Pair,
  pages: { en: 'pages', ta: 'பக்கங்கள்' } as Pair,
  months: {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்']
  }
} as const;
