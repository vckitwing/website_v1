export type ThinkerName = {
  en: string;
  ta: string;
};

export type Thinker = {
  id: 'ambedkar' | 'periyar' | 'marx';
  number: string;
  monogram: string;
  name: ThinkerName;
  description: ThinkerName;
  imagePath: string;
  imageCredit: string | null;
};
