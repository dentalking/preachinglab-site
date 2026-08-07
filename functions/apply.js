// POST /apply — 파일럿 신청을 받아 메일 두 통을 보낸다.
//
//   ① hello@preachinglab.cloud 로 신청 내용 (Reply-To 를 신청자로 걸어 바로 답장 가능)
//   ② 신청자에게 접수 확인 (이메일을 주신 경우에만)
//
// 이전에는 mailto: 링크였습니다. 설정이 필요 없다는 장점이 있었지만,
// 휴대폰에서 메일 앱이 안 뜨거나 낯선 화면이 뜨면 거기서 신청이 끝났습니다.
//
// 환경변수: RESEND_API_KEY (Cloudflare Pages → Settings → Environment variables)

const FROM = 'Preaching Lab <hello@preachinglab.cloud>';
const INBOX = 'hello@preachinglab.cloud';

// 폼에서 받는 필드와 최대 길이. 여기 없는 키는 버립니다.
const FIELDS = {
  name: { label: '성함', max: 60, required: true },
  church: { label: '교회', max: 120 },
  contact: { label: '연락처', max: 200, required: true },
  link: { label: '설교 영상', max: 500 },
  goal: { label: '지향하는 설교', max: 2000 },
};

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const looksLikeEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

// 메일 헤더에 들어가는 값에서 줄바꿈을 없앤다. 헤더 인젝션 방지.
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ').trim();

const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

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

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: '메일 설정이 되어 있지 않습니다.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: '요청을 읽지 못했습니다.' });
  }

  // 봇은 사람에게 안 보이는 필드까지 채웁니다. 채워져 있으면 조용히 성공으로 돌려보냅니다.
  if (body.website) return json(200, { ok: true });

  const v = {};
  for (const [key, spec] of Object.entries(FIELDS)) {
    const raw = typeof body[key] === 'string' ? body[key].trim() : '';
    if (spec.required && !raw) {
      return json(400, { ok: false, error: `${spec.label}을(를) 입력해 주세요.`, field: key });
    }
    if (raw.length > spec.max) {
      return json(400, { ok: false, error: `${spec.label}이(가) 너무 깁니다.`, field: key });
    }
    v[key] = raw;
  }

  const name = oneLine(v.name);
  const contact = oneLine(v.contact);
  const replyTo = looksLikeEmail(contact) ? contact : null;

  const lines = Object.entries(FIELDS)
    .map(([key, spec]) => `${spec.label}: ${v[key] || '-'}`)
    .join('\n');

  try {
    await send(env.RESEND_API_KEY, {
      from: FROM,
      to: [INBOX],
      ...(replyTo ? { reply_to: [replyTo] } : {}),
      subject: `[파일럿 신청] ${name}`,
      text: `${lines}\n\n— preachinglab.cloud 신청 폼`,
    });
  } catch (err) {
    // 신청 알림이 실패하면 신청 자체가 사라집니다. 여기서 멈춰야 합니다.
    console.error('신청 알림 실패:', err.message);
    return json(502, { ok: false, error: '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.' });
  }

  // 접수 확인은 보조 수단입니다. 실패해도 신청은 이미 접수됐습니다.
  if (replyTo) {
    try {
      await send(env.RESEND_API_KEY, {
        from: FROM,
        to: [replyTo],
        subject: '신청을 받았습니다 — Preaching Lab',
        text:
          `${name}님, 신청해 주셔서 감사합니다.\n\n` +
          '보내주신 내용을 확인하고 하루 안에 답장드리겠습니다.\n' +
          '영상 링크를 아직 안 주셨다면 답장에 함께 보내주셔도 됩니다.\n' +
          '촬영을 하지 않으시면 녹음 파일 보내시는 방법을 안내드리겠습니다.\n\n' +
          '리포트는 설교자 본인만 봅니다.\n\n' +
          '— Preaching Lab\nhttps://preachinglab.cloud',
        html:
          `<p>${esc(name)}님, 신청해 주셔서 감사합니다.</p>` +
          '<p>보내주신 내용을 확인하고 하루 안에 답장드리겠습니다.<br>' +
          '영상 링크를 아직 안 주셨다면 답장에 함께 보내주셔도 됩니다.<br>' +
          '촬영을 하지 않으시면 녹음 파일 보내시는 방법을 안내드리겠습니다.</p>' +
          '<p>리포트는 설교자 본인만 봅니다.</p>' +
          '<p>— Preaching Lab<br><a href="https://preachinglab.cloud">preachinglab.cloud</a></p>',
      });
    } catch (err) {
      console.error('접수 확인 실패:', err.message);
    }
  }

  return json(200, { ok: true });
}

// onRequestPost 만 내보내면 다른 메서드에는 Pages 가 405 를 돌려줍니다.
// onRequest 를 함께 내보내면 그쪽이 먼저 잡혀서 POST 가 안 옵니다.
