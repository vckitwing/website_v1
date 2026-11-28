import { FOOTER_CONTENT } from '../../home/sections/footer/data/footer.data';
import { CONTACT_EMAIL } from '../../contact/data/contact.data';

export type DonateText = { readonly en: string; readonly ta: string };

/**
 * The party's donation details.
 *
 * !! SAMPLE DATA !!  Every value below is a placeholder (no real account, no real UPI ID). While `isSample` is true the page
 * shows a visible "sample details" notice. Before the site goes public: replace the values with the real ones, then set
 * `isSample` to false (that removes the notice). Never publish the placeholders as if they were real.
 */
export const DONATION = {
  isSample: true,
  upi: { id: 'vck.sample@upi', payeeName: 'VCK (sample)' },
  bank: {
    accountName: 'Viduthalai Chiruthaigal Katchi (sample)',
    accountNumber: '0000 0000 0000',
    ifsc: 'SAMP0000000',
    bankBranch: 'Sample Bank, Ashok Nagar branch, Chennai',
    accountType: 'Current account'
  },
  payableTo: 'Viduthalai Chiruthaigal Katchi (sample)',
  email: CONTACT_EMAIL,
  officeAddress: FOOTER_CONTENT.address,
  officeLabel: FOOTER_CONTENT.officeLabel
};

/** Suggested amounts in rupees (the visitor can also type their own). */
export const DONATION_AMOUNTS: readonly number[] = [100, 500, 1000, 2500];
export const DEFAULT_AMOUNT = 500;

export const DONATE_COPY: {
  readonly eyebrow: DonateText;
  readonly title: DonateText;
  readonly lede: DonateText;
  readonly sampleTitle: DonateText;
  readonly sampleText: DonateText;
  readonly upiTitle: DonateText;
  readonly upiLede: DonateText;
  readonly amount: DonateText;
  readonly custom: DonateText;
  readonly upiId: DonateText;
  readonly payUpi: DonateText;
  readonly scan: DonateText;
  readonly sampleQr: DonateText;
  readonly bankTitle: DonateText;
  readonly accountName: DonateText;
  readonly accountNumber: DonateText;
  readonly ifsc: DonateText;
  readonly bank: DonateText;
  readonly accountType: DonateText;
  readonly copy: DonateText;
  readonly copied: DonateText;
  readonly chequeTitle: DonateText;
  readonly chequeText: DonateText;
  readonly chequePost: DonateText;
  readonly notesTitle: DonateText;
  readonly notes: readonly DonateText[];
} = {
  eyebrow: { en: 'DONATE US', ta: 'நன்கொடை' },
  title: { en: 'Stand with the movement', ta: 'இயக்கத்துடன் இணைந்து நில்லுங்கள்' },
  lede: {
    en: 'Every contribution, small or large, keeps the work going. Choose the way that is easiest for you.',
    ta: 'சிறிய அல்லது பெரிய ஒவ்வொரு பங்களிப்பும் பணியைத் தொடர உதவுகிறது. உங்களுக்கு எளிதான வழியைத் தேர்ந்தெடுங்கள்.'
  },
  sampleTitle: { en: 'Sample details.', ta: 'மாதிரி விவரங்கள்.' },
  sampleText: {
    en: 'The account and UPI details on this page are placeholders. Do not send money to them. They will be replaced with the party’s real details before launch.',
    ta: 'இந்தப் பக்கத்தில் உள்ள கணக்கு மற்றும் யுபிஐ விவரங்கள் மாதிரிகள் மட்டுமே. இவற்றுக்குப் பணம் அனுப்ப வேண்டாம். தொடக்கத்திற்கு முன் கட்சியின் உண்மையான விவரங்களால் மாற்றப்படும்.'
  },
  upiTitle: { en: 'Donate with UPI', ta: 'யுபிஐ மூலம் நன்கொடை' },
  upiLede: { en: 'Pick an amount, then pay with any UPI app.', ta: 'தொகையைத் தேர்ந்தெடுத்து, ஏதேனும் யுபிஐ செயலி மூலம் செலுத்துங்கள்.' },
  amount: { en: 'Amount (₹)', ta: 'தொகை (₹)' },
  custom: { en: 'Other amount', ta: 'வேறு தொகை' },
  upiId: { en: 'UPI ID', ta: 'யுபிஐ முகவரி' },
  payUpi: { en: 'Pay with UPI', ta: 'யுபிஐ மூலம் செலுத்துக' },
  scan: { en: 'Or scan this code with any UPI app', ta: 'அல்லது ஏதேனும் யுபிஐ செயலியில் இந்தக் குறியீட்டை ஸ்கேன் செய்யுங்கள்' },
  sampleQr: { en: 'Sample code, not scannable', ta: 'மாதிரிக் குறியீடு, ஸ்கேன் ஆகாது' },
  bankTitle: { en: 'Bank transfer', ta: 'வங்கிப் பரிமாற்றம்' },
  accountName: { en: 'Account name', ta: 'கணக்கின் பெயர்' },
  accountNumber: { en: 'Account number', ta: 'கணக்கு எண்' },
  ifsc: { en: 'IFSC code', ta: 'ஐஎஃப்எஸ்சி குறியீடு' },
  bank: { en: 'Bank and branch', ta: 'வங்கி மற்றும் கிளை' },
  accountType: { en: 'Account type', ta: 'கணக்கு வகை' },
  copy: { en: 'Copy', ta: 'நகலெடு' },
  copied: { en: 'Copied', ta: 'நகலெடுக்கப்பட்டது' },
  chequeTitle: { en: 'Cheque or demand draft', ta: 'காசோலை அல்லது வங்கி வரைவோலை' },
  chequeText: { en: 'Make it payable to', ta: 'இவர் பெயருக்கு எழுதுங்கள்' },
  chequePost: { en: 'and post it to the head office:', ta: 'மேலும் தலைமை அலுவலகத்திற்கு அனுப்புங்கள்:' },
  notesTitle: { en: 'Good to know', ta: 'அறிந்துகொள்ள வேண்டியவை' },
  notes: [
    {
      en: `To receive a receipt, write to ${CONTACT_EMAIL} with your name, address and the payment reference.`,
      ta: `ரசீது பெற, உங்கள் பெயர், முகவரி மற்றும் பணம் செலுத்திய குறிப்பு எண்ணுடன் ${CONTACT_EMAIL} முகவரிக்கு எழுதுங்கள்.`
    },
    {
      en: 'Draft wording: the party’s accountant will confirm the receipt, tax and donor-detail rules that apply before launch.',
      ta: 'வரைவு வாசகம்: ரசீது, வரி மற்றும் நன்கொடையாளர் விவர விதிகளைத் தொடக்கத்திற்கு முன் கட்சியின் கணக்காளர் உறுதிசெய்வார்.'
    }
  ]
};
