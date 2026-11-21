export type ThinkerName = {
  en: string;
  ta: string;
};

export type Thinker = {
  id: string;
  number: string;
  monogram: string;
  name: ThinkerName;
  description: ThinkerName;
  imagePath: string | null;
  imageCredit: string | null;
};
