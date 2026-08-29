# preachinglab.cloud — 웹

랜딩 네 말(ko·en·es·pt)과 방침·약관. **Next.js 정적 내보내기**입니다.

```bash
npm run dev      # http://localhost:4300
npm run build    # out/ 에 정적 파일. 끝에 postbuild 가 404 를 제자리에 놓습니다
npm run check    # 지금 나가 있는 랜딩과 같은지 잽니다 (git 태그 legacy-landing)
```

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

**② `/404` 라는 주소로는 못 만듭니다.** Next 가 예약한 이름이라 우리 것이
조용히 덮이고 `<title>404: This page could not be found.` 가 나갑니다.
`/notfound/` 로 만들어 `postbuild` 가 옮깁니다.

**③ 서버에서 브라우저로 함수를 못 넘깁니다.** 메일 제목이 `(name) => …`
함수였는데 빌드가 거기서 멈췄습니다. 지금은 `'[파일럿 신청] {name}'` 처럼
자리를 둔 글자입니다.

**④ `bump.sh` 는 이제 없습니다.** Next 가 파일 내용 해시를 붙여 내보내므로
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

`main` 에 올리기 **전에** Cloudflare Pages 의 빌드 설정을 먼저 바꾸셔야
합니다. 지금은 「빌드 없음」이라, 이대로 `main` 에 올라가면 **Next 소스가
그대로 배포되어 랜딩이 깨집니다.**

```
Workers & Pages → 이 프로젝트 → Settings → Builds & deployments

  빌드 명령      npm run build
  출력 디렉토리   out
  Node 버전      20 이상 (지금 맥은 24.1.0)
```

바꾸신 뒤 `next-web` 브랜치를 `main` 으로 합치면 나갑니다.

- `functions/apply.js` 는 저장소 뿌리에 그대로 있습니다 — Cloudflare 가
  빌드 출력과 별개로 이 폴더를 찾습니다
- `RESEND_API_KEY` 등 환경변수는 지금 프로젝트 것을 그대로 씁니다
- 되돌리기는 `git revert` 하나입니다. 정적 파일이라 서버가 없습니다

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
