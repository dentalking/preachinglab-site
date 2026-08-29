import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Landing } from '@/components/Landing';
import { LANDING, hasLanding } from '@/content';
import { legalDoc } from '@/content/legal';
import { NotFoundPage } from '@/components/NotFoundPage';
import {
  DEFAULT_LOCALE,
  NOT_FOUND_SLUG,
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

export const dynamicParams = false;

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
  // 없는 주소 장 하나를 더 만듭니다. 빌드 뒤 `404.html` 자리로 옮겨집니다.
  return [{ slug: NOT_FOUND_SLUG }, ...pages()].map((p) => {
    if ('slug' in p) return p;
    const { locale, kind } = p;
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

  if (page.kind === 'notfound') {
    return {
      metadataBase: new URL(SITE_ORIGIN),
      title: 'Preaching Lab — 없는 주소입니다',
      icons: { icon: FAVICON },
      robots: { index: false, follow: true },
    };
  }

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

  if (page.kind === 'notfound') return <NotFoundPage />;

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
