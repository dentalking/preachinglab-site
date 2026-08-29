/**
 * 정적 내보내기입니다 — Cloudflare Pages 에 지금과 똑같이 올라갑니다.
 *
 * `output: 'export'` 라 서버가 없습니다. 되돌릴 때 「서버를 내린다」가
 * 아니라 「옛 파일을 다시 올린다」가 되므로, 서버 배포처를 하나 더
 * 만들지 않습니다(server/plan 에 적힌 대로 Railway 는 되돌릴 길이
 * 막혀 있습니다).
 *
 * `trailingSlash` 는 지금 주소를 그대로 지키기 위한 것입니다 —
 * `/en/` 처럼 슬래시로 끝나야 sitemap·hreflang·canonical 이 안 갈립니다.
 */
const nextConfig = {
  // 홈 디렉토리에 남의 package-lock.json 이 있어 Next 가 그쪽을 뿌리로 잡으려
  // 합니다. 뿌리를 여기로 못박아 둡니다 — 안 그러면 빌드가 홈 전체를 훑습니다.
  turbopack: { root: import.meta.dirname },
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
