/**
 * 옛 랜딩(site/)과 새 랜딩(out/)이 같은가.
 *
 * **이번 판이 하는 일은 네 벌을 한 벌로 줄이는 것뿐입니다.** 모양이나 말이
 * 함께 달라지면 무엇 때문에 달라졌는지 가릴 수 없게 되므로, 같다는 것을
 * 재는 자를 여기 둡니다.
 *
 *   node scripts/check-parity.mjs
 *
 * 0 통과 · 1 다름 · 2 못 돎(빌드가 없거나 옛 파일이 없음).
 *
 * **이 검사는 스스로를 한 번 의심하고 시작합니다** — 옛 파일에 없는 글자를
 * 심어 보고, 그것을 못 잡으면 검사 자체가 고장 난 것으로 보고 2 로 끝냅니다.
 * 「0건」은 검사가 진짜를 잡을 때만 뜻이 있습니다.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');
const NEW = join(ROOT, 'out');

/**
 * 옛 랜딩은 **git 에서 꺼내 봅니다.**
 *
 * 손으로 쓴 HTML 네 벌은 이 저장소에서 지워졌습니다. 폴더에 남겨 두면
 * 「어느 쪽이 진짜인가」가 흐려지고, 언젠가 그 사본을 고치는 사람이
 * 나옵니다. 그렇다고 지우고 검사를 버리면 **지금 나가 있는 것과 같은지를
 * 다시는 못 잽니다.**
 *
 * 그래서 태그 하나를 세워 두고 거기서 읽습니다.
 */
const BASE = 'legacy-landing';

function oldFile(path) {
  try {
    return execFileSync('git', ['-C', ROOT, 'show', `${BASE}:${path}`], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

/** 옛 주소 → 새 주소. 지금 쓰는 주소가 한 글자도 안 바뀌어야 합니다. */
const PAGES = [
  ['index.html', 'index.html'],
  ['en/index.html', 'en/index.html'],
  ['es/index.html', 'es/index.html'],
  ['pt/index.html', 'pt/index.html'],
  // 방침·약관. 옛 주소는 `.html` 이지만 나가는 주소는 `/privacy` 입니다
  // (Cloudflare 가 308 로 넘깁니다). 새 쪽은 처음부터 그 주소입니다.
  ['privacy.html', 'privacy/index.html'],
  ['terms.html', 'terms/index.html'],
  ['en/privacy.html', 'en/privacy/index.html'],
  ['en/terms.html', 'en/terms/index.html'],
  ['404.html', '404.html'],
];

function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ')
    // favicon 은 `href` 안에 SVG 가 통째로 들어 있습니다. 태그를 지우는
    // 정규식은 그 안의 `>` 에서 멈춰서 「✎」가 본문 글자로 남습니다.
    // **따옴표 안의 data: 값을 먼저 걷어내야** 합니다.
    .replace(/href=(["'])data:[\s\S]*?\1/gi, 'href=""')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/[\s ]+/g, ' ')
    .trim();
}

/**
 * 이름표(`id`). **클래스만 보다가 한 번 놓쳤습니다** — `id="applyForm"` 이
 * 빠진 채로 통과했고, 폼을 실제로 눌러 보고서야 나왔습니다. `id` 는 스크립트가
 * 붙잡는 손잡이이고 `#apply` 같은 앵커가 걸리는 자리입니다.
 */
function ids(html) {
  return new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]));
}

/** 화면 모양을 정하는 것은 클래스입니다. 글자가 같아도 클래스가 빠지면 다른 페이지입니다. */
function classes(html) {
  const out = new Map();
  for (const m of html.matchAll(/class=["']([^"']+)["']/g)) {
    for (const c of m[1].split(/\s+/)) {
      if (c) out.set(c, (out.get(c) ?? 0) + 1);
    }
  }
  return out;
}

function words(s) {
  return s.split(' ');
}

/** 두 글자열의 다른 자리. 낱말 단위로 봅니다. */
function diff(a, b) {
  const A = words(a);
  const B = words(b);
  // 짧은 목록이라 단순한 방법으로 충분합니다.
  let i = 0;
  while (i < A.length && i < B.length && A[i] === B[i]) i++;
  if (i === A.length && i === B.length) return null;
  let j = 0;
  while (j < A.length - i && j < B.length - i && A[A.length - 1 - j] === B[B.length - 1 - j]) j++;
  return {
    old: A.slice(i, A.length - j).join(' '),
    now: B.slice(i, B.length - j).join(' '),
  };
}

let bad = 0;
let checked = 0;
const lines = [];

// ── 검사가 진짜를 잡는지 먼저 봅니다 ────────────────────────────
{
  const probe = diff('가 나 다', '가 라 다');
  if (!probe || probe.old !== '나' || probe.now !== '라') {
    console.error('✗ 검사 자체가 고장났습니다 — 심어 둔 차이를 못 잡습니다.');
    process.exit(2);
  }
}

for (const [o, n] of PAGES) {
  const np = join(NEW, n);
  const oh = oldFile(o);
  if (oh === null) {
    console.error(`✗ 옛 파일을 못 꺼냈습니다: ${BASE}:${o}`);
    console.error(`  태그가 있는지 보십시오 — git tag -l ${BASE}`);
    process.exit(2);
  }
  if (!existsSync(np)) {
    console.error(`✗ 새 파일이 없습니다: ${np}`);
    console.error('  `npm run build` 를 먼저 돌리십시오.');
    process.exit(2);
  }
  checked++;
  const nh = readFileSync(np, 'utf8');

  const d = diff(visibleText(oh), visibleText(nh));
  if (d) {
    bad++;
    lines.push(`✗ ${o} — 보이는 글자가 다릅니다`);
    lines.push(`    옛: ${d.old.slice(0, 160)}`);
    lines.push(`    새: ${d.now.slice(0, 160)}`);
  }

  const oc = classes(oh);
  const nc = classes(nh);
  const missing = [...oc.keys()].filter((c) => !nc.has(c));
  if (missing.length) {
    bad++;
    lines.push(`✗ ${o} — 새 쪽에 없는 클래스 ${missing.length}개: ${missing.slice(0, 12).join(' ')}`);
  }

  const oi = ids(oh);
  const ni = ids(nh);
  const lostIds = [...oi].filter((i) => !ni.has(i));
  if (lostIds.length) {
    bad++;
    lines.push(`✗ ${o} — 새 쪽에 없는 이름표 ${lostIds.length}개: ${lostIds.join(' ')}`);
  }
}

if (bad) {
  console.log(lines.join('\n'));
  console.log(`\n${checked}장 중 ${bad}군데 어긋납니다.`);
  process.exit(1);
}
console.log(`✓ 옛 랜딩과 새 랜딩이 같습니다 — ${checked}장 (보이는 글자 · 클래스 · 이름표)`);
console.log('');
console.log('  여기서 안 보는 것 — 이 검사는 HTML 글자만 읽습니다:');
console.log('   · 화면에 실제로 그려진 모양(브라우저가 필요합니다)');
console.log('   · `hidden` 이 CSS 에 지는 것 — 옛 404 가 실제로 그랬습니다');
console.log('   · 폼을 눌렀을 때 일어나는 일 · 글꼴이 실제로 받아지는지');
