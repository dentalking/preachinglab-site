/**
 * 옛 방침·약관 네 장의 **본문을 그대로** 떠 옵니다. 한 번만 돌립니다.
 *
 * 손으로 다시 치지 않는 이유 — 법률 문안이고, 옮겨 적다 한 낱말이
 * 바뀌면 그것이 곧 다른 약속이 됩니다. 이번 판에 랜딩을 옮기면서
 * 실제로 한 낱말을 잘못 옮겼고(`Ver antes` → `Ver primeiro`) 검사가
 * 잡았습니다. **법률 문서에는 그 검사를 기다릴 여유가 없습니다.**
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SITE = join(here, '..', '..', 'site');

const DOCS = [
  ['privacy.html', 'ko-privacy'],
  ['terms.html', 'ko-terms'],
  ['en/privacy.html', 'en-privacy'],
  ['en/terms.html', 'en-terms'],
];

for (const [src, name] of DOCS) {
  const html = readFileSync(join(SITE, src), 'utf8');
  const m = html.match(/<main class="doc">([\s\S]*?)<\/main>/);
  if (!m) throw new Error(`${src}: <main class="doc"> 를 못 찾았습니다`);
  const body = m[1].trim();
  if (body.includes('</main>')) throw new Error(`${src}: 본문 안에 </main> 이 또 있습니다`);

  const escaped = body.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  writeFileSync(
    join(here, '..', 'content', 'legal', `${name}.ts`),
    `// ${src} 의 본문을 **한 글자도 바꾸지 않고** 옮긴 것입니다.\n` +
      `// scripts/import-legal.mjs 가 한 번 떠 왔고, 지금부터는 이 파일이 원본입니다.\n` +
      `// 법률 문안이라 손으로 고칠 때도 문장 단위로만 손대십시오.\n\n` +
      `export const body = \`${escaped}\`;\n`,
  );
  console.log(`${name}.ts  ${body.length.toLocaleString()}자`);
}
