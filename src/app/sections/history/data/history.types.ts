export type HistoryLanguageText = {
  en: string;
  ta: string;
};

export type HistoryMilestone = {
  year: string;
  title: HistoryLanguageText;
  description: HistoryLanguageText;
  source: {
    url: string;
    label: HistoryLanguageText;
  } | null;
};
