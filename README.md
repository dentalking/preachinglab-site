# preachinglab.cloud — 랜딩 페이지 · **여기는 끝났습니다 (2026-08-29)**

> ## 이 저장소를 고치지 마십시오
>
> `preachinglab.cloud` 는 이제 **Railway** 에서 섭니다. 랜딩은
> **`dentalking/sermon-archive` 의 `web/`** 에 있습니다(Next.js).
>
> ```
> web/content/{ko,en,es,pt}.tsx   네 말의 글
> web/components/Landing.tsx      머리띠·본문
> web/app/globals.css             모양
> ```
>
> ### 왜 옮겼는가
>
> **랜딩이 두 벌이라 한쪽만 고쳐졌습니다.** 2026-08-29 밤, 로그인 뒤로
> 들어가는 문(`내 리포트`)을 여기에만 냈고 저쪽에는 안 났습니다. 그래서
> `preachinglab.cloud` 로 오신 분께는 문이 보이고 `my.preachinglab.cloud`
> 로 오신 분께는 안 보였습니다. **두 곳에 두면 반드시 이렇게 됩니다.**
>
> 그리고 웹이 앱과 같은 일을 하려면 DB 와 같은 자리에 있어야 합니다 —
> Cloudflare Workers 에서는 Postgres 로 TCP 를 못 열고, PDF 를 만드는
> Chromium 도 그 컨테이너에만 있습니다.
>
> ### 배포는 끝났습니다
>
> **Cloudflare Pages 프로젝트도 같은 날 지웠습니다.**
> `preachinglab-site.pages.dev` 는 더는 없습니다. 이 저장소는 이제
> **아무 데도 배포되지 않습니다.**
>
> `legacy-landing` 태그는 새 저장소에 따라가 있고, `check-parity` 가
> 아직 그것과 지금 랜딩을 맞대고 있습니다. **이 저장소의 이력은 그래서
> 지우면 안 됩니다.**
>
> 아래는 옛 안내입니다. 기록으로만 두십시오.

---

# (옛 안내) preachinglab.cloud — 랜딩 페이지

설교 회고 서비스 Preaching Lab 의 소개 페이지. 정적 파일 세 개뿐입니다.

```
index.html
assets/style.css
assets/app.js
_headers          Cloudflare Pages 보안 헤더
```

빌드 과정이 없습니다. 파일을 고치면 그대로 배포됩니다.

## ⚠️ 커밋 전에 `./bump.sh`

`assets/` 를 고치셨으면 **반드시 실행하세요.**

```bash
./bump.sh && git add -A && git commit -m "…" && git push
```

`index.html` 은 캐시되지 않지만 `assets/*` 는 엣지에 **최대 4시간** 남습니다.
그동안 방문자는 **새 HTML + 옛 JS** 를 받습니다. 실제로 이 조합 때문에
신청 폼이 예전 mailto 동작으로 되돌아간 적이 있습니다. 조용히 깨지는 종류라
더 위험합니다.

`bump.sh` 는 파일 내용의 해시를 URL 에 붙입니다(`app.js?v=7e0f3ce0`).
내용이 바뀌면 URL 이 바뀌므로 캐시가 자동으로 무효화됩니다. 여러 번 돌려도
안전합니다.

> Cloudflare 대시보드에서 **Caching → Browser Cache TTL** 을
> `Respect Existing Headers` 로 바꾸면 `_headers` 의 값이 그대로 적용됩니다.
> 지금은 존 기본값(4시간)이 `_headers` 를 덮어쓰고 있습니다.
> 바꾸셔도 `bump.sh` 는 계속 쓰는 편이 안전합니다.

## 로컬에서 보기

```bash
python3 -m http.server 4300
# http://localhost:4300
```

## Cloudflare Pages 배포

1. 이 폴더를 GitHub 저장소로 올립니다 (**public 이어도 됩니다** — 고객 데이터가 없습니다).
   ```bash
   gh repo create preachinglab-site --public --source=. --push
   ```
2. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**
3. 저장소 선택 후 빌드 설정:

   | 항목 | 값 |
   |---|---|
   | Framework preset | None |
   | Build command | *(비움)* |
   | Build output directory | `/` |

4. 배포되면 **Custom domains** 에서 `preachinglab.cloud` 와 `www` 를 연결합니다.
   DNS가 이미 Cloudflare에 있으니 레코드는 자동으로 잡힙니다.

> 설교 녹취록이 들어 있는 `sermon-archive` 저장소와는 **반드시 분리해 두세요.**
> 이 저장소는 공개, 그쪽은 비공개입니다.

## 신청 메일 받기 — `hello@preachinglab.cloud`

페이지의 신청 폼과 푸터가 이 주소를 씁니다. 무료로 만들 수 있습니다.

Cloudflare 대시보드 → 도메인 선택 → **Email → Email Routing**
→ `hello@preachinglab.cloud` 를 실제 개인 메일로 포워딩.

주소를 바꾸시려면 `assets/app.js` 맨 위 `CONTACT_EMAIL` 과
`index.html` 의 `mailto:` 두 곳을 함께 고치세요.

## 폼을 제대로 받고 싶어지면

지금은 **메일 앱을 여는 방식**입니다. 설정이 필요 없어 바로 동작하지만,
신청이 쌓이기 시작하면 전환이 떨어집니다(특히 모바일). 바꿀 때 선택지:

| 방법 | 난이도 | 비고 |
|---|---|---|
| Tally / 구글폼 임베드 | 가장 쉬움 | 폼 UI를 통째로 교체 |
| Formspree | 쉬움 | `<form action>` 만 바꾸면 됨 |
| Cloudflare Pages Functions | 중간 | `functions/apply.js` 추가. D1이나 KV에 저장하거나 메일로 전달 |

`assets/app.js` 의 submit 핸들러만 갈아끼우면 됩니다.

## 페이지에 실린 샘플에 대해

샘플 리포트는 **파일럿 목사님의 실제 리포트에서 발췌**했습니다.
교회·성함·설교 제목·성경 본문, 그리고 설교 중 나온 고유한 예화(아이 이름, 음식 등)를
모두 지웠습니다. 유튜브 검색이나 같은 교회 성도의 기억으로 특정할 수 없어야 한다는
기준으로 가렸습니다.

> ⚠️ **원문 인용을 공개 페이지에 싣는 것은 보관 동의와 별개입니다.**
> 지금 수준으로도 특정은 어렵지만, 해당 목사님께 "리포트 일부를 익명으로
> 소개 페이지에 써도 될지" 한 번 여쭙는 편이 안전합니다.
> 실명·추천사를 싣게 되면 그때는 반드시 별도 동의가 필요합니다.

## 디자인 메모

**은유는 설교 원고와 그 여백의 주석입니다.**

색의 핵심은 **파란 펜**입니다. 빨간 펜은 채점이고 파란 펜은 대화입니다.
이 서비스가 "평가가 아니라 회고"라는 것을 색 하나로 말합니다.
그래서 강조·링크·주석이 모두 `--pen: #2b4c8c` 입니다.

배경은 크림이 아니라 **거의 흰 종이**(`#fbfaf8`)입니다. 원고지에 가깝게,
그리고 흔한 AI 랜딩 페이지의 크림+테라코타 조합에서 떨어뜨리려는 선택입니다.

- 표제 `Gowun Batang` — 명조. 설교 원고와 성경의 활자
- 본문 `Pretendard` — 긴 한글 문장을 읽기 편하게
- 라벨·숫자 `JetBrains Mono` — "lab"의 계측 느낌

시그니처는 히어로의 **원고 → 연결선 → 주석**입니다. 제품이 하는 일을
제품의 재료로 보여줍니다. 페이지에서 유일하게 힘을 준 곳이고,
나머지는 일부러 조용하게 두었습니다.
