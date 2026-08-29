import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * Cloudflare Workers 로 나갈 때의 설정.
 *
 * ── 캐시 저장소를 반드시 줘야 합니다 ──────────────────────────
 *
 * 처음에 `defineCloudflareConfig()` 만 두었더니 **모든 페이지가 404** 였고
 * 로그에는 `NoFallbackError` 만 남았습니다. 랜딩·방침·약관은 빌드 때 미리
 * 그려지는데(SSG), 그 결과를 **꺼내 올 곳이 없으면** Next 는 「없는
 * 페이지」로 답합니다. 파일은 멀쩡히 만들어져 있는데도 그렇습니다.
 *
 * 여기 것들은 빌드 산출물과 함께 올라가는 정적 파일에서 읽습니다. 우리
 * 페이지는 배포할 때 확정되고 나중에 되살릴 일이 없으므로 이것으로
 * 충분합니다 — KV·R2 는 `revalidate` 로 다시 그리는 페이지가 생길 때
 * 필요합니다.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
