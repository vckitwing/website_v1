import type { Thinker } from './thinker.types';

export const THINKERS: readonly Thinker[] = [
  {
    id: 'ambedkar',
    number: '01',
    monogram: 'B. R.',
    name: { en: 'Dr. B. R. Ambedkar', ta: 'அண்ணல் அம்பேத்கர்' },
    imagePath: 'assets/Ideology_leaders/Dr.%20B.R.%20Ambedkar.png',
    imageCredit: null
  },
  {
    id: 'periyar',
    number: '02',
    monogram: 'E. V. R.',
    name: { en: 'E. V. Ramasamy (Periyar)', ta: 'தந்தை பெரியார்' },
    imagePath: 'assets/Ideology_leaders/periyar.jpg',
    imageCredit: null
  },
  {
    id: 'marx',
    number: '03',
    monogram: 'K. M.',
    name: { en: 'Karl Marx', ta: 'கார்ல் மார்க்ஸ்' },
    imagePath: 'assets/Ideology_leaders/karl_max.jpg',
    imageCredit: null
  }
];
