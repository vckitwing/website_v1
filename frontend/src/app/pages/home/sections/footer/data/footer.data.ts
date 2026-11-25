export type FooterText = { readonly en: string; readonly ta: string };

export const FOOTER_CONTENT: {
  readonly name: FooterText;
  readonly tagline: FooterText;
  readonly officeLabel: FooterText;
  readonly address: FooterText;
  readonly followLabel: FooterText;
  readonly backToTop: FooterText;
  readonly rights: FooterText;
} = {
  name: { en: 'Viduthalai Chiruthaigal Katchi', ta: 'விடுதலைச் சிறுத்தைகள் கட்சி' },
  tagline: { en: 'Organize and unite.', ta: 'அமைப்பாய்த் திரள்வோம்.' },
  officeLabel: { en: 'VCK Head Office', ta: 'விசிக தலைமை அலுவலகம்' },
  address: {
    en: 'Sarvamangala Colony, Ashoka Colony, Ashok Nagar, Chennai, Tamil Nadu 600083',
    ta: 'சர்வமங்களா காலனி, அசோக் காலனி, அசோக் நகர், சென்னை, தமிழ்நாடு 600083'
  },
  followLabel: { en: 'Follow us', ta: 'எங்களைப் பின்தொடருங்கள்' },
  backToTop: { en: 'Back to top', ta: 'மேலே செல்ல' },
  rights: { en: 'All rights reserved.', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' }
};
