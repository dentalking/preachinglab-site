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
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..');

/**
 * 새 랜딩은 **실제 응답을 받아 봅니다.**
 *
 * 예전에는 `out/` 의 파일을 읽었습니다. Cloudflare Workers 로 옮기면서
 * 그 폴더가 없어졌고, 그보다 **띄워 놓고 받아 보는 쪽이 진짜에
 * 가깝습니다** — 넘김(`/my`)·보안 머리·없는 주소처럼 파일에는 안 담기는
 * 것들이 여기서만 보입니다.
 *
 *   npm run preview        (다른 창에서 띄워 두고)
 *   npm run check
 */
const BASE = process.env.CHECK_BASE ?? 'http://localhost:8787';

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
const LEGACY = 'legacy-landing';

async function newPage(path) {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  return { status: res.status, html: await res.text() };
}

function oldFile(path) {
  try {
    return execFileSync('git', ['-C', ROOT, 'show', `${LEGACY}:${path}`], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

/** 옛 주소 → 새 주소. 지금 쓰는 주소가 한 글자도 안 바뀌어야 합니다. */
const PAGES = [
  ['index.html', '/'],
  ['en/index.html', '/en/'],
  ['es/index.html', '/es/'],
  ['pt/index.html', '/pt/'],
  ['privacy.html', '/privacy/'],
  ['terms.html', '/terms/'],
  ['en/privacy.html', '/en/privacy/'],
  ['en/terms.html', '/en/terms/'],
];

/**
 * 파일에는 안 담기는 것들. **여기가 Workers 로 옮기며 늘어난 자리입니다.**
 *
 * `_headers`·`_redirects` 는 Cloudflare Pages 것이라 Workers 에서는 읽히지
 * 않습니다. `next.config.mjs` 로 옮겼는데, **옮겼다는 것을 파일 대조로는
 * 못 잽니다** — 안 옮겼어도 랜딩 HTML 은 똑같이 나옵니다. 카카오톡으로
 * 건너간 공유 링크가 404 가 되고서야 알게 됩니다.
 */
const BEHAVIOUR = [
  { what: '/my 를 리포트 쪽으로', path: '/my', status: 302, location: 'https://my.preachinglab.cloud/my' },
  { what: '/my/… 를 그대로', path: '/my/abc', status: 302, location: 'https://my.preachinglab.cloud/my/abc' },
  { what: '공유 링크 /s/…', path: '/s/xyz', status: 302, location: 'https://my.preachinglab.cloud/s/xyz' },
  { what: '없는 주소는 404', path: '/이런-주소는-없습니다/', status: 404 },
  { what: '신청은 GET 을 안 받음', path: '/apply/', status: 405 },
];

const HEADERS = [
  ['x-content-type-options', 'nosniff'],
  ['x-frame-options', 'DENY'],
  ['referrer-policy', 'strict-origin-when-cross-origin'],
  ['permissions-policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()'],
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

// 띄워 놓았는지 먼저 봅니다. 안 띄우고 도는 것과 다른 것이 없는 것은
// 전혀 다른 일인데, 안 가르면 「전부 다릅니다」로 나와 사람을 헤매게 합니다.
try {
  await fetch(BASE + '/', { redirect: 'manual' });
} catch {
  console.error(`✗ ${BASE} 가 안 떠 있습니다.`);
  console.error('  다른 창에서 `npm run preview` 를 띄워 두고 다시 돌리십시오.');
  process.exit(2);
}

for (const [o, n] of PAGES) {
  const oh = oldFile(o);
  if (oh === null) {
    console.error(`✗ 옛 파일을 못 꺼냈습니다: ${LEGACY}:${o}`);
    console.error(`  태그가 있는지 보십시오 — git tag -l ${LEGACY}`);
    process.exit(2);
  }
  checked++;
  const got = await newPage(n);
  if (got.status !== 200) {
    bad++;
    lines.push(`✗ ${n} — ${got.status} 입니다 (200 이어야 합니다)`);
    continue;
  }
  const nh = got.html;

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

// 파일에는 안 담기는 것들.
for (const b of BEHAVIOUR) {
  const res = await fetch(BASE + b.path, { redirect: 'manual' });
  if (res.status !== b.status) {
    bad++;
    lines.push(`✗ ${b.what} — ${b.path} 가 ${res.status} 입니다 (${b.status} 여야 합니다)`);
    continue;
  }
  if (b.location && res.headers.get('location') !== b.location) {
    bad++;
    lines.push(`✗ ${b.what} — ${res.headers.get('location')} 로 갑니다 (${b.location} 여야 합니다)`);
  }
}
{
  const res = await fetch(BASE + '/', { redirect: 'manual' });
  for (const [k, v] of HEADERS) {
    if (res.headers.get(k) !== v) {
      bad++;
      lines.push(`✗ 보안 머리 ${k} 가 ${res.headers.get(k) ?? '없음'} 입니다`);
    }
  }
  const asset = await fetch(BASE + '/assets/og.png', { redirect: 'manual' });
  if (asset.headers.get('cache-control') !== 'public, max-age=3600') {
    bad++;
    lines.push(`✗ 자산 캐시 머리가 ${asset.headers.get('cache-control') ?? '없음'} 입니다`);
  }
}

if (bad) {
  console.log(lines.join('\n'));
  console.log(`\n${checked}장 중 ${bad}군데 어긋납니다.`);
  process.exit(1);
}
console.log(`✓ 옛 랜딩과 새 랜딩이 같습니다 — ${checked}장 (보이는 글자 · 클래스 · 이름표)`);
console.log(`  그리고 파일에 안 담기는 것 ${BEHAVIOUR.length + HEADERS.length + 1}가지 — 넘김 · 없는 주소 · 보안 머리 · 자산 캐시`);
console.log('');
console.log('');
console.log('  여기서 안 보는 것:');
console.log('   · 화면에 실제로 그려진 모양(브라우저가 필요합니다)');
console.log('   · `hidden` 이 CSS 에 지는 것 — 옛 404 가 실제로 그랬습니다');
console.log('   · 폼을 눌렀을 때 일어나는 일 · 글꼴이 실제로 받아지는지');
