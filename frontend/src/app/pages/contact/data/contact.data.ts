import { FOOTER_CONTENT } from '../../home/sections/footer/data/footer.data';

export type ContactText = { readonly en: string; readonly ta: string };

/** The party's public mailbox. */
export const CONTACT_EMAIL = 'vckitwingofficial@gmail.com';

/** The head office, shared with the footer so the two can never disagree. */
export const OFFICE = {
  label: FOOTER_CONTENT.officeLabel,
  address: FOOTER_CONTENT.address
};

/** Opens the office in Google Maps (a plain link; nothing is embedded from a third party). */
export const OFFICE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${OFFICE.label.en}, ${OFFICE.address.en}`
)}`;

export const CONTACT_COPY: {
  readonly eyebrow: ContactText;
  readonly title: ContactText;
  readonly lede: ContactText;
  readonly addressTitle: ContactText;
  readonly openMap: ContactText;
  readonly emailTitle: ContactText;
  readonly sendEmail: ContactText;
  readonly copy: ContactText;
  readonly copied: ContactText;
  readonly formTitle: ContactText;
  readonly formLede: ContactText;
  readonly name: ContactText;
  readonly subject: ContactText;
  readonly message: ContactText;
  readonly compose: ContactText;
  readonly formNote: ContactText;
  readonly defaultSubject: ContactText;
} = {
  eyebrow: { en: 'CONTACT US', ta: 'தொடர்புக்கு' },
  title: { en: 'We’d like to hear from you', ta: 'உங்கள் குரலுக்குச் செவிசாய்க்கிறோம்' },
  lede: {
    en: 'Write to the party office or send us an email. Every message is read.',
    ta: 'கட்சி அலுவலகத்திற்கு எழுதுங்கள் அல்லது மின்னஞ்சல் அனுப்புங்கள். ஒவ்வொரு செய்தியும் வாசிக்கப்படும்.'
  },
  addressTitle: { en: 'Visit the office', ta: 'அலுவலகத்திற்கு வாருங்கள்' },
  openMap: { en: 'Open in Maps', ta: 'வரைபடத்தில் காண்க' },
  emailTitle: { en: 'Email', ta: 'மின்னஞ்சல்' },
  sendEmail: { en: 'Send an email', ta: 'மின்னஞ்சல் அனுப்புக' },
  copy: { en: 'Copy address', ta: 'முகவரியை நகலெடு' },
  copied: { en: 'Copied', ta: 'நகலெடுக்கப்பட்டது' },
  formTitle: { en: 'Write to us', ta: 'எங்களுக்கு எழுதுங்கள்' },
  formLede: { en: 'Tell us what is on your mind.', ta: 'உங்கள் எண்ணத்தைப் பகிருங்கள்.' },
  name: { en: 'Your name', ta: 'உங்கள் பெயர்' },
  subject: { en: 'Subject', ta: 'பொருள்' },
  message: { en: 'Message', ta: 'செய்தி' },
  compose: { en: 'Open in my email app', ta: 'என் மின்னஞ்சல் செயலியில் திறக்க' },
  formNote: {
    en: 'This opens your email app with the message ready to send. Nothing is sent from this website.',
    ta: 'இது உங்கள் மின்னஞ்சல் செயலியில் செய்தியை அனுப்பத் தயாராகத் திறக்கும். இந்த இணையதளத்திலிருந்து எதுவும் அனுப்பப்படாது.'
  },
  defaultSubject: { en: 'Message from the VCK website', ta: 'விசிக இணையதளத்திலிருந்து ஒரு செய்தி' }
};
