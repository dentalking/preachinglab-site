import type { Locale, PageKind } from '../routes';
import { body as koPrivacy } from './ko-privacy';
import { body as koTerms } from './ko-terms';
import { body as enPrivacy } from './en-privacy';
import { body as enTerms } from './en-terms';

/**
 * 방침·약관 네 장.
 *
 * **본문은 HTML 그대로 넣습니다.** 랜딩처럼 칸을 쪼개지 않은 이유 —
 * 법률 문서는 말마다 조항의 수와 차례가 다릅니다(ko 방침 119줄 · en 179줄).
 * 억지로 같은 틀에 맞추면 없는 조항을 지어 넣거나 있는 조항을 버리게
 * 됩니다. **모양이 아니라 글이 원본인 문서**입니다.
 */
export type LegalDoc = {
  title: string;
  description: string;
  body: string;
};

export const LEGAL: Partial<Record<Locale, Partial<Record<'privacy' | 'terms', LegalDoc>>>> = {
  ko: {
    privacy: {
      title: '개인정보처리방침 — Preaching Lab',
      description: 'Preaching Lab 이 어떤 정보를 어떻게 다루는지 적어 둔 문서입니다.',
      body: koPrivacy,
    },
    terms: {
      title: '이용약관 — Preaching Lab',
      description: 'Preaching Lab 서비스 이용약관입니다.',
      body: koTerms,
    },
  },
  en: {
    privacy: {
      title: 'Privacy Policy — Preaching Lab',
      description: 'What Preaching Lab collects, where it goes, and when it is deleted.',
      body: enPrivacy,
    },
    terms: {
      title: 'Terms of Service — Preaching Lab',
      description: 'Terms of service for Preaching Lab.',
      body: enTerms,
    },
  },
};

export function legalDoc(locale: Locale, kind: PageKind): LegalDoc | null {
  if (kind !== 'privacy' && kind !== 'terms') return null;
  return LEGAL[locale]?.[kind] ?? null;
}
