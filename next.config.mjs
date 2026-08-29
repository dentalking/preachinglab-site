/**
 * Cloudflare Workers 에서 돕니다 (`@opennextjs/cloudflare`).
 *
 * ── 왜 정적 내보내기를 그만두었는가 ──────────────────────────
 *
 * 랜딩만 있을 때는 `output: 'export'` 가 맞았습니다. 그런데 다음에 올
 * 것들이 **전부 서버가 필요합니다** — 공유 리포트는 토큰마다 DB 를 읽고,
 * `/my` 는 로그인 뒤 화면입니다. 정적으로는 만들 수 없습니다.
 *
 * **랜딩은 그대로 미리 그려집니다.** 주소 열이 `generateStaticParams` 로
 * 나오므로 Worker 가 매번 만드는 것이 아니라 만들어 둔 것을 냅니다.
 * 느려지지 않습니다.
 *
 * `trailingSlash` 는 지금 주소를 그대로 지키기 위한 것입니다 —
 * `/en/` 처럼 슬래시로 끝나야 sitemap·hreflang·canonical 이 안 갈립니다.
 */
const nextConfig = {
  // 홈 디렉토리에 남의 package-lock.json 이 있어 Next 가 그쪽을 뿌리로 잡으려
  // 합니다. 뿌리를 여기로 못박아 둡니다 — 안 그러면 빌드가 홈 전체를 훑습니다.
  turbopack: { root: import.meta.dirname },
  trailingSlash: true,
  images: { unoptimized: true },

  /**
   * 보안 머리 — **Worker 가 그리는 페이지 몫입니다.**
   *
   * `public/_headers` 가 같은 것을 적고 있는데, 그 파일은 Cloudflare 의
   * **정적 자산에만** 붙습니다. 옛 사이트는 전부 정적 파일이라 그 하나로
   * 충분했습니다. Workers 로 옮기면서 **페이지가 그 밖으로 나갔고**, 실측해
   * 보니 `/` 응답에 네 줄이 하나도 안 붙어 있었습니다.
   *
   * 그래서 지금은 둘이 각자 맡습니다 —
   *
   *   public/_headers   자산(`/assets/*`)의 캐시와 머리
   *   여기              Worker 가 그리는 페이지의 머리
   *
   * **넘김(`/my`·`/s/*`)은 여기 두지 않았습니다.** `trailingSlash: true` 가
   * 먼저 걸려 `/my` 를 `/my/` 로 308 하는 바람에 규칙이 안 맞습니다.
   * `public/_redirects` 가 Worker 앞에서 처리하고, 실측으로 확인했습니다.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
