// Mirrors backend/app/schemas.py.
export type Role = 'super_admin' | 'editor' | 'contributor';
export type Status = 'draft' | 'published';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super admin',
  editor: 'Editor',
  contributor: 'Contributor'
};

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  last_login: string | null;
}

export interface TokenResponse {
  access_token: string;
  user: User;
}

export interface Conference {
  id: number;
  year: number;
  name_en: string;
  name_ta: string;
  position: number;
  status: Status;
  updated_at: string;
}

export type ConferenceInput = Omit<Conference, 'id' | 'updated_at'>;

export interface Milestone {
  id: number;
  year: string;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  source_url: string | null;
  source_label_en: string | null;
  source_label_ta: string | null;
  position: number;
  status: Status;
  updated_at: string;
}

export type MilestoneInput = Omit<Milestone, 'id' | 'updated_at'>;

export interface UserCreate {
  email: string;
  name: string;
  password: string;
  role: Role;
}

export interface UserUpdate {
  name?: string;
  role?: Role;
  is_active?: boolean;
  password?: string;
}

export interface AuditEntry {
  id: number;
  at: string;
  user_email: string;
  action: string;
  entity: string;
  entity_id: number | null;
  summary: string;
}

export interface MediaVariant {
  width: number;
  url: string;
}

export interface MediaAsset {
  id: number;
  filename: string;
  width: number;
  height: number;
  alt_en: string;
  alt_ta: string;
  caption_en: string | null;
  caption_ta: string | null;
  variants: MediaVariant[]; // smallest first
  created_at: string;
}

export interface MediaUpdate {
  alt_en?: string;
  alt_ta?: string;
  caption_en?: string | null;
  caption_ta?: string | null;
}

export type PublicationKind = 'book' | 'monthly';
export type EditionState = 'processing' | 'ready' | 'failed';

export interface Edition {
  id: number;
  publication_id: number;
  label: string;
  volume: number | null;
  issue_number: number | null;
  year: number | null;
  month: number | null;
  status: Status;
  state: EditionState;
  processed_pages: number;
  page_count: number;
  page_width_px: number;
  page_height_px: number;
  watermark: boolean;
  error: string | null;
  cover_url: string | null; // only once ready
  created_at: string;
}

export interface Publication {
  id: number;
  slug: string;
  kind: PublicationKind;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  author_en: string | null;
  author_ta: string | null;
  status: Status;
  editions: Edition[]; // newest first
  updated_at: string;
}

export interface PublicationInput {
  slug: string;
  kind: PublicationKind;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  author_en: string | null;
  author_ta: string | null;
  status: Status;
}

export interface EditionUpdate {
  label?: string;
  volume?: number | null;
  issue_number?: number | null;
  year?: number | null;
  month?: number | null;
  status?: Status;
}
