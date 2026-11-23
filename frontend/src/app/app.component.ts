import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, signal } from '@angular/core';
import { gsap } from 'gsap';
import { hasCompletedHeroPortraitReveal, HeroPortraitReveal } from './pages/home/hero/hero-portrait-reveal';
import { createHeroFlagHandoff } from './pages/home/hero/hero-star-handoff';
import { OpeningAnimation } from './pages/home/hero/opening-animation';
import type { HeroPortrait3D } from './pages/home/hero/portrait/hero-portrait-3d';
import type { HeroTypography3D } from './pages/home/hero/typography/hero-typography-3d';
import { FlagSectionComponent } from './pages/home/sections/flag/flag-section.component';
import { ConferencesSectionComponent } from './pages/home/sections/conferences/conferences-section.component';
import { SocialSectionComponent } from './pages/home/sections/social/social-section.component';
import { HistorySectionComponent } from './pages/home/sections/history/history-section.component';
import { IdeologySectionComponent } from './pages/home/sections/ideology/ideology-section.component';
import { HandwrittenSignatureComponent } from '@shared/handwritten-signature/handwritten-signature.component';
import { ThinkersSectionComponent } from './pages/home/sections/thinkers/thinkers-section.component';
import { ThemeSwitchTransitionComponent } from './shared/theme-switch-transition/theme-switch-transition.component';

type SloganPart = { text: string; highlighted: boolean };
type SloganWord = { parts: SloganPart[] };
type SloganLine = { parts: SloganPart[]; words: SloganWord[] };

@Component({
  selector: 'vck-root',
  standalone: true,
  imports: [FlagSectionComponent, IdeologySectionComponent, HistorySectionComponent, ThinkersSectionComponent, ConferencesSectionComponent, SocialSectionComponent, HandwrittenSignatureComponent, ThemeSwitchTransitionComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './pages/home/hero/hero-typography.scss', './pages/home/hero/hero-signature.scss', './pages/home/hero/hero-mobile.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('portrait3dCanvas', { static: true }) private portrait3dCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSignature', { static: true }) private heroSignatureRef!: HandwrittenSignatureComponent;
  @ViewChild('ribbonFrontCanvas', { static: true }) private ribbonFrontCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('headlineCanvas', { static: true }) private headlineCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('themeToggleButton', { static: true }) private themeToggleButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('themeTransition', { static: true }) private themeTransitionRef!: ThemeSwitchTransitionComponent;
  @ViewChild('openingScreen', { static: true }) private openingScreenRef!: ElementRef<HTMLElement>;
  @ViewChild('openingCanvas', { static: true }) private openingCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('openingFlag', { static: true }) private openingFlagRef!: ElementRef<SVGSVGElement>;
  @ViewChild('openingStar', { static: true }) private openingStarRef!: ElementRef<SVGSVGElement>;
  @ViewChild('openingIdentity', { static: true }) private openingIdentityRef!: ElementRef<HTMLElement>;
  @ViewChild('openingVck', { static: true }) private openingVckRef!: ElementRef<HTMLElement>;
  @ViewChild('openingName', { static: true }) private openingNameRef!: ElementRef<HTMLElement>;
  @ViewChild('brandVck', { static: true }) private brandVckRef!: ElementRef<HTMLElement>;
  @ViewChild('brandName', { static: true }) private brandNameRef!: ElementRef<HTMLElement>;
  @ViewChild('heroAnchor', { static: true }) private heroAnchorRef!: ElementRef<HTMLElement>;
  @ViewChild('heroSection', { static: true }) private heroSectionRef!: ElementRef<HTMLElement>;
  @ViewChild('heroArtwork', { static: true }) private heroArtworkRef!: ElementRef<HTMLImageElement>;
  @ViewChild('portraitTrace', { static: true }) private portraitTraceRef!: ElementRef<HTMLCanvasElement>;
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
  /** The four slogans shown in the hero (indices into `slogans`), cycled automatically and via the 01-04 index. */
  private readonly sloganDeck = [0, 1, 4, 6] as const;
  readonly slides = [0, 1, 2, 3] as const;
  readonly activeSlide = signal(0);
  readonly activeSlogan = computed(() => this.sloganDeck[this.activeSlide()] ?? 0);
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
        const parts = [{ text: line, highlighted: false }];
        return { parts, words: this.toWords(parts) };
      }

      const highlightStart = matchIndex - lineStart;
      const highlightEnd = highlightStart + highlight.length;
      const parts: SloganPart[] = [];
      if (highlightStart > 0) parts.push({ text: line.slice(0, highlightStart), highlighted: false });
      parts.push({ text: line.slice(highlightStart, highlightEnd), highlighted: true });
      if (highlightEnd < line.length) parts.push({ text: line.slice(highlightEnd), highlighted: false });
      return { parts, words: this.toWords(parts) };
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
  readonly portraitRevealPending = signal(true);
  private headline3d?: HeroTypography3D;
  private portrait3d?: HeroPortrait3D;
  private portraitRevealDone = false;
  readonly portrait3dActive = signal(false);
  private destroyed = false;
  private signatureTimer?: number;
  private portraitReveal?: HeroPortraitReveal;
  private opening?: OpeningAnimation;
  private handoffCleanup?: () => void;
  private sloganTimer?: number;
  private heroTextTimeline?: gsap.core.Timeline;
  private heroAnimationFrame?: number;

  ngOnInit(): void {
    this.portraitRevealPending.set(!hasCompletedHeroPortraitReveal());
    // The relief portrait is a progressive enhancement: skipped entirely for reduced motion (the flat photo stays).
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      void import('./pages/home/hero/portrait/hero-portrait-3d').then(({ HeroPortrait3D }) => {
        if (this.destroyed) return;
        const portrait = new HeroPortrait3D(this.portrait3dCanvasRef.nativeElement, this.heroArtworkRef.nativeElement.src, () => this.portrait3dActive.set(true));
        this.portrait3d = portrait;
        portrait.load().then(() => { if (this.portraitRevealDone) portrait.show(); }, (error: unknown) => console.error('Unable to load the 3D portrait; keeping the flat photograph.', error));
      }, (error: unknown) => console.error('Unable to load the 3D portrait module.', error));
    }
    // Lazy chunk: the extruded headline (outlines, SVGLoader, environment map) is not needed for first paint.
    void import('./pages/home/hero/typography/hero-typography-3d').then(({ HeroTypography3D }) => {
      // Built when the browser is idle so the opening animation and first paint are not competing with WebGL start-up.
      const start = (): void => {
        if (this.destroyed || this.headline3d) return;
        this.headline3d = new HeroTypography3D(this.headlineCanvasRef.nativeElement, this.ribbonFrontCanvasRef.nativeElement, this.language(), this.theme());
        if (!this.openingActive()) this.headline3d.reveal();
      };
      const idle = (window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle.call(window, start, { timeout: 1500 });
      else window.setTimeout(start, 200);
    }, (error: unknown) => console.error('Unable to load the 3D hero headline.', error));
    this.startSloganTimer();
  }

  private swipeStart?: { x: number; y: number; time: number };
  private readonly onSwipeStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    this.swipeStart = touch ? { x: touch.clientX, y: touch.clientY, time: performance.now() } : undefined;
  };
  /** A quick, mostly horizontal swipe on the hero changes the slogan (the page still scrolls vertically as usual). */
  private readonly onSwipeEnd = (event: TouchEvent): void => {
    const start = this.swipeStart;
    const touch = event.changedTouches[0];
    this.swipeStart = undefined;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.6 || performance.now() - start.time > 700) return;
    const count = this.slides.length;
    this.selectSlide((this.activeSlide() + (dx < 0 ? 1 : -1) + count) % count);
  };

  ngAfterViewInit(): void {
    const hero = this.heroSectionRef.nativeElement;
    hero.addEventListener('touchstart', this.onSwipeStart, { passive: true });
    hero.addEventListener('touchend', this.onSwipeEnd, { passive: true });
    this.portraitReveal = new HeroPortraitReveal(
      this.heroArtworkRef.nativeElement,
      this.portraitTraceRef.nativeElement,
      (progress) => {
        if (progress >= 1 && !this.portraitRevealDone) {
          this.portraitRevealDone = true;
          this.portrait3d?.show();
        }
      }
    );
    if (!this.portraitRevealPending()) this.portraitReveal.showFinalState();

    this.opening = new OpeningAnimation({
      screen: this.openingScreenRef.nativeElement,
      canvas: this.openingCanvasRef.nativeElement,
      flag: this.openingFlagRef.nativeElement,
      star: this.openingStarRef.nativeElement,
      identity: this.openingIdentityRef.nativeElement,
      vck: this.openingVckRef.nativeElement,
      name: this.openingNameRef.nativeElement,
      brandVck: this.brandVckRef.nativeElement,
      brandName: this.brandNameRef.nativeElement,
      heroAnchor: this.heroAnchorRef.nativeElement
    }, () => this.startPortraitReveal(), () => {
      this.openingActive.set(false);
      this.animateHeroTypography(true);
      this.headline3d?.reveal();
      // The hero is now visible: let the president sign it (small beat after the intro settles).
      this.signatureTimer = window.setTimeout(() => this.heroSignatureRef.play(), 900);
    });
    this.opening.play(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    void createHeroFlagHandoff(this.heroAnchorRef.nativeElement).then((cleanup) => {
      this.handoffCleanup = cleanup;
    }, (error: unknown) => console.error('Unable to initialize the hero-to-flag star handoff.', error));
  }

  toggleLanguage(): void {
    this.language.update((value) => value === 'en' ? 'ta' : 'en');
    this.headline3d?.setLanguage(this.language());
    this.animateSlogan();
  }

  /** Splits a slogan line into words, keeping a highlighted word whole even when punctuation follows it. */
  private toWords(parts: SloganPart[]): SloganWord[] {
    const words: SloganWord[] = [];
    let current: SloganPart[] = [];
    const flush = (): void => {
      if (current.length) words.push({ parts: current });
      current = [];
    };
    for (const part of parts) {
      for (const piece of part.text.split(/(\s+)/)) {
        if (!piece) continue;
        if (/^\s+$/.test(piece)) flush();
        else current.push({ text: piece, highlighted: part.highlighted });
      }
    }
    flush();
    return words;
  }

  /** Shows slogan `index` (0-3) now and restarts the auto-advance countdown. */
  selectSlide(index: number): void {
    if (index === this.activeSlide()) return;
    this.activeSlide.set(index);
    this.animateSlogan();
    this.startSloganTimer();
  }

  private startSloganTimer(): void {
    window.clearInterval(this.sloganTimer);
    this.sloganTimer = window.setInterval(() => {
      this.activeSlide.update((current) => (current + 1) % this.slides.length);
      this.animateSlogan();
    }, 5200);
  }

  private animateSlogan(): void {
    if (this.heroAnimationFrame !== undefined) window.cancelAnimationFrame(this.heroAnimationFrame);
    this.heroAnimationFrame = window.requestAnimationFrame(() => {
      this.heroAnimationFrame = undefined;
      this.animateHeroTypography(false);
    });
  }

  private startPortraitReveal(): void {
    if (!this.portraitReveal) return;
    if (!this.portraitRevealPending()) {
      this.portraitReveal.showFinalState();
      return;
    }

    try {
      this.portraitReveal.play(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      this.portraitRevealPending.set(false);
    } catch (error) {
      console.error('Unable to play the hero portrait reveal; showing the supplied original photograph.', error);
      this.portraitReveal.showFinalState();
      this.portraitRevealPending.set(false);
    }
  }

  private animateHeroTypography(includeEyebrow: boolean): void {
    this.heroTextTimeline?.kill();
    const eyebrow = this.heroEyebrowRef.nativeElement;
    const words = Array.from(this.heroHeadlineRef.nativeElement.querySelectorAll<HTMLElement>('.hero-word'));
    const animatedElements = [...(includeEyebrow ? [eyebrow] : []), ...words];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(animatedElements, { clearProps: 'clipPath,transform,opacity,visibility' });
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
    if (words.length) {
      // Words rise into place from beneath their line (each line clips its overflow), one after another.
      timeline.fromTo(words, {
        yPercent: 110,
        autoAlpha: 0
      }, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.62,
        stagger: 0.05,
        ease: 'power3.out'
      }, includeEyebrow ? 0.14 : 0);
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
    this.headline3d?.setTheme(next);
    try { localStorage.setItem('vck-theme', next); } catch { /* Theme still works if storage is unavailable. */ }
    this.themeTransitionRef.play(this.themeToggleButtonRef.nativeElement, previous);
  }

  private readSavedTheme(): 'dark' | 'light' {
    try { return localStorage.getItem('vck-theme') === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
  }

  ngOnDestroy(): void {
    this.heroSectionRef.nativeElement.removeEventListener('touchstart', this.onSwipeStart);
    this.heroSectionRef.nativeElement.removeEventListener('touchend', this.onSwipeEnd);
    this.destroyed = true;
    window.clearInterval(this.sloganTimer);
    window.clearTimeout(this.signatureTimer);
    if (this.heroAnimationFrame !== undefined) window.cancelAnimationFrame(this.heroAnimationFrame);
    this.heroTextTimeline?.kill();
    this.opening?.destroy();
    this.portraitReveal?.destroy();
    this.handoffCleanup?.();
    this.headline3d?.destroy();
    this.portrait3d?.destroy();
  }
}
