import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ParticlePortrait } from './particle-portrait';
import { FlagSectionComponent } from './sections/flag/flag-section.component';
import { HistorySectionComponent } from './sections/history/history-section.component';
import { IdeologySectionComponent } from './sections/ideology/ideology-section.component';
import { ThinkersSectionComponent } from './sections/thinkers/thinkers-section.component';
import { ThemeSwitchTransitionComponent } from './theme-switch-transition.component';

@Component({
  selector: 'vck-root',
  standalone: true,
  imports: [FlagSectionComponent, IdeologySectionComponent, HistorySectionComponent, ThinkersSectionComponent, ThemeSwitchTransitionComponent],
  template: `
    <main class="hero-shell" [class.light-theme]="theme() === 'light'" [attr.lang]="language()">
      <header class="topbar">
        <button class="mobile-menu-toggle" type="button" (click)="toggleMobileNavigation(); $event.stopPropagation()" [class.menu-open]="mobileNavigationOpen()" [attr.aria-expanded]="mobileNavigationOpen()" aria-controls="main-navigation" [attr.aria-label]="language() === 'ta' ? (mobileNavigationOpen() ? 'வழிசெலுத்தல் பட்டியை மூடவும்' : 'வழிசெலுத்தல் பட்டியைத் திறக்கவும்') : (mobileNavigationOpen() ? 'Close navigation menu' : 'Open navigation menu')">
          <span></span><span></span><span></span>
        </button>
        <a class="brand" href="#home" [attr.aria-label]="language() === 'ta' ? 'விசிக முகப்பு' : 'VCK home'">
          <img class="brand-mark" src="assets/Logo/vck_logo.jpg" alt="" />
          <span class="brand-copy"><strong>VCK</strong><small>VIDUTHALAI CHIRUTHAIGAL KATCHI</small></span>
        </a>
        <div class="top-actions">
          <button class="language" type="button" (click)="toggleLanguage()" [attr.aria-label]="language() === 'en' ? 'தமிழுக்கு மாற்று' : 'Switch language to English'" [attr.aria-pressed]="language() === 'ta'">
            {{ language() === 'en' ? 'தமிழ்' : 'EN' }}
          </button>
          <button #themeToggleButton class="theme-toggle" type="button" (click)="toggleTheme()" [attr.aria-label]="language() === 'ta' ? (theme() === 'dark' ? 'ஒளி தோற்றத்திற்கு மாற்று' : 'இருள் தோற்றத்திற்கு மாற்று') : (theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')" [attr.aria-pressed]="theme() === 'light'">
            <span aria-hidden="true">{{ theme() === 'dark' ? '☼' : '☾' }}</span>
          </button>
        </div>
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
        <img class="hero-artwork" [class.artwork-visible]="portraitFormed()" src="portraits/thiruma.png?v=2" alt="" aria-hidden="true" />
        <div class="crowd-strip" aria-hidden="true">
          <img src="portraits/red-blue-rally.png" alt="" />
        </div>
        <canvas #portraitCanvas class="story-canvas" [class.canvas-formed]="portraitFormed()" [attr.aria-label]="language() === 'ta' ? 'நீல மற்றும் சிவப்பு மக்கள் கூட்டத் துகள்கள் எழுந்து தோழர் திருமாவளவனின் உருவப்படத்தை உருவாக்குகின்றன.' : 'Blue and red crowd particles rise and form a portrait of Thol. Thirumavalavan.'"></canvas>
        <div class="hero-copy">
          <p class="eyebrow"><span class="eyebrow-line"></span> {{ language() === 'ta' ? 'மக்களிலிருந்து எழும் தலைவர்' : 'A LEADER RISES FROM THE PEOPLE' }}</p>
          <div class="slogan" aria-live="polite" aria-atomic="true">
            <p class="slogan-text" [class.slogan-motion-a]="sloganMotion()" [class.slogan-motion-b]="!sloganMotion()" [attr.lang]="language()">{{ formattedSlogan() }}</p>
          </div>
        </div>

        <div class="portrait-stage" [class.portrait-ready]="portraitReady()" [class.portrait-fallback]="portraitFailed()" [class.portrait-formed]="portraitFormed()">
          <div class="portrait-halo" aria-hidden="true"></div>
          <img class="mobile-artwork" [class.artwork-visible]="portraitFormed()" src="portraits/thiruma.png?v=2" [attr.alt]="language() === 'ta' ? 'தந்தை பெரியார் மற்றும் டாக்டர் பி. ஆர். அம்பேத்கருடன் தோழர் திருமாவளவன்' : 'Thol. Thirumavalavan with Periyar and Dr. B. R. Ambedkar'" />
          @if (portraitFailed()) {
            <div class="portrait-alt" role="img" [attr.aria-label]="language() === 'ta' ? 'உருவப்படம் கிடைக்கவில்லை. விசிக தலைவர் தோழர் திருமாவளவன்.' : 'Portrait unavailable. Thol. Thirumavalavan, VCK President.'">
              <span>விடுதலை</span><strong>தொல்.<br>திருமாவளவன்</strong><small>{{ language() === 'ta' ? 'தோழர் திருமாவளவன்' : 'THOL. THIRUMAVALAVAN' }}</small>
            </div>
          }
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
    <vck-theme-switch-transition #themeTransition />
  `,
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('portraitCanvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('themeToggleButton', { static: true }) private themeToggleButtonRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('themeTransition', { static: true }) private themeTransitionRef!: ThemeSwitchTransitionComponent;
  readonly slogans = [
    { ta: 'அடங்க மறு, அத்து மீறு, திமிறி எழு, திருப்பி அடி', en: 'Refuse to submit, transgress the limits, rise up in defiance, strike back.' },
    { ta: 'விழிப்பாய் இரு! நெருப்பாய் எழு!', en: 'Stay alert! Rise up like fire!' },
    { ta: 'தலைநிமிர சேரி திரளும்… அன்று தலைகீழாய் நாடு புரளும்!', en: 'When the marginalized settlements unite to hold their heads high, the country will turn upside down in revolution.' },
    { ta: 'சாதியத்தை வேரறுத்து தமிழ் தேசியத்தை வென்றெடுக்க முடியும்', en: 'Only by uprooting casteism can we win Tamil nationalism.' },
    { ta: 'அதிகாரம் வெல்லுவோம்! ஆட்சியில் பங்கு பெறுவோம்!', en: 'We will win power! We will claim our share in governance!' },
    { ta: 'தேவையை உணராமல் போராட முடியாது; களத்தில் போராடத் தெரியாமல் நீ வாழ முடியாது', en: 'You cannot fight without realizing the need; you cannot live without knowing how to fight in the field.' },
    { ta: 'பிறப்பொக்கும் எல்லா உயிர்க்கும்! சாதியற்ற சமத்துவ சமுதாயம் படைப்போம்!', en: 'All lives are equal by birth! Let us build a casteless, egalitarian society!' }
  ];
  readonly activeSlogan = signal(Math.floor(Math.random() * this.slogans.length));
  readonly language = signal<'en' | 'ta'>('en');
  readonly formattedSlogan = computed(() => this.slogans[this.activeSlogan()][this.language()].replace(/([!;])\s*/g, '$1\n'));
  readonly sloganMotion = signal(false);
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
  readonly portraitReady = signal(false);
  readonly portraitFailed = signal(false);
  readonly portraitFormed = signal(false);
  private portrait?: ParticlePortrait;
  private sloganTimer?: number;

  ngOnInit(): void {
    this.portrait = new ParticlePortrait(this.canvasRef.nativeElement, {
      onReady: () => this.portraitReady.set(true),
      onFallback: () => this.portraitFailed.set(true),
      onFormed: () => this.portraitFormed.set(true)
    });
    this.sloganTimer = window.setInterval(() => {
      this.activeSlogan.update((current) => {
        const next = Math.floor(Math.random() * (this.slogans.length - 1));
        return next >= current ? next + 1 : next;
      });
      this.animateSlogan();
    }, 4600);
  }

  toggleLanguage(): void {
    this.language.update((value) => value === 'en' ? 'ta' : 'en');
    this.animateSlogan();
  }

  private animateSlogan(): void { this.sloganMotion.update((value) => !value); }
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
    this.portrait?.destroy();
  }
}
