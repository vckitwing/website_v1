/** The featured book is the publication whose web address name is this (else the first published book). */
export const BOOK_SLUG = 'amaipai-thiralvom';

type Pair = { readonly en: string; readonly ta: string };

export const BOOK_COPY = {
  eyebrow: { en: 'PUBLICATIONS', ta: 'வெளியீடுகள்' } as Pair,
  homeEyebrow: { en: 'THE BOOK', ta: 'நூல்' } as Pair,
  fallbackTitle: { en: 'Amaippai Thiralvom', ta: 'அமைப்பாய்த் திரள்வோம்' } as Pair,
  by: { en: 'By', ta: 'ஆசிரியர்:' } as Pair,
  pages: { en: 'pages', ta: 'பக்கங்கள்' } as Pair,
  read: { en: 'Read the book', ta: 'புத்தகத்தைப் படிக்க' } as Pair,
  openLabel: { en: 'Open the book and read it', ta: 'புத்தகத்தைத் திறந்து படிக்க' } as Pair,
  hint: { en: 'Move the pointer over the book, then click or tap it to open.', ta: 'சுட்டியைப் புத்தகத்தின் மேல் நகர்த்தி, திறக்க அழுத்துங்கள்.' } as Pair,
  note: { en: 'Read it here, online. This book cannot be downloaded or copied.', ta: 'இங்கேயே இணையத்தில் படிக்கலாம். இந்த நூலைப் பதிவிறக்கவோ நகலெடுக்கவோ முடியாது.' } as Pair,
  emptyTitle: { en: 'The book will be here soon', ta: 'நூல் விரைவில் இங்கே' } as Pair,
  emptyText: { en: 'Please check back shortly.', ta: 'சிறிது நேரத்தில் மீண்டும் வருக.' } as Pair
} as const;
