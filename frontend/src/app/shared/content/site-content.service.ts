import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Conference } from '../../pages/home/sections/conferences/data/conference.types';
import { CONFERENCES } from '../../pages/home/sections/conferences/data/conferences';
import { HISTORY_MILESTONES } from '../../pages/home/sections/history/data/history-milestones';
import type { HistoryMilestone } from '../../pages/home/sections/history/data/history.types';

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

/**
 * The content the admin manages (History, Conferences). Loaded once before the page starts; if it cannot be
 * loaded, or is not valid, the site uses the copy that is built into it, so it never shows an empty section.
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  conferences: readonly Conference[] = CONFERENCES;
  history: readonly HistoryMilestone[] = HISTORY_MILESTONES;
  /** Where the current content came from. */
  source: 'built-in' | 'published' = 'built-in';

  async load(): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LOAD_TIMEOUT_MS);
    try {
      const response = await fetch(environment.contentUrl, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const data = (await response.json()) as { conferences?: unknown; history?: unknown };
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
