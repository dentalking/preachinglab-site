# 이 저장소에서 일할 때

랜딩 네 말(ko·en·es·pt)과 방침·약관. 자세한 것은 `README.md` — 특히
**「함정」**을 먼저 읽으십시오. 아홉 가지가 적혀 있고 전부 실제로 걸린
것들입니다.

## 배포 구조 — **GitHub 이 기준입니다**

```
저장소   github.com/dentalking/preachinglab-site   (private)
  main             ← 지금 나가 있는 것 (손으로 쓴 HTML 네 벌)
  next-web         ← Next.js 로 옮긴 것. **아직 안 나갔습니다**
  legacy-landing   ← 옛 HTML 네 벌이 담긴 태그

지금 나가 있는 곳   Cloudflare Pages (preachinglab.cloud)
```

**`main` 에 push 하면 그 순간 배포됩니다.** 그래서 `next-web` 은 브랜치에
두었습니다 — 지금 Cloudflare 설정이 「빌드 없음」이라, 이대로 `main` 에
올라가면 **Next 소스가 그대로 배포되어 랜딩이 깨집니다.**

배포처를 어디로 할지는 아직 정하는 중입니다. `README.md` 의 「배포」를
보십시오.

## 검사

```bash
npm run preview   # 다른 창에서 띄워 두고
npm run check     # 지금 나가 있는 랜딩과 같은지
```

**파일을 읽는 것이 아니라 실제 응답을 받아 잽니다.** 넘김(`/my`·`/s/*`)·
보안 머리·없는 주소처럼 **HTML 에 안 담기는 것**이 거기서만 보이기
때문입니다. 실제로 넘김을 옮겼다고 믿었는데 한 번도 안 쓰이고 있던 일이
있었습니다.

옛 랜딩과 맞대는 기준은 **`legacy-landing` 태그**입니다. 폴더에 사본을
남기지 않았습니다 — 두면 「어느 쪽이 진짜인가」가 흐려집니다.

```bash
git show legacy-landing:index.html
```

## 손대기 전에

- **말을 하나 늘리면 `content/routes.ts` 만 고칩니다.** sitemap·hreflang·
  글꼴이 거기서 나옵니다. 옛날에는 네 파일에 손으로 적어서, 말이 넷으로
  늘었을 때 **es·pt 의 방침·약관이 sitemap 에서 빠진 것을 아무도 못
  봤습니다.**
- **법률 문서(`content/legal/`)는 HTML 그대로입니다.** 옮겨 적다 한 낱말이
  바뀌면 그것이 곧 다른 약속입니다. 손댈 때도 문장 단위로만.
- 아직 안 고친 것 둘 — es·pt 에 방침·약관이 없어 영어로 보냅니다
  (`HAS_PAGE` 한 줄로 켜집니다) · 머리띠 신청 버튼이 한국어에만 있습니다.

## 들어가는 문 (`nav.mine`)

머리띠 오른쪽의 **「내 리포트」는 네 말 모두에 있습니다.** 이미 쓰고 계신
분이 랜딩에서 들어가는 유일한 길입니다.

**오래 이 문이 없었습니다.** 넘김은 서버에 있었는데(`public/_redirects`
의 `/my`) 그리로 가는 링크를 아무도 안 그려서, 랜딩의 링크 열한 개가 전부
페이지 안 앵커·언어·약관·메일이었습니다. **주소를 직접 치셔야만** 들어가
졌고, 이미 쓰시는 목사님께 보이는 것은 「파일럿 신청하기」뿐이었습니다.

**`/my` 로 씁니다.** 절대 주소(`my.preachinglab.cloud`)를 박지 마십시오 —
목사님께 알려드리는 주소는 `preachinglab.cloud` 하나여야 하고, 넘김이
그것을 받습니다. 그 넘김은 Worker 앞에서 처리되므로 이 저장소를 어디에
올리든 따라갑니다.

조용한 쪽(`btn-quiet`)에 둔 것은 랜딩이 아직 **처음 오신 분**을 향한
화면이기 때문입니다. 강조는 신청 버튼이 가져갑니다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
