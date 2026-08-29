import { getCloudflareContext } from '@opennextjs/cloudflare';
// @ts-expect-error — 신청 처리는 옛 Pages Function 의 코드를 그대로 씁니다.
// 타입을 붙이자고 로직을 건드리지 않습니다. 실제로 메일이 나가는 자리입니다.
import { handleApply, methodNotAllowed } from '@/lib/apply';

/**
 * 파일럿 신청을 받는 자리. **주소가 `/apply` 그대로입니다.**
 *
 * 옛날에는 Cloudflare Pages Function(`functions/apply.js`)이었습니다.
 * Workers 로 옮기면서 Pages 전용 규약이 사라졌기 때문에 Next 의 라우트로
 * 바꿨습니다 — **그냥 두었으면 폼이 조용히 404 를 받고**, 화면은 「전송이
 * 안 되어 메일 앱으로 대신 엽니다」로 물러났을 것입니다. 신청은 계속
 * 들어오는데 아무도 못 알아차리는 종류의 고장입니다.
 *
 * `RESEND_API_KEY`·`TURNSTILE_SECRET` 은 Worker 의 환경변수에서 옵니다.
 */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  return handleApply({ request, env });
}

export function GET(request: Request) {
  return methodNotAllowed(request);
}
