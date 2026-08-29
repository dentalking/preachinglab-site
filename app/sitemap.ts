import type { MetadataRoute } from 'next';
import { hasLanding } from '@/content';
import { DEFAULT_LOCALE, HAS_PAGE, LOCALES, LOCALE_META, absolute, type PageKind } from '@/content/routes';

/**
 * 검색엔진에 내미는 주소 목록.
 *
 * **손으로 적지 않습니다.** 옛 `sitemap.xml` 은 손으로 적혀 있었고, 말이
 * 넷으로 늘어난 뒤에도 **es·pt 의 방침·약관 자리가 비어 있는 것을 아무도
 * 못 봤습니다.** 이제는 `HAS_PAGE` 에서 나오므로, 그 표를 고치는 순간
 * 여기도 따라옵니다.
 *
 * 짝을 이루는 주소들이 서로를 빠짐없이 가리키게 합니다 — 한쪽만 가리키면
 * 검색엔진이 별개의 페이지로 잡아 서로 순위를 깎습니다.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  const add = (kind: PageKind, priority: number, changeFrequency: 'monthly' | 'yearly') => {
    const langs: Record<string, string> = {};
    for (const l of LOCALES) {
      const has = kind === 'landing' ? hasLanding(l) : HAS_PAGE[l][kind];
      if (has) langs[LOCALE_META[l].lang] = absolute(l, kind);
    }
    langs['x-default'] = absolute(DEFAULT_LOCALE, kind);

    for (const l of LOCALES) {
      const has = kind === 'landing' ? hasLanding(l) : HAS_PAGE[l][kind];
      if (!has) continue;
      out.push({ url: absolute(l, kind), priority, changeFrequency, alternates: { languages: langs } });
    }
  };

  add('landing', 1, 'monthly');
  add('privacy', 0.3, 'yearly');
  add('terms', 0.3, 'yearly');
  return out;
}
