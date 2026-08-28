// POST /apply — 파일럿 신청을 받아 메일 두 통을 보낸다.
//
//   ① hello@preachinglab.cloud 로 신청 내용 (Reply-To 를 신청자로 걸어 바로 답장 가능)
//   ② 신청자에게 접수 확인
//
// 연락처는 반드시 이메일이어야 합니다. 예전에는 휴대폰 번호도 받았는데,
// 그러면 ②가 나가지 않고 ①의 Reply-To 도 비어 답장할 길이 없습니다.
// 화면에는 "하루 안에 답장드리겠습니다"가 떠서, 신청자는 아무 연락도
// 받지 못한 채 기다리게 됩니다. 실제로 두 분이 그렇게 기다리셨습니다.
//
// 이전에는 mailto: 링크였습니다. 설정이 필요 없다는 장점이 있었지만,
// 휴대폰에서 메일 앱이 안 뜨거나 낯선 화면이 뜨면 거기서 신청이 끝났습니다.
//
// 환경변수: RESEND_API_KEY (Cloudflare Pages → Settings → Environment variables)

const FROM = 'Preaching Lab <hello@preachinglab.cloud>';
const INBOX = 'hello@preachinglab.cloud';

// 폼에서 받는 필드와 최대 길이. 여기 없는 키는 버립니다.
//
// 이름표는 여기 두지 않습니다. 신청하시는 분의 말에 따라 달라지는데,
// 길이 제한과 필수 여부는 말과 상관없이 같기 때문입니다.
const FIELDS = {
  name: { max: 60, required: true },
  church: { max: 120 },
  contact: { max: 200, required: true, email: true },
  link: { max: 500 },
  goal: { max: 2000 },
};

/**
 * 신청자에게 하는 말.
 *
 * ── 접수 확인 메일에 기기 이야기가 한국어에만 있는 이유 ──
 *
 * 한국어 쪽은 "지금은 안드로이드로 쓰실 수 있습니다" 라고 적습니다.
 * **한국 밖에서는 그것이 사실이 아닙니다.** 앱의 로그인 문이 카카오와
 * Apple 둘뿐이고 Apple 은 iOS 전용이라, 한국 밖 안드로이드 목회자는
 * 가입 자체가 되지 않습니다(구글 로그인은 서버에는 있고 앱에는 없습니다).
 *
 * 그래서 다른 말에는 **그 문장을 아예 두지 않았습니다.** 지어내면 그것은
 * 못 들어오시는 분께 들어오시라고 하는 것이 됩니다. 그 문이 열리면
 * 그때 각 말에 맞게 한 줄 더하시면 됩니다.
 */
const L10N = {
  ko: {
    labels: {
      name: '성함', church: '교회', contact: '이메일',
      link: '설교 영상·녹음 링크', goal: '지향하는 설교',
    },
    methodNotAllowed: 'POST 만 받습니다.',
    noMailConfig: '메일 설정이 되어 있지 않습니다.',
    unreadable: '요청을 읽지 못했습니다.',
    notHuman: '사람 확인에 실패했습니다. 새로고침 후 다시 시도해 주세요.',
    sendFailed: '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    // 받침 유무로 조사를 고릅니다. 한국어에만 있는 일입니다.
    required: (label) => `${josa(label, '을', '를')} 입력해 주세요.`,
    tooLong: (label) => `${josa(label, '이', '가')} 너무 깁니다.`,
    badEmail: '이메일 주소를 다시 확인해 주세요.',
    inboxSubject: (name) => `[파일럿 신청] ${name}`,
    formSignature: '— preachinglab.cloud 신청 폼',
    ackSubject: '신청을 받았습니다 — Preaching Lab',
    ackText: (name) =>
      `${name}님, 신청해 주셔서 감사합니다.\n\n` +
      '하루 안에 앱 설치 안내를 답장으로 보내드리겠습니다.\n' +
      '설교를 보내시는 것도, 리포트를 보시는 것도 모두 앱에서 하십니다.\n' +
      '유튜브 주소를 넣으셔도 되고, 앱으로 그 자리에서 녹음하셔도 됩니다.\n\n' +
      '지금은 안드로이드로 쓰실 수 있습니다.\n' +
      '아이폰은 준비 중이라, 나오는 대로 이 주소로 알려드리겠습니다.\n\n' +
      '리포트는 설교자 본인만 봅니다.\n\n' +
      '— Preaching Lab\nhttps://preachinglab.cloud',
    ackHtml: (name) =>
      `<p>${name}님, 신청해 주셔서 감사합니다.</p>` +
      '<p>하루 안에 앱 설치 안내를 답장으로 보내드리겠습니다.<br>' +
      '설교를 보내시는 것도, 리포트를 보시는 것도 모두 앱에서 하십니다.<br>' +
      '유튜브 주소를 넣으셔도 되고, 앱으로 그 자리에서 녹음하셔도 됩니다.</p>' +
      '<p>지금은 안드로이드로 쓰실 수 있습니다.<br>' +
      '아이폰은 준비 중이라, 나오는 대로 이 주소로 알려드리겠습니다.</p>' +
      '<p>리포트는 설교자 본인만 봅니다.</p>' +
      '<p>— Preaching Lab<br><a href="https://preachinglab.cloud">preachinglab.cloud</a></p>',
  },
  en: {
    labels: {
      name: 'Name', church: 'Church', contact: 'Email',
      link: 'Sermon video or recording', goal: 'The preaching they are aiming at',
    },
    methodNotAllowed: 'This endpoint takes POST only.',
    noMailConfig: 'Mail is not configured.',
    unreadable: 'We could not read that request.',
    notHuman: 'The human check did not pass. Please reload and try again.',
    sendFailed: 'That did not send. Please try again in a moment.',
    required: (label) => `Please enter your ${label.toLowerCase()}.`,
    // 이름표의 성(性)을 따지지 않아도 되게 통째로 감쌉니다 — es·pt 는
    // 관사가 낱말마다 갈려서, 이어 붙이면 반드시 어느 하나가 틀립니다.
    tooLong: (label) => `What you entered for “${label}” is too long.`,
    badEmail: 'Please check the email address.',
    inboxSubject: (name) => `[Application · en] ${name}`,
    formSignature: '— preachinglab.cloud application form',
    ackSubject: 'We have your request — Preaching Lab',
    ackText: (name) =>
      `${name}, thank you for writing to us.\n\n` +
      'We will reply within a day with how to install the app.\n' +
      'Sending a sermon and reading the report both happen in the app.\n' +
      'A YouTube link works, or you can record right there in the app.\n\n' +
      'Only the preacher sees the report.\n\n' +
      '— Preaching Lab\nhttps://preachinglab.cloud/en/',
    ackHtml: (name) =>
      `<p>${name}, thank you for writing to us.</p>` +
      '<p>We will reply within a day with how to install the app.<br>' +
      'Sending a sermon and reading the report both happen in the app.<br>' +
      'A YouTube link works, or you can record right there in the app.</p>' +
      '<p>Only the preacher sees the report.</p>' +
      '<p>— Preaching Lab<br><a href="https://preachinglab.cloud/en/">preachinglab.cloud</a></p>',
  },
  es: {
    labels: {
      name: 'Nombre', church: 'Iglesia', contact: 'Correo',
      link: 'Video o grabación del sermón', goal: 'La predicación a la que apunta',
    },
    methodNotAllowed: 'Esta dirección solo acepta POST.',
    noMailConfig: 'El correo no está configurado.',
    unreadable: 'No pudimos leer esa solicitud.',
    notHuman: 'No pasó la verificación. Recargue la página e inténtelo otra vez.',
    sendFailed: 'No se pudo enviar. Inténtelo de nuevo en un momento.',
    required: (label) => `Escriba su ${label.toLowerCase()}.`,
    tooLong: (label) => `Lo que escribió en «${label}» es demasiado largo.`,
    badEmail: 'Revise la dirección de correo.',
    inboxSubject: (name) => `[Application · es] ${name}`,
    formSignature: '— formulario de preachinglab.cloud',
    ackSubject: 'Recibimos su solicitud — Preaching Lab',
    ackText: (name) =>
      `${name}, gracias por escribirnos.\n\n` +
      'Le respondemos dentro de un día con las instrucciones para instalar la aplicación.\n' +
      'Enviar un sermón y leer el informe se hacen en la aplicación.\n' +
      'Sirve un enlace de YouTube, o puede grabar ahí mismo en la aplicación.\n\n' +
      'El informe lo ve solo el predicador.\n\n' +
      '— Preaching Lab\nhttps://preachinglab.cloud/en/',
    ackHtml: (name) =>
      `<p>${name}, gracias por escribirnos.</p>` +
      '<p>Le respondemos dentro de un día con las instrucciones para instalar la aplicación.<br>' +
      'Enviar un sermón y leer el informe se hacen en la aplicación.<br>' +
      'Sirve un enlace de YouTube, o puede grabar ahí mismo en la aplicación.</p>' +
      '<p>El informe lo ve solo el predicador.</p>' +
      '<p>— Preaching Lab<br><a href="https://preachinglab.cloud/en/">preachinglab.cloud</a></p>',
  },
  pt: {
    labels: {
      name: 'Nome', church: 'Igreja', contact: 'E-mail',
      link: 'Vídeo ou gravação do sermão', goal: 'A pregação que busca',
    },
    methodNotAllowed: 'Este endereço aceita apenas POST.',
    noMailConfig: 'O e-mail não está configurado.',
    unreadable: 'Não conseguimos ler esse pedido.',
    notHuman: 'A verificação não passou. Recarregue a página e tente de novo.',
    sendFailed: 'Não deu para enviar. Tente de novo em instantes.',
    required: (label) => `Escreva seu ${label.toLowerCase()}.`,
    tooLong: (label) => `O que você escreveu em “${label}” está longo demais.`,
    badEmail: 'Confira o endereço de e-mail.',
    inboxSubject: (name) => `[Application · pt] ${name}`,
    formSignature: '— formulário de preachinglab.cloud',
    ackSubject: 'Recebemos seu pedido — Preaching Lab',
    ackText: (name) =>
      `${name}, obrigado por escrever.\n\n` +
      'Respondemos dentro de um dia com as instruções para instalar o aplicativo.\n' +
      'Enviar um sermão e ler o relatório acontecem no aplicativo.\n' +
      'Um link do YouTube serve, ou você pode gravar ali mesmo no aplicativo.\n\n' +
      'O relatório só o pregador vê.\n\n' +
      '— Preaching Lab\nhttps://preachinglab.cloud/en/',
    ackHtml: (name) =>
      `<p>${name}, obrigado por escrever.</p>` +
      '<p>Respondemos dentro de um dia com as instruções para instalar o aplicativo.<br>' +
      'Enviar um sermão e ler o relatório acontecem no aplicativo.<br>' +
      'Um link do YouTube serve, ou você pode gravar ali mesmo no aplicativo.</p>' +
      '<p>O relatório só o pregador vê.</p>' +
      '<p>— Preaching Lab<br><a href="https://preachinglab.cloud/en/">preachinglab.cloud</a></p>',
  },
};

/**
 * 이 신청에 쓸 말.
 *
 * 폼이 보내온 값을 먼저 보고(그 페이지의 `<html lang>` 입니다), 없으면
 * 브라우저 헤더를 봅니다. 둘 다 모르면 한국어입니다 — 지금 오시는 분이
 * 대부분 한국 목회자라, 모를 때 영어로 답하면 아는 분께 모르는 말을
 * 보내는 것이 됩니다.
 */
function pick(bodyLocale, acceptLanguage) {
  const tag = String(bodyLocale ?? '').trim().toLowerCase().split(/[-_]/)[0];
  if (L10N[tag]) return L10N[tag];
  for (const part of String(acceptLanguage ?? '').split(',')) {
    const t = part.split(';')[0].trim().toLowerCase().split(/[-_]/)[0];
    if (L10N[t]) return L10N[t];
  }
  return L10N.ko;
}

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const looksLikeEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

// 받침 유무로 조사를 고른다. "성함을" / "연락처를"
// 안 하면 "성함을(를)" 같은 문장이 사용자에게 그대로 보입니다.
function josa(word, withBatchim, without) {
  const code = word.charCodeAt(word.length - 1);
  const hangul = code >= 0xac00 && code <= 0xd7a3;
  return word + (hangul && (code - 0xac00) % 28 !== 0 ? withBatchim : without);
}

// 메일 헤더에 들어가는 값에서 줄바꿈을 없앤다. 헤더 인젝션 방지.
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ').trim();

const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/**
 * Turnstile 토큰을 검증한다.
 * TURNSTILE_SECRET 이 없으면 검증을 건너뜁니다 — 키를 넣기 전에도 폼이
 * 죽지 않도록 한 것입니다. 키를 넣는 순간부터 자동으로 강제됩니다.
 */
async function passesTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;

  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    if (!data.success) console.error('turnstile 거부:', JSON.stringify(data['error-codes']));
    return data.success === true;
  } catch (err) {
    // 검증 서버에 못 닿았다고 해서 신청을 버리면 안 됩니다.
    // 사람 한 명을 잃는 쪽이 봇 한 번 통과시키는 쪽보다 나쁩니다.
    console.error('turnstile 검증 실패:', err.message);
    return true;
  }
}

async function send(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

// onRequestPost 만 두면 GET 요청이 이 함수를 그냥 지나쳐 정적 파일 쪽으로
// 흘러가고, Pages 가 index.html 을 200 으로 내줍니다. /apply 가 홈페이지의
// 사본이 되어 검색엔진에 중복으로 잡힙니다. 그래서 메서드를 직접 봅니다.
export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    // 몸통을 읽기 전이라 헤더가 가진 전부입니다.
    const t = pick(null, context.request.headers.get('accept-language'));
    return json(405, { ok: false, error: t.methodNotAllowed });
  }
  return handleApply(context);
}

async function handleApply({ request, env }) {
  const header = request.headers.get('accept-language');
  // 몸통을 읽기 전까지는 헤더가 가진 전부입니다. 읽고 나면 폼이 보내온
  // 값으로 다시 잡습니다 — 그쪽이 그 페이지의 실제 언어라 더 정확합니다.
  let t = pick(null, header);

  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: t.noMailConfig });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: t.unreadable });
  }

  t = pick(body.locale, header);

  // 봇은 사람에게 안 보이는 필드까지 채웁니다. 채워져 있으면 조용히 성공으로 돌려보냅니다.
  if (body.website) return json(200, { ok: true });

  const ok = await passesTurnstile(
    env,
    typeof body.turnstile === 'string' ? body.turnstile : '',
    request.headers.get('cf-connecting-ip'),
  );
  if (!ok) {
    return json(403, { ok: false, error: t.notHuman });
  }

  const v = {};
  for (const [key, spec] of Object.entries(FIELDS)) {
    const label = t.labels[key];
    const raw = typeof body[key] === 'string' ? body[key].trim() : '';
    if (spec.required && !raw) {
      return json(400, { ok: false, error: t.required(label), field: key });
    }
    if (raw.length > spec.max) {
      return json(400, { ok: false, error: t.tooLong(label), field: key });
    }
    if (spec.email && raw && !looksLikeEmail(raw)) {
      return json(400, { ok: false, error: t.badEmail, field: key });
    }
    v[key] = raw;
  }

  const name = oneLine(v.name);
  const contact = oneLine(v.contact);
  const replyTo = contact; // 위에서 형식을 검증했으므로 항상 이메일입니다.

  // 받는 쪽은 우리입니다. **신청자의 말로 적습니다** — 이름표가 우리 말로
  // 적혀 있으면 답장을 무슨 말로 써야 하는지가 한눈에 안 들어옵니다.
  const lines = Object.keys(FIELDS)
    .map((key) => `${t.labels[key]}: ${v[key] || '-'}`)
    .join('\n');

  try {
    await send(env.RESEND_API_KEY, {
      from: FROM,
      to: [INBOX],
      ...(replyTo ? { reply_to: [replyTo] } : {}),
      subject: t.inboxSubject(name),
      text: `${lines}\n\n${t.formSignature}`,
    });
  } catch (err) {
    // 신청 알림이 실패하면 신청 자체가 사라집니다. 여기서 멈춰야 합니다.
    console.error('신청 알림 실패:', err.message);
    return json(502, { ok: false, error: t.sendFailed });
  }

  // 접수 확인은 보조 수단입니다. 실패해도 신청은 이미 접수됐습니다.
  if (replyTo) {
    try {
      await send(env.RESEND_API_KEY, {
        from: FROM,
        to: [replyTo],
        subject: t.ackSubject,
        text: t.ackText(name),
        html: t.ackHtml(esc(name)),
      });
    } catch (err) {
      console.error('접수 확인 실패:', err.message);
    }
  }

  return json(200, { ok: true });
}
