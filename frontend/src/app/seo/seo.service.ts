import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CONTACT_EMAIL } from '../pages/contact/data/contact.data';
import { DONATION } from '../pages/donate/data/donate.data';
import { FOOTER_CONTENT } from '../pages/home/sections/footer/data/footer.data';
import { SOCIAL_LINKS } from '../pages/home/sections/social/data/social-links';
import { DEFAULT_LANGUAGE, Language, OTHER_LANGUAGE, PageName, pathFor } from '../routing/pages';
import { PAGE_SEO, SHARE_IMAGE, SITE_NAME } from './seo.data';
import config from './site.config.json';

const SITE_URL = config.siteUrl.replace(/\/$/, '');
const LOCALE: Record<Language, string> = { ta: 'ta_IN', en: 'en_IN' };

/** The public address of a page (folder style, as the built files are served). */
export function publicUrl(page: PageName, language: Language): string {
  return `${SITE_URL}${pathFor(page, language).replace(/\/$/, '')}/`;
}

/**
 * Writes everything in the document head that search engines and link previews read: title, description, language,
 * the page's official address and its other-language twin, share tags and structured data. It runs when the HTML is
 * built and again on every page or language change in the browser.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(page: PageName, language: Language): void {
    const seo = PAGE_SEO[page][language];
    const other = language === DEFAULT_LANGUAGE ? OTHER_LANGUAGE : DEFAULT_LANGUAGE;
    const url = publicUrl(page, language);
    const image = `${SITE_URL}/${SHARE_IMAGE.path}`;
    // nothing is indexed until the site is ready; sample donation details are never indexed
    const indexable = config.allowIndexing && !(page === 'donate' && DONATION.isSample);

    this.document.documentElement.lang = language;
    this.title.setTitle(seo.title);
    this.name('description', seo.description);
    this.name('robots', indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');

    this.property('og:type', 'website');
    this.property('og:site_name', SITE_NAME[language]);
    this.property('og:title', seo.title);
    this.property('og:description', seo.description);
    this.property('og:url', url);
    this.property('og:locale', LOCALE[language]);
    this.property('og:locale:alternate', LOCALE[other]);
    this.property('og:image', image);
    this.property('og:image:width', String(SHARE_IMAGE.width));
    this.property('og:image:height', String(SHARE_IMAGE.height));
    this.property('og:image:alt', SHARE_IMAGE.alt[language]);
    this.name('twitter:card', 'summary_large_image');
    this.name('twitter:title', seo.title);
    this.name('twitter:description', seo.description);
    this.name('twitter:image', image);

    this.link('canonical', url);
    this.link('alternate', publicUrl(page, 'ta'), 'ta');
    this.link('alternate', publicUrl(page, 'en'), 'en');
    this.link('alternate', publicUrl(page, DEFAULT_LANGUAGE), 'x-default');

    this.structuredData(page, language);
  }

  private name(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private property(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }

  private link(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let element = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', rel);
      if (hreflang) element.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  }

  /** schema.org data: who the party is, this website, this page and where it sits. */
  private structuredData(page: PageName, language: Language): void {
    const url = publicUrl(page, language);
    const party = `${SITE_URL}/#party`;
    const site = `${SITE_URL}/#website`;
    const graph: object[] = [
      {
        '@type': 'PoliticalParty',
        '@id': party,
        name: SITE_NAME[language],
        alternateName: ['VCK', 'விசிக', SITE_NAME[language === 'ta' ? 'en' : 'ta']],
        url: publicUrl('home', DEFAULT_LANGUAGE),
        logo: `${SITE_URL}/seo/icon-512.png`,
        foundingDate: '1982',
        email: CONTACT_EMAIL,
        address: {
          '@type': 'PostalAddress',
          streetAddress: language === 'ta' ? 'சர்வமங்களா காலனி, அசோக் காலனி, அசோக் நகர்' : 'Sarvamangala Colony, Ashoka Colony, Ashok Nagar',
          addressLocality: language === 'ta' ? 'சென்னை' : 'Chennai',
          addressRegion: language === 'ta' ? 'தமிழ்நாடு' : 'Tamil Nadu',
          postalCode: '600083',
          addressCountry: 'IN'
        },
        slogan: FOOTER_CONTENT.tagline[language],
        member: {
          '@type': 'Person',
          name: language === 'ta' ? 'தொல். திருமாவளவன்' : 'Thol. Thirumavalavan',
          jobTitle: language === 'ta' ? 'தலைவர்' : 'President'
        },
        sameAs: SOCIAL_LINKS.map((social) => social.url).filter(Boolean)
      },
      { '@type': 'WebSite', '@id': site, url: publicUrl('home', DEFAULT_LANGUAGE), name: SITE_NAME[language], inLanguage: ['ta', 'en'], publisher: { '@id': party } },
      {
        '@type': page === 'contact' ? 'ContactPage' : 'WebPage',
        '@id': `${url}#page`,
        url,
        name: PAGE_SEO[page][language].title,
        description: PAGE_SEO[page][language].description,
        inLanguage: language,
        isPartOf: { '@id': site },
        about: { '@id': party }
      }
    ];
    if (page !== 'home') {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: PAGE_SEO.home[language].name, item: publicUrl('home', language) },
          { '@type': 'ListItem', position: 2, name: PAGE_SEO[page][language].name, item: url }
        ]
      });
    }

    let script = this.document.getElementById('vck-structured-data');
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'vck-structured-data';
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  }
}
