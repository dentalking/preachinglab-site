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
const FIELDS = {
  name: { label: '성함', max: 60, required: true },
  church: { label: '교회', max: 120 },
  contact: { label: '이메일', max: 200, required: true, email: true },
  link: { label: '설교 영상·녹음 링크', max: 500 },
  goal: { label: '지향하는 설교', max: 2000 },
};

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
    return json(405, { ok: false, error: 'POST 만 받습니다.' });
  }
  return handleApply(context);
}

async function handleApply({ request, env }) {
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

  const ok = await passesTurnstile(
    env,
    typeof body.turnstile === 'string' ? body.turnstile : '',
    request.headers.get('cf-connecting-ip'),
  );
  if (!ok) {
    return json(403, { ok: false, error: '사람 확인에 실패했습니다. 새로고침 후 다시 시도해 주세요.' });
  }

  const v = {};
  for (const [key, spec] of Object.entries(FIELDS)) {
    const raw = typeof body[key] === 'string' ? body[key].trim() : '';
    if (spec.required && !raw) {
      return json(400, { ok: false, error: `${josa(spec.label, '을', '를')} 입력해 주세요.`, field: key });
    }
    if (raw.length > spec.max) {
      return json(400, { ok: false, error: `${josa(spec.label, '이', '가')} 너무 깁니다.`, field: key });
    }
    if (spec.email && raw && !looksLikeEmail(raw)) {
      return json(400, { ok: false, error: '이메일 주소를 다시 확인해 주세요.', field: key });
    }
    v[key] = raw;
  }

  const name = oneLine(v.name);
  const contact = oneLine(v.contact);
  const replyTo = contact; // 위에서 형식을 검증했으므로 항상 이메일입니다.

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
          '링크를 아직 안 주셨다면 이 메일에 답장으로 보내주셔도 됩니다.\n' +
          '유튜브 주소도 되고, 녹음 파일을 올려두신 드라이브·드롭박스 링크도 됩니다.\n' +
          '파일을 그대로 첨부하셔도 되지만, 25MB가 넘으면 반송되니 링크가 안전합니다.\n\n' +
          '리포트는 설교자 본인만 봅니다.\n\n' +
          '— Preaching Lab\nhttps://preachinglab.cloud',
        html:
          `<p>${esc(name)}님, 신청해 주셔서 감사합니다.</p>` +
          '<p>보내주신 내용을 확인하고 하루 안에 답장드리겠습니다.<br>' +
          '링크를 아직 안 주셨다면 이 메일에 답장으로 보내주셔도 됩니다.<br>' +
          '유튜브 주소도 되고, 녹음 파일을 올려두신 드라이브·드롭박스 링크도 됩니다.<br>' +
          '파일을 그대로 첨부하셔도 되지만, 25MB가 넘으면 반송되니 링크가 안전합니다.</p>' +
          '<p>리포트는 설교자 본인만 봅니다.</p>' +
          '<p>— Preaching Lab<br><a href="https://preachinglab.cloud">preachinglab.cloud</a></p>',
      });
    } catch (err) {
      console.error('접수 확인 실패:', err.message);
    }
  }

  return json(200, { ok: true });
}
