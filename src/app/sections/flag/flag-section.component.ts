import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { createFlagAnimation } from './flag-animation';

export type FlagLanguage = 'en' | 'ta';

type FlagMeaning = {
  tone: 'blue' | 'red';
  eyebrow: { en: string; ta: string };
  title: { en: string; ta: string };
  qualities: { en: string; ta: string };
  description: { en: string; ta: string };
};

@Component({
  selector: 'vck-flag-section',
  standalone: true,
  templateUrl: './flag-section.component.html',
  styleUrl: './flag-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagSectionComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) language: FlagLanguage = 'en';
  @ViewChild('sectionRoot', { static: true }) private sectionRoot!: ElementRef<HTMLElement>;

  readonly meanings: FlagMeaning[] = [
    {
      tone: 'blue',
      eyebrow: { en: '01 / SKY BLUE', ta: '01 / வான்நீலம்' },
      title: { en: 'Sky Blue', ta: 'வான்நீலம்' },
      qualities: { en: 'Equality, freedom & peace', ta: 'சமத்துவம், சுதந்திரம், அமைதி' },
      description: {
        en: 'The vast sky-blue colour symbolises equal opportunities, dignity and a world free from discrimination for oppressed communities.',
        ta: 'வானம் போல் விரிந்த நீலம், ஒடுக்கப்பட்ட மக்களுக்கு சம வாய்ப்பு, கண்ணியம் மற்றும் பாகுபாடற்ற உலகைக் குறிக்கிறது.'
      }
    },
    {
      tone: 'red',
      eyebrow: { en: '02 / RED', ta: '02 / சிவப்பு' },
      title: { en: 'Red', ta: 'சிவப்பு' },
      qualities: { en: 'Revolutionary struggle, courage & sacrifice', ta: 'புரட்சிகரப் போராட்டம், துணிவு, தியாகம்' },
      description: {
        en: 'It symbolises continued resistance against caste oppression, social injustice and inequality.',
        ta: 'சாதி ஒடுக்குமுறை, சமூக அநீதி மற்றும் சமத்துவமின்மைக்கு எதிரான தொடர்ந்த எதிர்ப்பைக் குறிக்கிறது.'
      }
    }
  ];
  readonly starMeaning = {
    eyebrow: { en: '03 / THE WHITE STAR', ta: '03 / வெள்ளை நட்சத்திரம்' },
    title: { en: 'The star at the centre', ta: 'மைய நட்சத்திரம்' },
    description: {
      en: 'The white five-pointed star sits where the sky-blue and red fields meet, completing the flag’s design.',
      ta: 'வான்நீலமும் சிவப்பும் சந்திக்கும் மையத்தில் வெள்ளை ஐந்து முனை நட்சத்திரம் அமைந்து கொடியின் வடிவத்தை நிறைவு செய்கிறது.'
    }
  };

  private disposeAnimation?: () => void;
  private destroyed = false;

  ngAfterViewInit(): void {
    void createFlagAnimation(this.sectionRoot.nativeElement).then(
      (dispose) => {
        if (this.destroyed) {
          dispose();
          return;
        }
        this.disposeAnimation = dispose;
      },
      (error: unknown) => console.error('Unable to initialize the VCK flag animation.', error)
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposeAnimation?.();
  }
}
