import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/Landing';
import { LANDING, hasLanding } from '@/content';
import { legalDoc } from '@/content/legal';
import {
  DEFAULT_LOCALE,
  HAS_PAGE,
  LOCALES,
  LOCALE_META,
  SITE_ORIGIN,
  absolute,
  href,
  parseSlug,
  type Locale,
  type PageKind,
} from '@/content/routes';

/**
 * 모르는 주소도 이 세그먼트로 들여보냅니다.
 *
 * `false` 였을 때는 없는 주소가 **세그먼트에 들어오지도 못하고** Next 의
 * 맨 404 로 빠졌습니다 — 글꼴도 스타일도 `lang` 도 없는 화면이고,
 * `<title>` 은 `404: This page could not be found.` 였습니다. root layout 이
 * 주소 조각 아래 있는 우리 구조에서는 그 화면을 꾸밀 방법이 없습니다.
 *
 * 들여보낸 뒤 `parseSlug` 가 모르는 주소면 `notFound()` 를 던지고, 그러면
 * **이 세그먼트의 `not-found.tsx` 가 layout 을 거쳐** 그려집니다.
 * 아래 `generateStaticParams` 에 적힌 주소들은 그대로 미리 그려지므로,
 * 이 값은 「없는 주소를 어떻게 맞이하는가」만 바꿉니다.
 */
export const dynamicParams = true;

const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='26'>✎</text></svg>";

/** 만들 페이지 목록. **여기가 곧 `sitemap.xml` 이기도 합니다** — 손으로 두 번 적지 않습니다. */
function pages(): { locale: Locale; kind: PageKind }[] {
  const out: { locale: Locale; kind: PageKind }[] = [];
  for (const locale of LOCALES) {
    if (hasLanding(locale)) out.push({ locale, kind: 'landing' });
    for (const kind of ['privacy', 'terms'] as const) {
      if (HAS_PAGE[locale][kind]) out.push({ locale, kind });
    }
  }
  return out;
}

export function generateStaticParams() {
  return pages().map(({ locale, kind }) => {
    const path = href(locale, kind).replace(/^\/|\/$/g, '');
    return { slug: path === '' ? [] : path.split('/') };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = parseSlug(slug);
  if (!page) return {};

  // 방침·약관. **짝이 되는 말끼리만 가리킵니다** — es·pt 에는 이 문서가
  // 아직 없어서, 있는 것처럼 가리키면 404 가 나갑니다.
  if (page.kind !== 'landing') {
    const doc = legalDoc(page.locale, page.kind);
    if (!doc) return {};
    const langs: Record<string, string> = {};
    for (const l of LOCALES) {
      if (HAS_PAGE[l][page.kind]) langs[LOCALE_META[l].lang] = absolute(l, page.kind);
    }
    langs['x-default'] = absolute(DEFAULT_LOCALE, page.kind);
    return {
      metadataBase: new URL(SITE_ORIGIN),
      title: doc.title,
      description: doc.description,
      alternates: { canonical: absolute(page.locale, page.kind), languages: langs },
      icons: { icon: FAVICON },
      robots: { index: true, follow: true },
      openGraph: {
        title: doc.title,
        description: doc.description,
        url: absolute(page.locale, page.kind),
        images: [{ url: '/assets/og.png' }],
      },
      twitter: { card: 'summary_large_image' },
    };
  }

  const c = LANDING[page.locale];
  if (!c) return {};

  /**
   * 짝이 되는 다른 말들. **네 주소가 서로를 빠짐없이 가리켜야** 검색엔진이
   * 같은 페이지의 다른 말로 알아봅니다. 한쪽만 가리키면 별개의 페이지로
   * 잡혀 서로 순위를 깎습니다.
   *
   * 옛 페이지는 이 다섯 줄을 **네 파일에 손으로** 적어 두었습니다. 말을
   * 하나 더 늘리면 나머지 셋도 함께 고쳐야 했고, 그것을 잊는 날이 오면
   * 낡는 쪽은 아무도 안 보는 페이지였습니다. 이제는 목록에서 나옵니다.
   */
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    if (hasLanding(l)) languages[LOCALE_META[l].lang] = absolute(l, 'landing');
  }
  languages['x-default'] = absolute(DEFAULT_LOCALE, 'landing');

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: c.meta.title,
    description: c.meta.description,
    alternates: { canonical: absolute(page.locale, 'landing'), languages },
    icons: { icon: FAVICON },
    openGraph: {
      title: c.meta.ogTitle,
      description: c.meta.ogDescription,
      type: 'website',
      url: absolute(page.locale, 'landing'),
      siteName: 'Preaching Lab',
      locale: LOCALE_META[page.locale].ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== page.locale && hasLanding(l)).map((l) => LOCALE_META[l].ogLocale),
      // 목사님들이 서로 카카오톡으로 보내실 때 뜨는 카드입니다. 이미지가 없으면
      // 밋밋한 줄 하나로 보여서, 받는 쪽에서 무엇인지 짐작하기 어렵습니다.
      images: [{ url: '/assets/og.png', width: 1200, height: 630, alt: c.meta.ogImageAlt }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = parseSlug(slug);
  if (!page) notFound();

  if (page.kind === 'landing') {
    const c = LANDING[page.locale];
    if (!c) notFound();
    return <Landing c={c} locale={page.locale} />;
  }

  const doc = legalDoc(page.locale, page.kind);
  if (!doc) notFound();
  // **본문은 옛 파일에서 그대로 떠온 HTML 입니다.** 법률 문안이라 손으로
  // 다시 치지 않았습니다 — scripts/import-legal.mjs 를 보십시오.
  return <main className="doc" dangerouslySetInnerHTML={{ __html: doc.body }} />;
}
