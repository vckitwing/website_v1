import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, signal } from '@angular/core';
import { gsap } from 'gsap';
import { HeroStarNetwork } from './hero-star-network';
import { createHeroFlagHandoff } from './hero-star-handoff';
import { OpeningAnimation } from './opening-animation';
import { FlagSectionComponent } from './sections/flag/flag-section.component';
import { HistorySectionComponent } from './sections/history/history-section.component';
import { IdeologySectionComponent } from './sections/ideology/ideology-section.component';
import { ThinkersSectionComponent } from './sections/thinkers/thinkers-section.component';
import { ThemeSwitchTransitionComponent } from './theme-switch-transition.component';

type SloganPart = { text: string; highlighted: boolean };
type SloganLine = { parts: SloganPart[] };

@Component({
  selector: 'vck-root',
  standalone: true,
  imports: [FlagSectionComponent, IdeologySectionComponent, HistorySectionComponent, ThinkersSectionComponent, ThemeSwitchTransitionComponent],
  template: `
    <main class="hero-shell" [class.light-theme]="theme() === 'light'" [class.opening-active]="openingActive()" [attr.lang]="language()">
      <div #openingScreen class="opening-screen" aria-hidden="true">
        <canvas #openingCanvas class="opening-particles"></canvas>
        <div #openingIdentity class="opening-identity">
          <svg #openingStar class="opening-star" viewBox="0 0 100 100" aria-hidden="true">
            <polygon points="50,4 61,36 96,37 68,58 78,92 50,73 22,92 32,58 4,37 39,36" />
            <circle class="opening-star-vertex opening-star-vertex-blue" cx="50" cy="4" r="2.5" />
            <circle class="opening-star-vertex opening-star-vertex-red" cx="96" cy="37" r="2.5" />
            <circle class="opening-star-vertex opening-star-vertex-blue" cx="78" cy="92" r="2.5" />
            <circle class="opening-star-vertex opening-star-vertex-red" cx="22" cy="92" r="2.5" />
            <circle class="opening-star-vertex opening-star-vertex-blue" cx="4" cy="37" r="2.5" />
          </svg>
          <div class="opening-copy">
            <span #openingVck class="opening-vck">VCK</span>
            <span #openingName class="opening-name">VIDUTHALAI CHIRUTHAIGAL KATCHI</span>
          </div>
        </div>
      </div>
      <header class="topbar">
        <a class="brand" href="#home" [attr.aria-label]="language() === 'ta' ? 'விசிக முகப்பு' : 'VCK home'">
          <img class="brand-mark" src="assets/Logo/vck_logo.jpg" alt="" />
          <span class="brand-copy"><strong #brandVck>VCK</strong><small #brandName>VIDUTHALAI CHIRUTHAIGAL KATCHI</small></span>
        </a>
        <div class="top-actions">
          <button class="language" type="button" (click)="toggleLanguage()" [attr.aria-label]="language() === 'en' ? 'தமிழுக்கு மாற்று' : 'Switch language to English'" [attr.aria-pressed]="language() === 'ta'">
            {{ language() === 'en' ? 'தமிழ்' : 'EN' }}
          </button>
          <button #themeToggleButton class="theme-toggle" type="button" (click)="toggleTheme()" [attr.aria-label]="language() === 'ta' ? (theme() === 'dark' ? 'ஒளி தோற்றத்திற்கு மாற்று' : 'இருள் தோற்றத்திற்கு மாற்று') : (theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')" [attr.aria-pressed]="theme() === 'light'">
            <span aria-hidden="true">{{ theme() === 'dark' ? '☼' : '☾' }}</span>
          </button>
        </div>
        <button class="mobile-menu-toggle" type="button" (click)="toggleMobileNavigation(); $event.stopPropagation()" [class.menu-open]="mobileNavigationOpen()" [attr.aria-expanded]="mobileNavigationOpen()" aria-controls="main-navigation" [attr.aria-label]="language() === 'ta' ? (mobileNavigationOpen() ? 'வழிசெலுத்தல் பட்டியை மூடவும்' : 'வழிசெலுத்தல் பட்டியைத் திறக்கவும்') : (mobileNavigationOpen() ? 'Close navigation menu' : 'Open navigation menu')">
          <span></span><span></span><span></span>
        </button>
      </header>

      <nav id="main-navigation" class="site-nav" [class.mobile-open]="mobileNavigationOpen()" [attr.aria-label]="language() === 'ta' ? 'முதன்மை வழிசெலுத்தல்' : 'Main navigation'" (click)="$event.stopPropagation()">
        @for (section of navigation; track section.id) {
          <div class="nav-group" (mouseenter)="openNavigationMenu(section.id)" (mouseleave)="closeNavigationMenu(section.id)" (focusin)="openNavigationMenu(section.id)">
            @if (section.items.length) {
              <button class="nav-toggle" type="button" (click)="activateNavigation(section.id)" aria-haspopup="true" [attr.aria-expanded]="openNavigation() === section.id" [attr.aria-controls]="'nav-menu-' + section.id">
                <span>{{ language() === 'ta' ? section.ta : section.en }}</span>
              </button>
              @if (openNavigation() === section.id) {
                <ul class="nav-menu" [id]="'nav-menu-' + section.id">
                  @for (item of section.items; track item.en) {
                    <li>{{ language() === 'ta' ? item.ta : item.en }}</li>
                  }
                </ul>
              }
            } @else {
              <span class="nav-toggle nav-placeholder">{{ language() === 'ta' ? section.ta : section.en }}</span>
            }
          </div>
        }
      </nav>

      <section class="hero" id="home" [attr.aria-label]="language() === 'ta' ? 'விசிக முன்னணிப் பகுதி' : 'VCK hero'">
        <div class="hero-waves" aria-hidden="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2785df" stop-opacity="0" />
                <stop offset="16%" stop-color="#2785df" stop-opacity=".8" />
                <stop offset="48%" stop-color="#8fcaff" stop-opacity=".45" />
                <stop offset="82%" stop-color="#ed2a40" stop-opacity=".7" />
                <stop offset="100%" stop-color="#ed2a40" stop-opacity="0" />
              </linearGradient>
              <filter id="hero-wave-blur" x="-20%" y="-30%" width="140%" height="160%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            <g class="hero-wave-glow">
              <path d="M-80 355 C190 185 360 490 620 350 S1010 180 1210 295 S1500 460 1680 240" />
              <path d="M-80 555 C160 365 380 690 610 530 S980 330 1200 445 S1480 640 1680 410" />
              <path d="M-80 735 C170 560 370 820 600 700 S1000 500 1210 610 S1485 795 1680 565" />
            </g>
            <g class="hero-wave-lines">
              <path d="M-80 260 C180 100 380 390 610 255 S990 95 1205 205 S1480 360 1680 155" />
              <path d="M-80 445 C200 300 380 560 630 425 S1010 280 1220 380 S1500 540 1680 345" />
              <path d="M-80 625 C170 440 380 740 610 585 S990 390 1205 500 S1490 685 1680 455" />
              <path d="M-80 810 C150 650 365 880 610 770 S1000 590 1220 675 S1490 835 1680 650" />
              <path d="M-80 350 C160 205 360 500 590 365 S965 190 1175 300 S1470 475 1680 270" />
              <path d="M-80 700 C200 510 405 795 650 650 S1030 455 1240 570 S1510 735 1680 530" />
            </g>
          </svg>
        </div>
        <img class="hero-artwork" src="assets/hero_section/thiruma.png" [attr.alt]="language() === 'ta' ? 'தோழர் திருமாவளவன்' : 'Thol. Thirumavalavan'" />
        <div class="crowd-strip" aria-hidden="true">
          <img src="assets/hero_section/crowd.png" alt="" />
        </div>
        <canvas #portraitCanvas class="story-canvas" aria-hidden="true"></canvas>
        <div class="hero-copy">
          <p #heroEyebrow class="eyebrow"><span class="eyebrow-line"></span> {{ language() === 'ta' ? 'மக்களிலிருந்து எழும் தலைவர்' : 'A LEADER RISES FROM THE PEOPLE' }}</p>
          <div class="slogan" aria-live="polite" aria-atomic="true">
            <p #heroHeadline class="slogan-text" [class.slogan-long]="formattedSlogan().length > 48" [attr.lang]="language()">
              @for (line of formattedSloganLines(); track $index) {
                <span #heroHeadlineLine class="hero-headline-line">
                  @for (part of line.parts; track $index) {
                    <span [class.hero-highlight]="part.highlighted">{{ part.text }}</span>
                  }
                </span>
              }
            </p>
          </div>
        </div>

        <div #heroAnchor class="portrait-stage portrait-settled">
          <div class="portrait-halo" aria-hidden="true"></div>
          <div class="portrait-caption"><span class="caption-dot"></span><span>{{ language() === 'ta' ? 'தொல். திருமாவளவன்' : 'THOL. THIRUMAVALAVAN' }}</span><span class="caption-role">{{ language() === 'ta' ? 'தலைவர், விசிக' : 'PRESIDENT, VCK' }}</span></div>
          <p class="portrait-hint">{{ language() === 'ta' ? 'தொட்டு நகர்த்தவும்' : 'TOUCH TO MOVE' }} <span aria-hidden="true">✳</span></p>
        </div>

        <div class="vertical-note" aria-hidden="true">{{ language() === 'ta' ? 'மக்கள் · நீதி · விடுதலை' : 'PEOPLE · JUSTICE · LIBERATION' }}</div>
      </section>

      <vck-flag-section [language]="language()" />
      <vck-ideology-section [language]="language()" />
      <vck-history-section [language]="language()" />
      <vck-thinkers-section [language]="language()" />

      <footer class="hero-footer" id="story">
        <span class="footer-label">{{ language() === 'ta' ? 'நமது இயக்கம், நமது எதிர்காலம்' : 'OUR MOVEMENT, OUR FUTURE' }}</span>
        <span class="scroll-cue"><span></span> {{ language() === 'ta' ? 'தொடர்ந்து பார்க்க கீழே நகர்த்தவும்' : 'SCROLL TO EXPLORE' }}</span>
      </footer>
    </main>
    <div class="story-star-journey" aria-hidden="true">
      <svg class="story-star-journey-thread" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="story-star-thread-gradient">
            <stop offset="0" stop-color="#69bdff" />
            <stop offset=".52" stop-color="#fff" />
            <stop offset="1" stop-color="#ee5269" />
          </linearGradient>
        </defs>
        <path class="story-star-thread-path" pathLength="1" />
      </svg>
      <svg class="story-star-journey-shape" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,4 61,36 96,37 68,58 78,92 50,73 22,92 32,58 4,37 39,36" />
      </svg>
    </div>
    <vck-theme-switch-transition #themeTransition />
  `,
  styleUrls: ['./app.component.css', './hero-typography.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('portraitCanvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('themeToggleButton', { static: true }) private themeToggleButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('themeTransition', { static: true }) private themeTransitionRef!: ThemeSwitchTransitionComponent;
  @ViewChild('openingScreen', { static: true }) private openingScreenRef!: ElementRef<HTMLElement>;
  @ViewChild('openingCanvas', { static: true }) private openingCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('openingStar', { static: true }) private openingStarRef!: ElementRef<SVGSVGElement>;
  @ViewChild('openingIdentity', { static: true }) private openingIdentityRef!: ElementRef<HTMLElement>;
  @ViewChild('openingVck', { static: true }) private openingVckRef!: ElementRef<HTMLElement>;
  @ViewChild('openingName', { static: true }) private openingNameRef!: ElementRef<HTMLElement>;
  @ViewChild('brandVck', { static: true }) private brandVckRef!: ElementRef<HTMLElement>;
  @ViewChild('brandName', { static: true }) private brandNameRef!: ElementRef<HTMLElement>;
  @ViewChild('heroAnchor', { static: true }) private heroAnchorRef!: ElementRef<HTMLElement>;
  @ViewChild('heroEyebrow', { static: true }) private heroEyebrowRef!: ElementRef<HTMLElement>;
  @ViewChild('heroHeadline', { static: true }) private heroHeadlineRef!: ElementRef<HTMLParagraphElement>;
  @ViewChildren('heroHeadlineLine') private heroHeadlineLineRefs!: QueryList<ElementRef<HTMLElement>>;
  readonly slogans = [
    { ta: 'அடங்க மறு, அத்து மீறு, திமிறி எழு, திருப்பி அடி', en: 'Refuse to submit, transgress the limits, rise up in defiance, strike back.' },
    { ta: 'விழிப்பாய் இரு! நெருப்பாய் எழு!', en: 'Stay alert! Rise up like fire!' },
    { ta: 'தலைநிமிர சேரி திரளும்… அன்று தலைகீழாய் நாடு புரளும்!', en: 'When the marginalized settlements unite to hold their heads high, the country will turn upside down in revolution.' },
    { ta: 'சாதியத்தை வேரறுத்து தமிழ் தேசியத்தை வென்றெடுக்க முடியும்', en: 'Only by uprooting casteism can we win Tamil nationalism.' },
    { ta: 'அதிகாரம் வெல்லுவோம்! ஆட்சியில் பங்கு பெறுவோம்!', en: 'We will win power! We will claim our share in governance!' },
    { ta: 'தேவையை உணராமல் போராட முடியாது; களத்தில் போராடத் தெரியாமல் நீ வாழ முடியாது', en: 'You cannot fight without realizing the need; you cannot live without knowing how to fight in the field.' },
    { ta: 'பிறப்பொக்கும் எல்லா உயிர்க்கும்! சாதியற்ற சமத்துவ சமுதாயம் படைப்போம்!', en: 'All lives are equal by birth! Let us build a casteless, egalitarian society!' }
  ];
  private readonly sloganHighlights = [
    { ta: 'எழு', en: 'rise' },
    { ta: 'நெருப்பாய்', en: 'fire' },
    { ta: 'தலைகீழாய்', en: 'revolution' },
    { ta: 'சாதியத்தை', en: 'casteism' },
    { ta: 'அதிகாரம்', en: 'power' },
    { ta: 'போராட', en: 'fight' },
    { ta: 'சமத்துவ', en: 'equal' }
  ];
  readonly activeSlogan = signal(Math.floor(Math.random() * this.slogans.length));
  readonly language = signal<'en' | 'ta'>('en');
  readonly formattedSlogan = computed(() => this.slogans[this.activeSlogan()][this.language()].replace(/([!;])\s*/g, '$1\n'));
  readonly formattedSloganLines = computed<SloganLine[]>(() => {
    const text = this.formattedSlogan();
    const highlight = this.sloganHighlights[this.activeSlogan()][this.language()];
    const matchIndex = this.language() === 'en'
      ? text.toLowerCase().indexOf(highlight.toLowerCase())
      : text.indexOf(highlight);
    let offset = 0;

    return text.split('\n').map((line) => {
      const lineStart = offset;
      const lineEnd = lineStart + line.length;
      offset = lineEnd + 1;

      if (matchIndex < lineStart || matchIndex >= lineEnd) {
        return { parts: [{ text: line, highlighted: false }] };
      }

      const highlightStart = matchIndex - lineStart;
      const highlightEnd = highlightStart + highlight.length;
      const parts: SloganPart[] = [];
      if (highlightStart > 0) parts.push({ text: line.slice(0, highlightStart), highlighted: false });
      parts.push({ text: line.slice(highlightStart, highlightEnd), highlighted: true });
      if (highlightEnd < line.length) parts.push({ text: line.slice(highlightEnd), highlighted: false });
      return { parts };
    });
  });
  readonly theme = signal<'dark' | 'light'>(this.readSavedTheme());
  readonly openNavigation = signal<string | null>(null);
  readonly mobileNavigationOpen = signal(false);
  readonly navigation = [
    {
      id: 'movement', ta: 'இயக்கம்', en: 'Movement', items: [
        { ta: 'இயக்க வரலாறு', en: 'Movement history' },
        { ta: 'கொள்கைகள்', en: 'Policies' },
        { ta: 'மக்கள் பிரதிநிதிகள் (எம்.பி / எம்.எல்.ஏ)', en: 'Elected representatives (MPs / MLAs)' }
      ]
    },
    {
      id: 'structure', ta: 'இயக்க கட்டமைப்பு', en: 'Organization structure', items: [
        { ta: 'தலைமை', en: 'Leadership' },
        { ta: 'மாநிலச் செயலாளர்கள்', en: 'State secretaries' },
        { ta: 'மாவட்டச் செயலாளர்கள்', en: 'District secretaries' },
        { ta: 'துணைநிலை அமைப்பாளர்கள் (அனைத்து அணிகளும்)', en: 'Wing coordinators (all wings)' }
      ]
    },
    {
      id: 'field', ta: 'களத்தில் சிறுத்தைகள்', en: 'In the field', items: [
        { ta: 'தேர்தல்கள்', en: 'Elections' },
        { ta: 'மாநாடுகள்', en: 'Conferences' },
        { ta: 'சாதனைகள்', en: 'Achievements' }
      ]
    },
    {
      id: 'publications', ta: 'வெளியீடுகள்', en: 'Publications', items: [
        { ta: 'நமது தமிழ்மண்', en: 'Our Tamil Land' },
        { ta: 'புத்தகங்கள்', en: 'Books' },
        { ta: 'கொள்கைப் பாடல்கள்', en: 'Policy songs' },
        { ta: 'புகைப்படங்கள்', en: 'Photos' }
      ]
    },
    { id: 'donate', ta: 'நன்கொடை', en: 'Donate Us', items: [] },
    {
      id: 'contact', ta: 'தொடர்புக்கு', en: 'Contact', items: [
        { ta: 'முகவரி', en: 'Address' },
        { ta: 'தொலைபேசி / மின்னஞ்சல்', en: 'Phone / email' },
        { ta: 'தொடர்பு படிவம்', en: 'Contact form' }
      ]
    }
  ];
  readonly openingActive = signal(true);
  private starNetwork?: HeroStarNetwork;
  private opening?: OpeningAnimation;
  private handoffCleanup?: () => void;
  private sloganTimer?: number;
  private heroTextTimeline?: gsap.core.Timeline;
  private heroAnimationFrame?: number;

  ngOnInit(): void {
    this.starNetwork = new HeroStarNetwork(this.canvasRef.nativeElement);
    this.sloganTimer = window.setInterval(() => {
      this.activeSlogan.update((current) => {
        const next = Math.floor(Math.random() * (this.slogans.length - 1));
        return next >= current ? next + 1 : next;
      });
      this.animateSlogan();
    }, 4600);
  }

  ngAfterViewInit(): void {
    this.opening = new OpeningAnimation({
      screen: this.openingScreenRef.nativeElement,
      canvas: this.openingCanvasRef.nativeElement,
      star: this.openingStarRef.nativeElement,
      identity: this.openingIdentityRef.nativeElement,
      vck: this.openingVckRef.nativeElement,
      name: this.openingNameRef.nativeElement,
      brandVck: this.brandVckRef.nativeElement,
      brandName: this.brandNameRef.nativeElement,
      heroAnchor: this.heroAnchorRef.nativeElement
    }, () => this.starNetwork?.revealNetwork(), () => {
      this.openingActive.set(false);
      this.animateHeroTypography(true);
    });
    this.opening.play(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    void createHeroFlagHandoff(this.heroAnchorRef.nativeElement, (progress) => {
      this.starNetwork?.setStarHandoff(progress);
    }).then((cleanup) => {
      this.handoffCleanup = cleanup;
    }, (error: unknown) => console.error('Unable to initialize the hero-to-flag star handoff.', error));
  }

  toggleLanguage(): void {
    this.language.update((value) => value === 'en' ? 'ta' : 'en');
    this.animateSlogan();
  }

  private animateSlogan(): void {
    if (this.heroAnimationFrame !== undefined) window.cancelAnimationFrame(this.heroAnimationFrame);
    this.heroAnimationFrame = window.requestAnimationFrame(() => {
      this.heroAnimationFrame = undefined;
      this.animateHeroTypography(false);
    });
  }

  private animateHeroTypography(includeEyebrow: boolean): void {
    this.heroTextTimeline?.kill();
    const eyebrow = this.heroEyebrowRef.nativeElement;
    const lines = this.heroHeadlineLineRefs.toArray().map((line) => line.nativeElement);
    const highlights = Array.from(this.heroHeadlineRef.nativeElement.querySelectorAll<HTMLElement>('.hero-highlight'));
    const animatedElements = [...(includeEyebrow ? [eyebrow] : []), ...lines, ...highlights];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(animatedElements, { clearProps: 'clipPath,transform,opacity,visibility,backgroundPosition' });
      return;
    }

    const timeline = gsap.timeline();
    if (includeEyebrow) {
      timeline.fromTo(eyebrow, {
        clipPath: 'inset(0 100% 0 0)',
        x: -8,
        autoAlpha: 0
      }, {
        clipPath: 'inset(0 0% 0 0)',
        x: 0,
        autoAlpha: 1,
        duration: 0.42,
        ease: 'power2.out'
      });
    }
    if (lines.length) {
      timeline.fromTo(lines, {
        clipPath: 'inset(0 100% 0 0)',
        y: 14
      }, {
        clipPath: 'inset(0 0% 0 0)',
        y: 0,
        duration: 0.68,
        stagger: 0.11,
        ease: 'power3.out'
      }, includeEyebrow ? 0.14 : 0);
    }
    if (highlights.length) {
      timeline.fromTo(highlights, {
        backgroundPosition: '0% 50%'
      }, {
        backgroundPosition: '100% 50%',
        duration: 0.85,
        ease: 'sine.inOut'
      }, includeEyebrow ? 0.84 : 0.68);
    }
    this.heroTextTimeline = timeline;
  }

  toggleMobileNavigation(): void {
    this.mobileNavigationOpen.update((isOpen) => !isOpen);
    this.openNavigation.set(null);
  }

  activateNavigation(section: string): void {
    this.openNavigation.set(section);
  }

  openNavigationMenu(section: string): void {
    if (window.matchMedia('(hover: hover)').matches || this.mobileNavigationOpen()) this.openNavigation.set(section);
  }

  closeNavigationMenu(section: string): void {
    if (window.matchMedia('(hover: hover)').matches && !this.mobileNavigationOpen() && this.openNavigation() === section) {
      this.openNavigation.set(null);
    }
  }

  @HostListener('document:click')
  closeNavigation(): void {
    this.openNavigation.set(null);
    this.mobileNavigationOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  closeNavigationOnEscape(): void {
    this.openNavigation.set(null);
    this.mobileNavigationOpen.set(false);
  }

  toggleTheme(): void {
    if (this.themeTransitionRef.isPlaying) return;
    const previous = this.theme();
    const next = previous === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try { localStorage.setItem('vck-theme', next); } catch { /* Theme still works if storage is unavailable. */ }
    this.themeTransitionRef.play(this.themeToggleButtonRef.nativeElement, previous);
  }

  private readSavedTheme(): 'dark' | 'light' {
    try { return localStorage.getItem('vck-theme') === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
  }

  ngOnDestroy(): void {
    window.clearInterval(this.sloganTimer);
    if (this.heroAnimationFrame !== undefined) window.cancelAnimationFrame(this.heroAnimationFrame);
    this.heroTextTimeline?.kill();
    this.opening?.destroy();
    this.handoffCleanup?.();
    this.starNetwork?.destroy();
  }
}
