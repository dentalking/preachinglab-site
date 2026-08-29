import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/content/routes';

/**
 * 공개 페이지는 다 읽어가셔도 됩니다.
 *
 * 리포트가 있는 곳(my.preachinglab.cloud)은 이 도메인이 아니고, 그쪽은
 * 서버가 `X-Robots-Tag` 로 따로 막습니다. **설교 녹취록에는 심방 사례와
 * 성도의 사정이 실명으로 섞여 나옵니다.**
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 리포트로 넘어가는 길목입니다. 색인할 내용이 없습니다.
      disallow: ['/my', '/s/'],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
