/** A published edition of a book or a monthly magazine: only picture addresses, never the PDF. */
export interface PublishedEdition {
  /** Random, unguessable id of the edition (also the folder name of its pictures). */
  readonly id: string;
  readonly label: string;
  readonly volume: number | null;
  readonly issue: number | null;
  readonly year: number | null;
  readonly month: number | null;
  readonly pages: number;
  /** Size in pixels of every page picture (they are all the same). */
  readonly width: number;
  readonly height: number;
  readonly cover: string;
  /** Page n is `pagesBase` + `p` + n padded to 3 digits + `.webp`. */
  readonly pagesBase: string;
}

export interface PublishedPublication {
  readonly slug: string;
  readonly kind: 'book' | 'monthly';
  readonly title: { readonly en: string; readonly ta: string };
  readonly description: { readonly en: string; readonly ta: string };
  readonly author: { readonly en: string; readonly ta: string } | null;
  /** Newest first. */
  readonly editions: readonly PublishedEdition[];
}

export function pageUrl(edition: PublishedEdition, page: number): string {
  return `${edition.pagesBase}p${String(page).padStart(3, '0')}.webp`;
}
