/* Preaching Lab — 랜딩 페이지 동작 */

const CONTACT_EMAIL = 'hello@preachinglab.cloud';

/* ── 점수 막대 ───────────────────────────────── */
document.querySelectorAll('.pips').forEach((el) => {
  const n = Number(el.dataset.n ?? 0);
  el.innerHTML = Array.from({ length: 5 }, (_, i) =>
    `<span class="${i < n ? 'on' : ''}"></span>`,
  ).join('');
});

/* ── 스크롤 등장 ─────────────────────────────── */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const items = document.querySelectorAll('.reveal');

if (reduced || !('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}

/* ── 신청 폼 ─────────────────────────────────── */
// /apply (Cloudflare Pages Function) 로 보냅니다.
// 실패하면 예전 방식인 메일 앱 열기로 물러납니다 — 신청을 흘리는 것보다 낫습니다.
const form = document.getElementById('applyForm');
const status = document.getElementById('applyStatus');
const button = form?.querySelector('button[type="submit"]');

const v = (id) => document.getElementById(id).value.trim();

function say(kind, text) {
  if (!status) return;
  status.className = `form-status ${kind}`;
  status.textContent = text;
}

/** 서버가 안 될 때 쓰는 예전 경로. 메일 앱에 내용을 채워 엽니다. */
function mailtoFallback() {
  const lines = [
    `성함: ${v('f-name')}`,
    `교회: ${v('f-church') || '-'}`,
    `연락처: ${v('f-contact')}`,
    `설교 영상: ${v('f-link') || '-'}`,
    '',
    '지향하는 설교:',
    v('f-goal') || '-',
  ];
  location.href =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(`[파일럿 신청] ${v('f-name')}`)}` +
    `&body=${encodeURIComponent(lines.join('\n'))}`;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  for (const id of ['f-name', 'f-contact']) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      el.setAttribute('aria-invalid', 'true');
      say('bad', '표시된 칸을 채워주세요.');
      return;
    }
    el.removeAttribute('aria-invalid');
  }

  button.disabled = true;
  say('busy', '보내는 중…');

  try {
    const res = await fetch('/apply', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: v('f-name'),
        church: v('f-church'),
        contact: v('f-contact'),
        link: v('f-link'),
        goal: v('f-goal'),
        website: v('f-website'), // 사람에게는 안 보이는 칸 — 봇 거르기
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      form.querySelectorAll('input, textarea').forEach((el) => (el.value = ''));
      say('good', '신청이 접수되었습니다. 하루 안에 답장드리겠습니다.');
      button.disabled = false;
      return;
    }

    if (res.status === 400 && data.field) {
      const el = document.getElementById(`f-${data.field}`);
      el?.focus();
      el?.setAttribute('aria-invalid', 'true');
      say('bad', data.error ?? '입력을 확인해 주세요.');
      button.disabled = false;
      return;
    }

    throw new Error(data.error ?? `HTTP ${res.status}`);
  } catch {
    say('bad', '전송이 안 되어 메일 앱으로 대신 엽니다.');
    button.disabled = false;
    mailtoFallback();
  }
});
