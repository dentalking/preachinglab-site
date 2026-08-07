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
// 지금은 메일 앱을 여는 방식입니다. 신청이 쌓이기 시작하면
// Cloudflare Pages Functions 나 Tally 같은 폼 서비스로 바꾸세요. README 참고.
const form = document.getElementById('applyForm');

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const need = ['f-name', 'f-contact'];
  for (const id of need) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      el.setAttribute('aria-invalid', 'true');
      return;
    }
    el.removeAttribute('aria-invalid');
  }

  const v = (id) => document.getElementById(id).value.trim();
  const lines = [
    `성함: ${v('f-name')}`,
    `교회: ${v('f-church') || '-'}`,
    `연락처: ${v('f-contact')}`,
    `설교 영상: ${v('f-link') || '-'}`,
    '',
    '지향하는 설교:',
    v('f-goal') || '-',
    '',
    '— preachinglab.cloud 에서 보냅니다',
  ];

  const url =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(`[파일럿 신청] ${v('f-name')}`)}` +
    `&body=${encodeURIComponent(lines.join('\n'))}`;

  location.href = url;
});
