# preachinglab.cloud — 웹

랜딩 네 말(ko·en·es·pt)과 방침·약관. **Next.js 를 Cloudflare Workers 에서**
돌립니다(`@opennextjs/cloudflare`).

```bash
npm run dev       # http://localhost:4300  (Next 개발 서버)
npm run preview   # 빌드 + Workers 로 띄워 보기  http://localhost:8787
npm run check     # 지금 나가 있는 랜딩과 같은지 잽니다 — preview 를 띄워 두고 도십시오
npm run deploy    # 빌드 + Cloudflare 로 올리기
```

**`npm run check` 는 띄워 놓고 받아 봅니다.** 파일을 읽는 것이 아니라 실제
응답을 재는데, 넘김·보안 머리·없는 주소처럼 **파일에는 안 담기는 것**이
거기서만 보이기 때문입니다.

## 왜 옮겼는가

옛 랜딩은 **HTML 네 벌(103KB)** 이었습니다. 말을 하나 늘릴 때마다 페이지가
한 벌씩 늘고, `hreflang` 다섯 줄과 `sitemap.xml` 과 `bump.sh` 를 함께
고쳐야 했습니다. `bump.sh` 주석이 그 대가를 직접 적어 두었습니다 —

> 영어·스페인어·포르투갈어 랜딩이 생기면서 **세 페이지가 조용히
> 낡았습니다.** … 한국어 페이지만 보면 멀쩡해 보였습니다.

지금은 **그리는 곳이 한 벌**이고 말 표가 넷입니다. 칸이 하나 빠지면
`tsc` 가 그 자리에서 멈춥니다.

## 구조

```
content/routes.ts     주소·말·글꼴의 유일한 목록. 여기서 sitemap·hreflang 이 나옵니다
content/types.ts      랜딩 한 장의 모양. 네 말이 이것을 똑같이 채웁니다
content/{ko,en,es,pt} 말 넷. 옛 HTML 에서 한 글자도 안 바꾸고 옮겼습니다
content/legal/        방침·약관 — **본문은 HTML 그대로**입니다(법률 문안)
components/Landing    그리는 곳 한 벌
app/[[...slug]]/      이것이 root layout 입니다(아래 「함정」)
scripts/check-parity  옛것과 같은지 재는 자
scripts/postbuild     404 를 제자리에 놓고 부스러기를 치웁니다
functions/apply.js    신청 폼이 보내는 곳 (Cloudflare Pages Function)
```

## 함정 — 다음 사람이 걸릴 자리

**① root layout 이 `app/layout.tsx` 가 아닙니다.**
`<html lang>` 을 말마다 달리 주어야 하는데 root layout 은 주소를 못 받습니다.
그래서 root 자체를 `[[...slug]]` 아래 두었습니다. `app/layout.tsx` 를
만들면 `lang` 이 한 말로 굳습니다.

**② `_headers` 는 자산에만, 페이지 머리는 `next.config` 에.**
옛 사이트는 전부 정적 파일이라 `public/_headers` 하나로 됐습니다. Workers
에서는 **페이지가 Worker 응답이라 그 파일 밖**입니다. 실측해 보니 `/` 에
보안 머리 네 줄이 하나도 안 붙어 있었습니다. 지금은 둘이 나눠 맡습니다 —
자산은 `_headers`, 페이지는 `next.config` 의 `headers()`.

**③ 넘김은 `public/_redirects` 가 합니다.** `next.config` 의 `redirects()`
로도 써 봤는데 `trailingSlash: true` 가 먼저 `/my` 를 `/my/` 로 308 해서
규칙이 안 맞았습니다. `_redirects` 는 Worker 앞에서 처리되어 그대로 됩니다.
**둘 다 두면 어느 쪽이 일하는지 모르게 되므로** 넘김은 한 곳에만 두었습니다.

**④ 빌드만 하면 전부 404 입니다.** 미리 그려 둔 페이지는 `populateCache`
단계에서 자산 쪽으로 옮겨집니다. 그 단계를 건너뛰고 `wrangler dev` 를 직접
띄우면 **모든 주소가 404 이고 로그에는 `NoFallbackError` 만** 남습니다.
`npm run preview` 는 그 단계를 포함합니다.

**⑤ `dynamicParams = false` 로 두면 없는 주소가 맨 화면으로 갑니다.**
세그먼트에 들어오지도 못해서 우리 `not-found.tsx` 가 안 쓰이고, Next 의
`404: This page could not be found.` 가 나갑니다. `true` 로 들여보낸 뒤
`notFound()` 를 던져야 layout 을 거칩니다.

**⑥ `/404` 라는 주소는 Next 가 예약했습니다.** 그 이름으로 페이지를 만들면
조용히 덮입니다. (지금은 안 씁니다 — Next 가 404 를 직접 냅니다.)

**⑦ 없는 주소 화면에는 `metadata` 를 못 줍니다.** JSX 로 쓴 `<title>` 도
머리로 안 올라갑니다. `layout` 의 `metadata` 에 둔 제목이 그 화면에만
쓰입니다 — 각 장은 자기 `generateMetadata` 로 덮습니다.

**⑧ 서버에서 브라우저로 함수를 못 넘깁니다.** 메일 제목이 `(name) => …`
함수였는데 빌드가 거기서 멈췄습니다. 지금은 `'[파일럿 신청] {name}'` 처럼
자리를 둔 글자입니다.

**⑨ `bump.sh` 는 이제 없습니다.** Next 가 파일 내용 해시를 붙여 내보내므로
「새 HTML + 옛 JS」 조합이 생기지 않습니다.

## 옮기며 드러난 것 — 아직 안 고친 것

- **es·pt 에 방침·약관이 없습니다.** 푸터가 영어 문서를 가리킵니다.
  번역이 오면 `routes.ts` 의 `HAS_PAGE` 한 줄로 켜지고, **sitemap 도 함께
  따라옵니다.** 법률 문안이라 지어 넣지 않았습니다.
- **머리띠의 신청 버튼이 한국어에만 있습니다.** 지금 모양 그대로 옮겼습니다.

## 고친 것

- **옛 404 가 버튼 네 개를 다 보이고 있었습니다.** `.btn` 의
  `display:inline-flex` 가 `[hidden]` 을 이겼습니다. `[hidden]{display:none
  !important}` 를 세웠습니다.
- **옛 404 에는 글꼴 링크가 하나도 없었습니다**(랜딩은 셋). 이제 `layout` 에서
  함께 받습니다.

## 옛 랜딩은 어디 갔는가

손으로 쓴 HTML 네 벌은 **`legacy-landing` 태그에 있습니다.**

```bash
git show legacy-landing:index.html      # 그때의 한국어 랜딩
git show legacy-landing --stat          # 그때 있던 파일 전부
```

폴더에 사본으로 남기지 않은 것은 **「어느 쪽이 진짜인가」가 흐려지기**
때문입니다. 언젠가 그 사본을 고치는 사람이 나옵니다. 대신 `npm run check`
가 그 태그에서 꺼내 지금 것과 맞대므로, **지우고도 계속 잴 수 있습니다.**

## 배포 — 아직 안 나갔습니다

**Pages 가 아니라 Workers 입니다.** 지금 운영 중인 것은 Cloudflare Pages
프로젝트이고, 이것은 별개의 Worker 로 올라갑니다.

```bash
npx wrangler login      # 한 번
npm run deploy          # 빌드 + populateCache + 올리기
```

올린 뒤 **도메인을 옮기셔야** 나갑니다 — Workers & Pages → 이 Worker →
Settings → Domains & Routes 에서 `preachinglab.cloud` 를 붙입니다. 옛 Pages
프로젝트에서 먼저 떼야 합니다(한 도메인은 한 곳에만 붙습니다).

**환경변수 둘을 Worker 쪽에 다시 넣으셔야 합니다** — 지금 Pages 프로젝트에
있는 값이 Worker 로 따라오지 않습니다.

```
RESEND_API_KEY      신청 메일. 없으면 폼이 「메일 설정이 되어 있지 않습니다」
TURNSTILE_SECRET    사람 확인. 없으면 확인을 건너뜁니다(코드가 그렇게 짜여 있습니다)
```

**신청 폼이 Pages Function 에서 Next 라우트로 옮겨졌습니다**
(`functions/apply.js` → `lib/apply.js` + `app/apply/route.ts`). 로직은 한 줄도
안 바뀌었고 껍데기만 갈았습니다. **그냥 두었으면 폼이 조용히 404 를 받고**
화면은 「전송이 안 되어 메일 앱으로 대신 엽니다」로 물러났을 것입니다 —
신청은 계속 들어오는데 아무도 못 알아차리는 종류의 고장입니다.

되돌리기: 도메인을 옛 Pages 프로젝트로 되돌리면 그대로입니다. 옛 랜딩은
`legacy-landing` 태그에 있습니다.

### 나간 뒤 확인할 것

```bash
for u in / /en/ /es/ /pt/ /privacy /terms /en/privacy /en/terms; do
  echo -n "$u  "; curl -sL -o /dev/null -w '%{http_code}\n' "https://preachinglab.cloud$u"
done
curl -sL https://preachinglab.cloud/ | grep -o '<html lang="[^"]*"'   # ko 여야 합니다
curl -s  https://preachinglab.cloud/sitemap.xml | grep -c '<loc>'      # 8 이어야 합니다
```

**`.html` 은 308 로 확장자 없는 주소로 넘어가므로 `curl -L` 없이 재면 빈
값이 나옵니다.** 8/29 에 그걸로 「안 갈렸다」고 볼 뻔한 적이 있습니다.
