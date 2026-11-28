/**
 * The site's pages and their addresses. Tamil is the main language and lives at the root; English lives under `/en`.
 * (To swap the two, change DEFAULT_LANGUAGE and OTHER_PREFIX; the list of pages is in `seo/site.config.json`.)
 */
import config from '../seo/site.config.json';

export type Language = 'ta' | 'en';
export type PageName = 'home' | 'contact' | 'donate' | 'tamil-land' | 'amaipai-thiralvom' | 'org-structure';

export const DEFAULT_LANGUAGE: Language = 'ta';
export const OTHER_LANGUAGE: Language = 'en';
const OTHER_PREFIX = 'en';

/** Route paths of every page in both languages, e.g. '', 'contact', 'en', 'en/contact'. */
export const PAGE_PATHS: readonly string[] = [
  ...config.pages,
  ...config.pages.map((page) => (page ? `${OTHER_PREFIX}/${page}` : OTHER_PREFIX))
];

export function otherLanguage(language: Language): Language {
  return language === DEFAULT_LANGUAGE ? OTHER_LANGUAGE : DEFAULT_LANGUAGE;
}

/** The address of a page inside the app, starting with '/'. */
export function pathFor(page: PageName, language: Language): string {
  const parts = [language === DEFAULT_LANGUAGE ? '' : OTHER_PREFIX, page === 'home' ? '' : page];
  return `/${parts.filter(Boolean).join('/')}`;
}

/** Which page and language an address means. Anything unknown is the home page. */
export function readAddress(url: string): { page: PageName; language: Language } {
  const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
  const other = segments[0] === OTHER_PREFIX;
  const name = segments[other ? 1 : 0] ?? '';
  return {
    page: name && config.pages.includes(name) ? (name as PageName) : 'home',
    language: other ? OTHER_LANGUAGE : DEFAULT_LANGUAGE
  };
}
