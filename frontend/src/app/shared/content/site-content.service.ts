import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Conference } from '../../pages/home/sections/conferences/data/conference.types';
import { CONFERENCES } from '../../pages/home/sections/conferences/data/conferences';
import { HISTORY_MILESTONES } from '../../pages/home/sections/history/data/history-milestones';
import type { HistoryMilestone } from '../../pages/home/sections/history/data/history.types';
import type { PublishedEdition, PublishedPublication } from './publication.types';

/** How long the site waits for the published content before showing the built-in copy. */
const LOAD_TIMEOUT_MS = 2500;
/** The history timeline needs at least two milestones to draw a line between them. */
const MIN_MILESTONES = 2;

type Pair = { en: string; ta: string };

const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isPair = (value: unknown): value is Pair => !!value && isText((value as Pair).en) && isText((value as Pair).ta);

function readConferences(raw: unknown): Conference[] | null {
  if (!Array.isArray(raw)) return null;
  const items: Conference[] = [];
  for (const item of raw as { year?: unknown; name?: unknown }[]) {
    if (typeof item?.year !== 'number' || !isPair(item.name)) return null;
    items.push({ year: item.year, name: { en: item.name.en, ta: item.name.ta } });
  }
  return items;
}

function readHistory(raw: unknown): HistoryMilestone[] | null {
  if (!Array.isArray(raw)) return null;
  const items: HistoryMilestone[] = [];
  for (const item of raw as { year?: unknown; title?: unknown; description?: unknown; source?: unknown }[]) {
    if (!isText(item?.year) || !isPair(item.title) || !isPair(item.description)) return null;
    let source: HistoryMilestone['source'] = null;
    if (item.source) {
      const { url, label } = item.source as { url?: unknown; label?: unknown };
      if (!isText(url) || !/^https?:\/\//.test(url)) return null;
      const pair = label as Partial<Pair> | undefined;
      source = { url, label: { en: pair?.en || url, ta: pair?.ta || pair?.en || url } };
    }
    items.push({ year: item.year, title: { en: item.title.en, ta: item.title.ta }, description: { en: item.description.en, ta: item.description.ta }, source });
  }
  return items;
}

const isUrl = (value: unknown): value is string => typeof value === 'string' && /^(https?:)?\/\//.test(value);
const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0;
const optionalInt = (value: unknown): number | null => (typeof value === 'number' && Number.isInteger(value) ? value : null);

function readEdition(raw: Record<string, unknown>): PublishedEdition | null {
  if (!isText(raw['id']) || !isText(raw['label']) || !isCount(raw['pages']) || !isCount(raw['width']) || !isCount(raw['height']) || !isUrl(raw['cover']) || !isUrl(raw['pagesBase'])) return null;
  return {
    id: raw['id'],
    label: raw['label'],
    volume: optionalInt(raw['volume']),
    issue: optionalInt(raw['issue']),
    year: optionalInt(raw['year']),
    month: optionalInt(raw['month']),
    pages: raw['pages'],
    width: raw['width'],
    height: raw['height'],
    cover: raw['cover'],
    pagesBase: raw['pagesBase'].endsWith('/') ? raw['pagesBase'] : `${raw['pagesBase']}/`
  };
}

/** Books and magazines. A publication that is not valid is skipped; the rest still show. */
function readPublications(raw: unknown): PublishedPublication[] {
  if (!Array.isArray(raw)) return [];
  const result: PublishedPublication[] = [];
  for (const item of raw as Record<string, unknown>[]) {
    if (!item || !isText(item['slug']) || (item['kind'] !== 'book' && item['kind'] !== 'monthly') || !isPair(item['title']) || !isPair(item['description']) || !Array.isArray(item['editions'])) continue;
    const editions = (item['editions'] as Record<string, unknown>[]).map((e) => (e ? readEdition(e) : null)).filter((e): e is PublishedEdition => e !== null);
    if (!editions.length) continue;
    const author = isPair(item['author']) ? { en: item['author'].en, ta: item['author'].ta } : null;
    result.push({ slug: item['slug'], kind: item['kind'], title: { en: item['title'].en, ta: item['title'].ta }, description: { en: item['description'].en, ta: item['description'].ta }, author, editions });
  }
  return result;
}

/**
 * The content the admin manages (History, Conferences). Loaded once before the page starts; if it cannot be
 * loaded, or is not valid, the site uses the copy that is built into it, so it never shows an empty section.
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  conferences: readonly Conference[] = CONFERENCES;
  history: readonly HistoryMilestone[] = HISTORY_MILESTONES;
  /** Published books and magazines (none until an editor publishes one). */
  publications: readonly PublishedPublication[] = [];
  /** Where the current content came from. */
  source: 'built-in' | 'published' = 'built-in';

  async load(): Promise<void> {
    // while the HTML is being built there is nothing to fetch from: the built-in content is used
    if (typeof window === 'undefined') return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LOAD_TIMEOUT_MS);
    try {
      const response = await fetch(environment.contentUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const data = (await response.json()) as { conferences?: unknown; history?: unknown; publications?: unknown };
      this.publications = readPublications(data.publications);
      const conferences = readConferences(data.conferences);
      const history = readHistory(data.history);
      let usedPublished = false;
      if (conferences && conferences.length > 0) {
        this.conferences = conferences;
        usedPublished = true;
      }
      if (history && history.length >= MIN_MILESTONES) {
        this.history = history;
        usedPublished = true;
      }
      if (usedPublished) this.source = 'published';
    } catch {
      /* offline, slow, or not published yet: keep the built-in content */
    } finally {
      clearTimeout(timer);
    }
  }
}
