import type { Thinker } from './thinker.types';

export const THINKERS: readonly Thinker[] = [
  {
    id: 'ambedkar',
    number: '01',
    monogram: 'B. R.',
    name: { en: 'Dr. B. R. Ambedkar', ta: 'அண்ணல் அம்பேத்கர்' },
    description: {
      en: 'Indian jurist and social reformer who chaired the Drafting Committee of the Constitution of India and dedicated his life to challenging caste oppression.',
      ta: 'இந்திய அரசியலமைப்பின் வரைவுக் குழுவுக்குத் தலைமை தாங்கிய சட்ட அறிஞரும் சமூக சீர்திருத்தவாதியும்; சாதி ஒடுக்குமுறையை எதிர்க்க வாழ்நாள் முழுவதும் உழைத்தார்.'
    },
    imagePath: 'assets/Ideology_leaders/Dr.%20B.R.%20Ambedkar.png',
    imageCredit: null
  },
  {
    id: 'periyar',
    number: '02',
    monogram: 'E. V. R.',
    name: { en: 'E. V. Ramasamy (Periyar)', ta: 'தந்தை பெரியார்' },
    description: {
      en: 'Tamil social reformer who led the Self-Respect Movement and challenged caste hierarchy and social inequality.',
      ta: 'சுயமரியாதை இயக்கத்தை முன்னெடுத்து, சாதி ஏற்றத்தாழ்வுகளையும் சமூக அநீதியையும் சவால் செய்த தமிழ்ச் சமூக சீர்திருத்தவாதி.'
    },
    imagePath: 'assets/Ideology_leaders/periyar.jpg',
    imageCredit: null
  },
  {
    id: 'marx',
    number: '03',
    monogram: 'K. M.',
    name: { en: 'Karl Marx', ta: 'கார்ல் மார்க்ஸ்' },
    description: {
      en: 'German philosopher and political economist whose analysis of class and capitalism deeply influenced socialist thought.',
      ta: 'வர்க்கம் மற்றும் முதலாளித்துவம் குறித்த எழுத்துகள் சோசலிசச் சிந்தனையில் ஆழ்ந்த தாக்கம் ஏற்படுத்திய ஜெர்மானியத் தத்துவஞானியும் அரசியல் பொருளாதார அறிஞரும்.'
    },
    imagePath: 'assets/Ideology_leaders/karl_max.jpg',
    imageCredit: null
  }
];
