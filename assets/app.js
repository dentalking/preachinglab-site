// 몇 분이나 오시는지 한 번 알린다.
//
// **외부 분석 도구를 쓰지 않습니다.** 구글 애널리틱스를 넣는 순간 목사님이
// 이 페이지를 봤다는 사실이 광고 회사로 갑니다. 설교를 맡아 두는 서비스가
// 할 일이 아닙니다.
//
// 우리 서버로 숫자만 보냅니다 — 날짜·경로·유입처 도메인·폰인지 여부.
// 쿠키를 굽지 않아 같은 분이 두 번 오신 것과 두 분이 한 번씩 오신 것을
// 구별하지 못합니다. 구별하려면 사람을 표시해야 하는데, 그걸 안 하기로 한
// 것이 요점입니다. 그래도 "알리는 문제인가 설득하는 문제인가" 는 갈립니다.
//
// `no-cors` 라 응답을 읽지 못하고, 실패해도 아무 일도 일어나지 않습니다.
// 세는 일 때문에 페이지가 느려지면 본말이 뒤집힙니다.
const COUNT_AT = 'https://my.preachinglab.cloud/v';
function countVisit(path) {
  try {
    const u = new URL(COUNT_AT);
    u.searchParams.set('p', path);
    if (document.referrer) u.searchParams.set('r', document.referrer);
    fetch(u, { mode: 'no-cors', credentials: 'omit', keepalive: true }).catch(() => {});
  } catch {
    /* 세지 못해도 그만입니다 */
  }
}
countVisit(location.pathname.replace(/\.html$/, '') || '/');

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


/* ── 무슨 말로 말할 것인가 ───────────────────── */
//
// **페이지의 `<html lang>` 을 그대로 봅니다.** 페이지마다 숨은 칸을 두는
// 것보다 낫습니다 — 그 칸은 페이지의 실제 언어와 어긋날 수 있고, 어긋나면
// 영어 화면에서 한국어 안내가 뜹니다. `lang` 은 어긋날 수가 없습니다.
//
// 아래 한국어 문장은 지금 쓰이던 것을 한 글자도 바꾸지 않고 옮긴 것입니다.
const L10N = {
  ko: {
    fillMarked: '표시된 칸을 채워주세요.',
    needEmail: '리포트를 받으실 이메일 주소를 적어주세요.',
    sending: '보내는 중…',
    received: '신청이 접수되었습니다. 하루 안에 답장드리겠습니다.',
    checkInput: '입력을 확인해 주세요.',
    humanFailed: '사람 확인에 실패했습니다. 잠시 후 다시 눌러주세요.',
    mailFallback: '전송이 안 되어 메일 앱으로 대신 엽니다.',
    // 메일 앱으로 물러날 때 채워 넣는 글. 받는 쪽은 우리입니다.
    mailSubject: (name) => `[파일럿 신청] ${name}`,
    mailName: '성함',
    mailChurch: '교회',
    mailEmail: '이메일',
    mailLink: '설교 영상',
    mailGoal: '지향하는 설교',
  },
  en: {
    fillMarked: 'Please fill in the marked fields.',
    needEmail: 'Please give the email address where you will receive the report.',
    sending: 'Sending…',
    received: 'We have your request. We will write back within a day.',
    checkInput: 'Please check what you entered.',
    humanFailed: 'The human check did not pass. Please wait a moment and press again.',
    mailFallback: 'That did not send, so we are opening your mail app instead.',
    mailSubject: (name) => `[Application] ${name}`,
    mailName: 'Name',
    mailChurch: 'Church',
    mailEmail: 'Email',
    mailLink: 'Sermon video',
    mailGoal: 'The preaching they are aiming at',
  },
  es: {
    fillMarked: 'Complete los campos señalados.',
    needEmail: 'Escriba el correo donde recibirá el informe.',
    sending: 'Enviando…',
    received: 'Recibimos su solicitud. Le respondemos dentro de un día.',
    checkInput: 'Revise lo que escribió.',
    humanFailed: 'No pasó la verificación. Espere un momento y vuelva a pulsar.',
    mailFallback: 'No se pudo enviar, así que abrimos su aplicación de correo.',
    mailSubject: (name) => `[Solicitud] ${name}`,
    mailName: 'Nombre',
    mailChurch: 'Iglesia',
    mailEmail: 'Correo',
    mailLink: 'Video del sermón',
    mailGoal: 'La predicación a la que apunta',
  },
  pt: {
    fillMarked: 'Preencha os campos marcados.',
    needEmail: 'Escreva o e-mail onde vai receber o relatório.',
    sending: 'Enviando…',
    received: 'Recebemos seu pedido. Respondemos dentro de um dia.',
    checkInput: 'Confira o que você escreveu.',
    humanFailed: 'A verificação não passou. Espere um instante e clique de novo.',
    mailFallback: 'Não deu para enviar, então abrimos seu aplicativo de e-mail.',
    mailSubject: (name) => `[Pedido] ${name}`,
    mailName: 'Nome',
    mailChurch: 'Igreja',
    mailEmail: 'E-mail',
    mailLink: 'Vídeo do sermão',
    mailGoal: 'A pregação que busca',
  },
};

/** 이 페이지의 말. 모르는 값이면 한국어입니다. */
const LANG = (document.documentElement.lang || 'ko').toLowerCase().split('-')[0];
const T = L10N[LANG] ?? L10N.ko;

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

// Turnstile 은 interaction-only 로 붙어 있어 평소에는 화면에 나타나지 않습니다.
// 토큰은 페이지가 뜬 뒤 백그라운드에서 발급되므로, 아주 빨리 누르면 아직 없을 수 있습니다.
const turnstileToken = () =>
  document.querySelector('[name="cf-turnstile-response"]')?.value ?? '';

/** 서버가 안 될 때 쓰는 예전 경로. 메일 앱에 내용을 채워 엽니다. */
function mailtoFallback() {
  const lines = [
    `${T.mailName}: ${v('f-name')}`,
    `${T.mailChurch}: ${v('f-church') || '-'}`,
    `${T.mailEmail}: ${v('f-contact')}`,
    `${T.mailLink}: ${v('f-link') || '-'}`,
    '',
    `${T.mailGoal}:`,
    v('f-goal') || '-',
  ];
  location.href =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(T.mailSubject(v('f-name')))}` +
    `&body=${encodeURIComponent(lines.join('\n'))}`;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  for (const id of ['f-name', 'f-contact']) {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.focus();
      el.setAttribute('aria-invalid', 'true');
      say('bad', T.fillMarked);
      return;
    }
    el.removeAttribute('aria-invalid');
  }

  // 이메일이 아니면 접수 확인도 답장도 보낼 수 없습니다. 실제로 휴대폰 번호만
  // 적고 신청하신 분들이 아무 연락도 못 받은 채 기다리신 적이 있습니다.
  const contactEl = document.getElementById('f-contact');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactEl.value.trim())) {
    contactEl.focus();
    contactEl.setAttribute('aria-invalid', 'true');
    say('bad', T.needEmail);
    return;
  }
  contactEl.removeAttribute('aria-invalid');

  button.disabled = true;
  say('busy', T.sending);

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
        turnstile: turnstileToken(),
        // 접수 확인 메일을 무슨 말로 보낼지. 이 페이지의 <html lang> 입니다.
        locale: LANG,
      }),
    });
    const data = await res.json().catch(() => ({}));

    // 토큰은 한 번 쓰면 끝입니다. 성공이든 실패든 새로 받아야 다시 누를 수 있습니다.
    window.turnstile?.reset();

    if (res.ok && data.ok) {
      form.querySelectorAll('input, textarea').forEach((el) => (el.value = ''));
      // 방문과 신청을 나란히 놓아야 "와서 안 누르는 것" 이 보입니다.
      countVisit('/apply-done');
      say('good', T.received);
      button.disabled = false;
      return;
    }

    if (res.status === 400 && data.field) {
      const el = document.getElementById(`f-${data.field}`);
      el?.focus();
      el?.setAttribute('aria-invalid', 'true');
      say('bad', data.error ?? T.checkInput);
      button.disabled = false;
      return;
    }

    // 사람 확인 실패. 메일 앱으로 밀지 않습니다 — 봇이면 그쪽도 막아야 하고,
    // 사람이면 잠깐 뒤 다시 누르는 것으로 대개 통과합니다.
    if (res.status === 403) {
      say('bad', data.error ?? T.humanFailed);
      button.disabled = false;
      return;
    }

    throw new Error(data.error ?? `HTTP ${res.status}`);
  } catch {
    window.turnstile?.reset();
    say('bad', T.mailFallback);
    button.disabled = false;
    mailtoFallback();
  }
});
