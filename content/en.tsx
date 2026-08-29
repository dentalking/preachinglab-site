import type { Landing } from './types';

/**
 * 영어 랜딩. `site/en/index.html` 에서 한 글자도 바꾸지 않고 옮겼습니다.
 *
 * 한국어와 **다른 자리 셋**이 있고 전부 의도된 것입니다 —
 * ① 머리띠에 신청 버튼이 없습니다 ② 가격에 숫자가 없습니다
 * ③ 예시 리포트에 「한국어에서 옮겼습니다」가 붙습니다.
 */
export const en: Landing = {
  meta: {
    title: 'Preaching Lab — How did my sermon land?',
    description:
      'How did my sermon land? Send one video link or recording and we put the sermon into text, then show you structure, interpretation, delivery and application with the words you actually said. You do not need a camera. It is a reflection, not an assessment, and only the preacher sees it.',
    ogTitle: 'Preaching Lab',
    ogDescription: 'How did my sermon land? A reflection report for preachers who want to preach better.',
    ogImageAlt: "How did last Sunday's sermon land? — Preaching Lab",
  },
  nav: { langLabel: 'Language', mine: 'My reports' },
  hero: {
    eyebrow: 'For preachers who want to preach better',
    h1: (
      <>
        How did my
        <br />
        sermon <em>land</em>?
      </>
    ),
    lede: 'You ask yourself that every week on the way down from the pulpit. Send us one link or one recording, and this time an answer comes back — with the words you actually said beside every point.',
    ledeNote:
      'Nobody is grading you and nothing is sent anywhere. You don’t need a camera, and only you ever see the report.',
    ctaPrimary: 'Try it with one sermon',
    ctaSecondary: 'See a real report first ↓',
    specimenLabel: 'From the sermon',
    specimenQuote:
      '“And so we must always stay humble. The place where I was blessed yesterday can be the place where I am tested today.”',
    anHead: 'Give this insight one action to stand on',
    anWhy:
      'Humility is a state of the heart, so nothing is left to do the moment they walk out of the building. This is the sharpest insight in the sermon, and it closes the most vaguely.',
    anFixLabel: 'Try it this way',
    anFix:
      '“Do one thing this week. Write down the one thing you believe you are better at than others. That is where you will stumble.”',
  },
  problem: {
    h2: (
      <>
        You can preach for twenty years
        <br />
        and never get feedback
      </>
    ),
    paras: [
      'What people say after the service usually stops at “I was blessed.” It is kind, and it tells you nothing about what to do differently next week.',
      "Asking a fellow pastor is no easier. There is no room in any presbytery or association where you weigh each other's pulpits.",
      <>
        So most preachers look back on their own preaching <b>through memory alone</b>. Memory keeps the parts that went
        well.
      </>,
    ],
  },
  flow: {
    h2: 'All you do is send the sermon',
    steps: [
      {
        h3: 'Send a video or a recording from the app',
        p: "A YouTube link works, or you can record right there in the app. You can send the whole service — we find the sermon inside it. Register your church's YouTube channel and the app will spot new sermons and ask you first.",
      },
      {
        h3: 'We put the sermon into text',
        p: 'Register your church name, your own name, and the biblical names you use often, and there is less to misread.',
      },
      {
        h3: 'The app tells you before the next morning',
        p: (
          <>
            Scores, the sermon outline, feedback area by area, and something to work on for the next one. For paper, take
            it as an <b>A4 file with page numbers</b>; you can also read it on a computer&apos;s larger screen.
          </>
        ),
      },
    ],
  },
  sample: {
    eyebrow: 'From an actual report',
    h2: 'This is what arrives',
    note: (
      <>
        Taken from a real report for a pastor using Preaching Lab, and <b>translated from Korean</b> — the service, the
        church and the preacher are Korean-speaking. Church, name, sermon title and passage are hidden.
      </>
    ),
    reportMeta: 'A Wednesday prayer meeting · 47 min',
    reportTitle: 'Sermon title',
    reportTitleMasked: 'withheld',
    scores: [
      { label: 'Structure and the flow of the argument', n: 4, verdict: 'A strength' },
      { label: 'Faithfulness to the biblical text', n: 3, verdict: 'Faithfully delivered' },
      { label: 'Delivery and use of language', n: 3, verdict: 'Faithfully delivered' },
      { label: 'How concrete the application is', n: 2, verdict: 'Worth working on first' },
      { label: 'Imagery and empathy', n: 4, verdict: 'A strength' },
    ],
    scoresNote: (
      <>
        These are not grades. They are a way to choose where to put your effort in the next sermon.{' '}
        <b>The fifth measure is one this pastor chose himself.</b>
      </>
    ),
    findingHead: 'Leave them with one picture as you step down',
    findingWhy:
      'Earlier you gave the congregation several scenes they could see with their eyes, but the conclusion ends in abstractions. People carry out what they heard last.',
    findingQuote:
      '“My experience, my testimony — these are not the standard of my life. I believe it is the word of God that is the rock building us up.”',
    findingFixLabel: 'Try it this way',
    findingFix:
      'bring back one of the pictures you already used. You do not need a new image. Just return one of the scenes you have already shown them to the conclusion.',
    tail: (
      <>
        Every point comes with <b>a quotation from the sermon itself</b>. We do not write anything we cannot ground. And
        what we suggest instead is <b>a sentence you could use from the pulpit as it stands</b>.
      </>
    ),
  },
  trend: {
    h2: 'What one sermon cannot show',
    lede: 'Once the reports start stacking up, things surface that a single sermon will never reveal. That is what this is actually for.',
    cards: [
      {
        label: 'Scores over time',
        line: (
          <>
            <span>How concrete the application is</span> <span className="t-vals">2 → 3 → 4</span>
          </>
        ),
        sub: 'What changed across eight weeks',
      },
      {
        label: 'A note that keeps returning',
        line: (
          <>
            <b>Three in a row</b> — the conclusion ends in abstractions
          </>
        ),
        sub: 'What you have fixed, kept apart from what is still there',
      },
      {
        label: 'Speaking measures',
        line: (
          <>
            “now” <span className="t-vals">32 → 11</span>
          </>
        ),
        sub: 'Counted, not judged',
      },
    ],
  },
  assure: {
    h2: 'Things worth saying first',
    faq: [
      {
        q: 'Who can see this report?',
        a: (
          <>
            <b>Only the preacher.</b> Not the church, not the board, not us. Even where a church holds the contract, it
            is built so that a senior pastor or an administrator cannot open an individual minister&apos;s report.
            Showing it to someone happens only when the preacher does it.
          </>
        ),
      },
      {
        q: 'I am uneasy about AI assessing a sermon.',
        a: 'It is a reflection, not an assessment. We make no theological judgements. Where traditions differ we do not declare one side correct; we only show how firmly the point stands on the text. The final discernment always belongs to the one in the pulpit.',
      },
      {
        q: 'What happens to the transcript of my sermon?',
        a: "It is not used for training. You decide how long it is kept, and we delete it at once if you ask. We consider a sermon to be the preacher's own work.",
      },
      {
        q: 'Our church does not film the service.',
        a: (
          <>
            <b>A recording is enough.</b> A voice memo from a phone will do. Where you record does decide the result,
            though. A feed from the sound desk, or a recorder near the pulpit, is the most accurate; a phone left at the
            back picks up reverberation and the noise of the congregation, and the recognition blurs. Sitting near the
            front is enough.
          </>
        ),
      },
      {
        q: 'Is it accurate?',
        a: 'It is speech recognition, so there will be mistakes in the text. That is why it is built not to fault the preacher for a recognition error, and why every point carries a quotation you can check yourself. One wrong point and the whole report stops being believable.',
      },
    ],
  },
  pricing: {
    h2: 'Pricing',
    kind: 'note',
    note: 'This is a pilot period, so it is free. If we begin charging we will tell you beforehand, and nothing is billed until then.',
  },
  apply: {
    eyebrow: 'Try it with one sermon',
    h2: 'Shall we look at one of yours?',
    ledes: [
      'Tell us where to write, and we will send you what you need to install the app. Your first report is on us.',
      <>
        Today it runs on <b>Android</b>. iPhone is not ready yet; if you leave your address we will tell you as soon as
        it is.
      </>,
    ],
    form: {
      name: 'Your name',
      namePlaceholder: 'Rev. Jane Doe',
      church: 'Church',
      churchPlaceholder: 'Grace Community Church',
      contact: 'Email',
      contactPlaceholder: 'pastor@example.com',
      contactHint: 'We send the app instructions to this address. You read the reports in the app.',
      link: 'Link to a sermon video or recording',
      linkPlaceholder: 'https://youtu.be/… or a shared drive link',
      linkHint:
        'If there is a sermon you would like us to start with, put it here. A YouTube address is enough. You can also leave it empty — install the app and send one from there.',
      goal: 'The preaching you are aiming at, if you have it in words',
      goalPlaceholder: 'e.g. plain enough for anyone to follow, unstiff, and easy to picture',
      goalHint: 'Write it here and we add it to the report as a measure of its own.',
      optional: 'optional',
      trapLabel: 'Website',
      submit: 'Send me the details',
      fillMarked: 'Please fill in the marked fields.',
      needEmail: 'Please give the email address where you will receive the report.',
      sending: 'Sending…',
      received: 'We have your request. We will write back within a day.',
      checkInput: 'Please check what you entered.',
      humanFailed: 'The human check did not pass. Please wait a moment and press again.',
      mailFallback: 'That did not send, so we are opening your mail app instead.',
      mailSubject: '[Application] {name}',
      mailName: 'Name',
      mailChurch: 'Church',
      mailEmail: 'Email',
      mailLink: 'Sermon video',
      mailGoal: 'The preaching they are aiming at',
    },
    statusNote: (
      <>
        Pressing this sends it straight to us. No mail app will open. If you would rather write to us directly,{' '}
        <a href="mailto:hello@preachinglab.cloud">hello@preachinglab.cloud</a>.
      </>
    ),
  },
  foot: {
    desc: 'We help you put a sermon into text and look back at it. We do not grade it.',
    fine: (
      <>
        A report is a reference opinion produced by speech recognition and AI analysis. It is a starting point for
        conversation, not grounds for judgement. · <a href="mailto:hello@preachinglab.cloud">hello@preachinglab.cloud</a>
      </>
    ),
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
};
