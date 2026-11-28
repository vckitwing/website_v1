/**
 * What search engines and link previews show for each page, in both languages. Keep titles under about 60 characters
 * and descriptions under about 160. The wording is a draft for the party to confirm.
 */
import type { Language, PageName } from '../routing/pages';

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** The short name used in the breadcrumb. */
  readonly name: string;
}

export const SITE_NAME: Record<Language, string> = {
  ta: 'விடுதலைச் சிறுத்தைகள் கட்சி',
  en: 'Viduthalai Chiruthaigal Katchi'
};

export const SHARE_IMAGE = {
  path: 'seo/share.jpg',
  width: 1200,
  height: 630,
  alt: { ta: 'விடுதலைச் சிறுத்தைகள் கட்சி', en: 'Viduthalai Chiruthaigal Katchi' } as Record<Language, string>
} as const;

export const PAGE_SEO: Record<PageName, Record<Language, PageSeo>> = {
  home: {
    ta: {
      title: 'விடுதலைச் சிறுத்தைகள் கட்சி (விசிக) — அதிகாரப்பூர்வ இணையதளம்',
      description: 'விடுதலைச் சிறுத்தைகள் கட்சியின் (விசிக) அதிகாரப்பூர்வ இணையதளம்: தலைவர் தொல். திருமாவளவன், கொள்கைகள், இயக்க வரலாறு, மாநாடுகள் மற்றும் அமைப்பு.',
      name: 'முகப்பு'
    },
    en: {
      title: 'Viduthalai Chiruthaigal Katchi (VCK) — Official Website',
      description: 'The official website of Viduthalai Chiruthaigal Katchi (VCK): President Thol. Thirumavalavan, ideology, movement history, conferences and organisation.',
      name: 'Home'
    }
  },
  contact: {
    ta: { title: 'தொடர்புக்கு — விடுதலைச் சிறுத்தைகள் கட்சி', description: 'விசிக தலைமை அலுவலக முகவரி (அசோக் நகர், சென்னை) மற்றும் மின்னஞ்சல். கட்சிக்கு எழுதுங்கள்.', name: 'தொடர்புக்கு' },
    en: { title: 'Contact — Viduthalai Chiruthaigal Katchi (VCK)', description: 'VCK head office address in Ashok Nagar, Chennai, and the party’s email. Write to us.', name: 'Contact' }
  },
  donate: {
    ta: { title: 'நன்கொடை — விடுதலைச் சிறுத்தைகள் கட்சி', description: 'விடுதலைச் சிறுத்தைகள் கட்சிக்கு நன்கொடை வழங்கும் வழிகள் பற்றிய விவரங்கள்.', name: 'நன்கொடை' },
    en: { title: 'Donate — Viduthalai Chiruthaigal Katchi (VCK)', description: 'How to donate to Viduthalai Chiruthaigal Katchi.', name: 'Donate' }
  },
  'tamil-land': {
    ta: { title: 'நமது தமிழ்மண் — விசிக மாத இதழ்', description: 'விடுதலைச் சிறுத்தைகள் கட்சியின் மாத இதழ் “நமது தமிழ்மண்”: புதிய இதழையும் முந்தைய இதழ்களையும் இணையத்தில் படியுங்கள்.', name: 'நமது தமிழ்மண்' },
    en: { title: 'Our Tamil Land (Namathu Thamizhman) — VCK Monthly', description: 'Namathu Thamizhman, the monthly magazine of Viduthalai Chiruthaigal Katchi: read the latest and earlier issues online.', name: 'Our Tamil Land' }
  },
  'amaipai-thiralvom': {
    ta: { title: 'அமைப்பாய்த் திரள்வோம் — நூல் | விசிக', description: '“அமைப்பாய்த் திரள்வோம்” நூலை இணையத்தில் படியுங்கள்.', name: 'அமைப்பாய்த் திரள்வோம்' },
    en: { title: 'Amaipai Thiralvom — the book | VCK', description: 'Read the book “Amaipai Thiralvom” (Organise and unite) online.', name: 'Amaipai Thiralvom' }
  },
  'org-structure': {
    ta: { title: 'கட்சியின் அமைப்புக் கட்டமைப்பு — விசிக', description: 'விசிக அமைப்பு வரைபடம்: தலைவர் முதல் வாக்குச்சாவடி வரையிலான பொறுப்புகள், அணிகள், இயக்கங்கள் மற்றும் பேரவைகள்.', name: 'அமைப்பு வரைபடம்' },
    en: { title: 'Organisation Structure — VCK', description: 'How VCK is organised: roles from the President to the polling booth, and the party’s wings, movements and councils.', name: 'Org View' }
  }
};
