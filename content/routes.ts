/**
 * 이 서비스의 웹 주소 전부. **여기가 유일한 목록입니다.**
 *
 * 지금 랜딩은 주소 목록이 세 곳에 손으로 적혀 있습니다 — 각 페이지의
 * `hreflang` 다섯 줄, `sitemap.xml`, 그리고 `bump.sh` 가 훑는 파일들.
 * 그래서 말을 넷으로 늘렸을 때 **`sitemap.xml` 에 es·pt 방침·약관이
 * 빠졌고 아무도 못 봤습니다.**
 *
 * 여기서 만들면 셋이 저절로 따라옵니다. 말이나 페이지를 더할 때
 * **이 파일만** 고칩니다.
 */

export const LOCALES = ['ko', 'en', 'es', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

/** 어느 말도 짚어지지 않은 방문에 보여드리는 말. 쓰시는 분이 아직 한국 목회자입니다. */
export const DEFAULT_LOCALE: Locale = 'ko';

/**
 * `<html lang>` · `og:locale` · 표제 글꼴.
 *
 * **글꼴이 말마다 다릅니다.** 한국어는 `Gowun Batang`, 나머지 셋은 `Lora` —
 * *「Gowun Batang 은 한글 본문을 위한 것이고 라틴 글자는 곁다리라, 영어
 * 표제로 쓰면 자간이 성깁니다」*(옛 `en/index.html` 주석).
 *
 * 옛 페이지들은 이것을 **페이지마다 `<style>` 한 덩이**로 넣어 두었습니다.
 * 방침·약관까지 넷씩 곱해지던 자리입니다. 말의 속성이므로 여기 둡니다.
 *
 * `wordBreak` — 한국어는 `keep-all` 로 낱말이 갈라지지 않게 하고, 나머지는
 * 긴 URL 이 상자를 뚫고 나가는 것만 막습니다.
 */
export type LocaleMeta = {
  lang: string;
  ogLocale: string;
  name: string;
  googleFont: string;
  displayStack: string;
  wordBreakNormal: boolean;
};

const LATIN = {
  googleFont: 'family=Lora:wght@400;600;700&family=JetBrains+Mono:wght@400;500',
  displayStack: "'Lora', Georgia, 'Times New Roman', serif",
  wordBreakNormal: true,
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ko: {
    lang: 'ko',
    ogLocale: 'ko_KR',
    name: '한국어',
    googleFont: 'family=Gowun+Batang:wght@400;700&family=JetBrains+Mono:wght@400;500',
    displayStack: "'Gowun Batang', serif",
    wordBreakNormal: false,
  },
  en: { lang: 'en', ogLocale: 'en_US', name: 'English', ...LATIN },
  es: { lang: 'es', ogLocale: 'es_ES', name: 'Español', ...LATIN },
  pt: { lang: 'pt', ogLocale: 'pt_BR', name: 'Português', ...LATIN },
};

export type PageKind = 'landing' | 'privacy' | 'terms';


/**
 * 기본 말(ko)은 주소에 말을 안 붙입니다 — `/`, `/privacy`.
 * 지금 쓰는 주소와 **한 글자도 다르지 않아야** 합니다. 검색 순위와
 * 카카오톡으로 이미 건너간 링크가 거기 걸려 있습니다.
 */
export function href(locale: Locale, kind: PageKind): string {
  const base = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  if (kind === 'landing') return `${base}/`;
  return `${base}/${kind}`;
}

export const SITE_ORIGIN = 'https://preachinglab.cloud';

export function absolute(locale: Locale, kind: PageKind): string {
  return SITE_ORIGIN + href(locale, kind);
}

/**
 * 어느 말에 어느 문서가 **실제로 있는가.**
 *
 * es·pt 에는 방침·약관이 없습니다. 지금은 `es/index.html` 이 `/en/privacy`
 * 로 보내고 있는데 — **법적 문서를 자기 말로 못 읽으시는 것**이라 옳지
 * 않습니다. 그렇다고 없는 번역을 지어 넣을 수도 없습니다(법률 문안입니다).
 *
 * 그래서 **없다는 사실을 여기 적습니다.** 링크는 이 표를 보고 있는 것만
 * 가리키고, 번역이 오면 `true` 로 바꾸는 한 줄이 전부입니다. 주석으로
 * 약속하면 표가 늘 때 아무도 안 고칩니다.
 */
export const HAS_PAGE: Record<Locale, Record<PageKind, boolean>> = {
  ko: { landing: true, privacy: true, terms: true },
  en: { landing: true, privacy: true, terms: true },
  es: { landing: true, privacy: false, terms: false },
  pt: { landing: true, privacy: false, terms: false },
};

/** 그 말에 없으면 영어로 보냅니다 — 지금 하고 있는 것과 같되, 이유가 코드에 남습니다. */
export function legalHref(locale: Locale, kind: 'privacy' | 'terms'): string {
  return HAS_PAGE[locale][kind] ? href(locale, kind) : href('en', kind);
}

/** 실제로 만들어질 페이지 전부. `generateStaticParams` 와 `sitemap.xml` 이 함께 씁니다. */
export function allPages(): { locale: Locale; kind: PageKind }[] {
  const out: { locale: Locale; kind: PageKind }[] = [];
  for (const locale of LOCALES) {
    for (const kind of ['landing', 'privacy', 'terms'] as const) {
      if (HAS_PAGE[locale][kind]) out.push({ locale, kind });
    }
  }
  return out;
}

/** 주소 조각(`['en','privacy']`)을 말과 문서로 되돌립니다. 모르는 주소는 `null`. */
export function parseSlug(slug: string[] | undefined): { locale: Locale; kind: PageKind } | null {
  const parts = slug ?? [];
  let locale: Locale = DEFAULT_LOCALE;
  let rest = parts;
  if (parts.length && (LOCALES as readonly string[]).includes(parts[0])) {
    locale = parts[0] as Locale;
    rest = parts.slice(1);
  }
  const kind: PageKind | null =
    rest.length === 0 ? 'landing' : rest.length === 1 && (rest[0] === 'privacy' || rest[0] === 'terms') ? rest[0] : null;
  if (!kind) return null;
  if (!HAS_PAGE[locale][kind]) return null;
  return { locale, kind };
}
