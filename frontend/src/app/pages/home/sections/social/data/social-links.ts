export interface SocialLink {
  readonly id: 'x' | 'facebook' | 'instagram' | 'youtube';
  /** The platform's name as it is shown and spoken. */
  readonly name: { readonly en: string; readonly ta: string };
  /**
   * The address of VCK's page on that platform. Leave it empty until it is known: the tile is then shown as a plain
   * (non-clickable) tile instead of a link that goes nowhere.
   */
  readonly url: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: 'x', name: { en: 'X (Twitter)', ta: 'எக்ஸ் (ட்விட்டர்)' }, url: 'https://x.com/vckitwingoffi' },
  { id: 'facebook', name: { en: 'Facebook', ta: 'பேஸ்புக்' }, url: 'https://www.facebook.com/share/1KNW3saNLB/' },
  { id: 'instagram', name: { en: 'Instagram', ta: 'இன்ஸ்டாகிராம்' }, url: 'https://www.instagram.com/vckitwingofficial' },
  { id: 'youtube', name: { en: 'YouTube', ta: 'யூடியூப்' }, url: 'https://youtube.com/@vckitwingoffi' }
];
