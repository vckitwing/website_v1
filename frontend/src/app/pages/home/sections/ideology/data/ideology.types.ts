export const IDEOLOGY_KEYS = [
  'equality',
  'social-justice',
  'self-respect',
  'democracy',
  'liberation'
] as const;

export type IdeologyKey = typeof IDEOLOGY_KEYS[number];

export type IdeologyPrinciple = {
  key: IdeologyKey;
  title: string;
  description: string;
};
