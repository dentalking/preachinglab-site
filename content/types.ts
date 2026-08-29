import type { ReactNode } from 'react';

/**
 * 랜딩 한 장의 내용 전부. **네 말이 이 모양을 똑같이 채웁니다.**
 *
 * 지금은 말마다 HTML 이 한 벌씩(모두 103KB) 있고, 서로 어긋나도 아무도
 * 못 봅니다. 실제로 어긋나 있었습니다 — 8/28 에 `assets/app.js` 를 고쳤는데
 * 네 페이지가 전부 옛 해시를 가리켰고, `bump.sh` 주석이 그것을 이렇게
 * 적었습니다: **「한국어 페이지만 보면 멀쩡해 보였습니다.」**
 *
 * 여기 칸이 하나 빠지면 `tsc` 가 그 자리에서 멈춥니다. 사람이 네 파일을
 * 눈으로 맞대는 일이 없어집니다.
 */
export type Landing = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImageAlt: string;
  };
  nav: {
    langLabel: string;
    /**
     * 머리띠 오른쪽의 신청 버튼. **한국어에만 있습니다.**
     *
     * en·es·pt 에는 이 버튼이 없습니다 — 옮기면서 발견한 것이고, 지금
     * 모양을 그대로 지킵니다. 넷을 같게 만들지는 이번 판이 아니라 사장님이
     * 정하실 일입니다. **없으면 없는 대로 그려집니다.**
     */
    apply?: string;
  };
  hero: {
    eyebrow: string;
    h1: ReactNode;
    lede: string;
    ledeNote: string;
    ctaPrimary: string;
    ctaSecondary: string;
    specimenLabel: string;
    specimenQuote: string;
    anHead: string;
    anWhy: string;
    anFixLabel: string;
    anFix: string;
  };
  problem: {
    h2: ReactNode;
    paras: ReactNode[];
  };
  flow: {
    h2: string;
    steps: { h3: string; p: ReactNode }[];
  };
  sample: {
    eyebrow: string;
    h2: string;
    /** en 에는 「한국어에서 옮겼습니다」 한 마디가 더 붙습니다. 그래서 글자가 아니라 조각입니다. */
    note: ReactNode;
    reportMeta: string;
    reportTitle: string;
    reportTitleMasked: string;
    scores: { label: string; n: number; verdict: string }[];
    scoresNote: ReactNode;
    findingHead: string;
    findingWhy: string;
    findingQuote: string;
    findingFixLabel: string;
    findingFix: string;
    tail: ReactNode;
  };
  trend: {
    h2: string;
    lede: string;
    cards: { label: string; line: ReactNode; sub: string }[];
  };
  assure: {
    h2: string;
    faq: { q: string; a: ReactNode }[];
  };
  /**
   * 가격만 말마다 **모양이 다릅니다.**
   *
   * 한국어만 표가 있고 나머지 셋은 문장 하나입니다. 지어낸 것이 아니라
   * `en/index.html` 주석에 적힌 결정입니다 — *「없는 가격을 지어 적는 것은
   * 이 서비스가 하지 않기로 한 일이고, 원화를 환율로 옮기는 것도 틀립니다.」*
   *
   * 그래서 낱말 표로는 못 담고 갈래로 둡니다. 이러면 **en 에 실수로 원화표를
   * 붙이는 일이 타입에서 막힙니다.**
   */
  pricing: { h2: string } & (
    | { kind: 'plans'; note: string; plans: Plan[] }
    | { kind: 'note'; note: ReactNode }
  );
  apply: {
    eyebrow: string;
    h2: string;
    ledes: ReactNode[];
    form: FormStrings;
    statusNote: ReactNode;
  };
  foot: {
    desc: string;
    fine: ReactNode;
    privacy: string;
    terms: string;
  };
};

export type Plan = {
  name: string;
  price: string;
  unit: string;
  featured?: string;
  items: ReactNode[];
};

/**
 * 신청 폼의 말.
 *
 * 지금은 이름표가 HTML 에, 오류 안내는 `assets/app.js` 의 `L10N` 에,
 * 메일 문안은 `functions/apply.js` 의 `L10N` 에 — **세 곳에 흩어져**
 * 있습니다. 화면 쪽 둘을 여기서 합칩니다.
 */
export type FormStrings = {
  name: string;
  namePlaceholder: string;
  church: string;
  churchPlaceholder: string;
  contact: string;
  contactPlaceholder: string;
  contactHint: string;
  link: string;
  linkPlaceholder: string;
  linkHint: string;
  goal: string;
  goalPlaceholder: string;
  goalHint: string;
  optional: string;
  trapLabel: string;
  submit: string;
  /** 아래 일곱은 `assets/app.js` 의 `L10N` 에서 한 글자도 안 바꾸고 옮긴 것입니다. */
  fillMarked: string;
  needEmail: string;
  sending: string;
  received: string;
  checkInput: string;
  humanFailed: string;
  mailFallback: string;
  /**
   * 메일 제목. **함수가 아니라 `{name}` 자리를 둔 글자입니다.**
   *
   * 옛 `app.js` 는 함수였는데, 그리는 쪽(서버)에서 폼(브라우저)으로 함수를
   * 건네줄 수 없습니다. 자리표시자면 번역하시는 분도 함수를 안 써도 됩니다.
   * **자리가 빠지면 성함 없는 제목이 조용히 나가므로 검사가 봅니다.**
   */
  mailSubject: string;
  mailName: string;
  mailChurch: string;
  mailEmail: string;
  mailLink: string;
  mailGoal: string;
};
