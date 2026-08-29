import type { ReactNode } from 'react';
import { LOCALE_META, parseSlug } from '@/content/routes';
import { Reveal } from '@/components/Reveal';
import { VisitCount } from '@/components/VisitCount';
import '../globals.css';

/**
 * 여기 제목은 **없는 주소 화면을 위한 것입니다.**
 *
 * 각 페이지는 `generateMetadata` 로 자기 제목을 냅니다. 그런데 Next 의
 * `not-found` 에는 그 자리가 없고, 그 화면에서 스크립트로 `document.title`
 * 을 넣어 봐도 하이드레이션이 다시 비웁니다. 실제로 재보니 탭이 빈 채로
 * 주소가 뜹니다 — 옛 `404.html` 에는 제목이 있었습니다.
 */
export const metadata = { title: 'Preaching Lab — 없는 주소입니다' };

/**
 * **이것이 root layout 입니다.** `app/layout.tsx` 를 따로 두지 않습니다.
 *
 * `<html lang>` 을 말마다 달리 주어야 하는데 root layout 은 주소를 못
 * 받습니다. 그래서 root 자체를 주소 조각 아래 둡니다.
 *
 * `lang` 이 정확해야 하는 이유가 실제로 있었습니다 — 옛 `assets/app.js` 가
 * 신청 폼의 안내말을 고를 때 이 값을 읽었습니다. 지금은 그리는 쪽이 말을
 * 직접 넘기지만, 스크린리더와 검색엔진에는 여전히 이 값이 답입니다.
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = parseSlug(slug);
  const m = LOCALE_META[page?.locale ?? 'ko'];
  return (
    <html lang={m.lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={`https://fonts.googleapis.com/css2?${m.googleFont}&display=swap`} rel="stylesheet" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
        {/* 표제 글꼴은 말마다 다릅니다. 옛 페이지는 이 두 줄을 파일마다 손으로 넣었습니다. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              `:root{--display:${m.displayStack}}` +
              (m.wordBreakNormal ? 'body{word-break:normal;overflow-wrap:anywhere}' : ''),
          }}
        />
        {/* 사람 확인. 폼이 있는 페이지에서만 쓰이지만, 옛 페이지처럼 여기 둡니다. */}
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      </head>
      <body>
        {children}
        <Reveal />
        <VisitCount />
      </body>
    </html>
  );
}
