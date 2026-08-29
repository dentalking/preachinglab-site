/**
 * 빌드 뒤 마무리.
 *
 * ① 없는 주소 장을 `404.html` 자리에 놓습니다.
 *
 *    Cloudflare Pages 는 없는 주소에 **`404.html` 하나**를 냅니다. 그런데
 *    Next 가 스스로 만드는 그 파일은 우리 `layout` 을 안 거쳐 글꼴도
 *    스타일도 `lang` 도 없습니다(root layout 이 주소 조각 아래 있어서).
 *    그래서 `/notfound/` 로 제대로 만든 것을 여기서 옮겨 놓습니다.
 *
 *    **`/404` 라는 주소로는 만들 수 없습니다** — Next 가 예약한 이름이라
 *    조용히 덮입니다.
 *
 * ② 빌드가 남긴 부스러기를 치웁니다. `__next.*.txt` 는 클라이언트가 길을
 *    바꿀 때 쓰는 것인데, 정적으로 내보낸 랜딩에는 쓰이지 않습니다.
 */
import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const made = join(out, 'notfound', 'index.html');

if (!existsSync(made)) {
  console.error('✗ out/notfound/index.html 이 없습니다 — 없는 주소 장이 안 만들어졌습니다.');
  process.exit(1);
}

const html = readFileSync(made, 'utf8');
// 제대로 된 장인지 한 번 봅니다. 맨 문서가 옮겨가면 아무도 모릅니다.
if (!html.includes('stylesheet') || !/<html lang="ko"/.test(html)) {
  console.error('✗ 없는 주소 장에 스타일이나 lang 이 없습니다 — layout 을 안 거쳤습니다.');
  process.exit(1);
}
writeFileSync(join(out, '404.html'), html);
rmSync(join(out, 'notfound'), { recursive: true, force: true });

// Next 가 자기 이름으로 만들어 둔 `/404/` 장. 우리 것을 `404.html` 에
// 놓았으므로 이쪽은 남을 이유가 없습니다 — 두면 `/404/` 주소로 Next 의
// 맨 화면이 열립니다.
rmSync(join(out, '404'), { recursive: true, force: true });

// 부스러기.
let swept = 0;
function sweep(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) sweep(p);
    else if (/^__next\..*\.txt$/.test(e) || e === 'index.txt') {
      rmSync(p);
      swept++;
    }
  }
}
sweep(out);
rmSync(join(out, '_not-found'), { recursive: true, force: true });

console.log(`✓ 404.html 을 제자리에 두었습니다 · 부스러기 ${swept}개 치움`);
