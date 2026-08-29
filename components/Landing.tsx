import type { CSSProperties } from 'react';
import type { Landing as LandingContent } from '@/content/types';
import { DEFAULT_LOCALE, HAS_PAGE, LOCALES, LOCALE_META, href, legalHref, type Locale } from '@/content/routes';
import { ApplyForm } from './ApplyForm';

/** 나타나는 차례. 원본 HTML 의 `style="--d:.06s"` 를 그대로 씁니다. */
const d = (v: string): CSSProperties => ({ '--d': v }) as CSSProperties;

/** 점수 막대. 옛 페이지는 이걸 자바스크립트로 그렸는데, 여기서는 그냥 그립니다. */
function Pips({ n }: { n: number }) {
  return (
    <i className="pips" data-n={n}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'on' : undefined} />
      ))}
    </i>
  );
}


/**
 * 방침·약관 링크. **그 말에 없으면 영어로 가고, 그 사실을 표시합니다.**
 *
 * `hreflang`·`lang` 을 다는 것은 꾸밈이 아닙니다 — 스크린리더가 그 자리에서
 * 말을 바꿔 읽고, 검색엔진도 남의 말 문서로 압니다. es·pt 페이지가 이미
 * 그렇게 하고 있었습니다.
 */
function LegalLink({ locale, kind, label }: { locale: Locale; kind: 'privacy' | 'terms'; label: string }) {
  const own = HAS_PAGE[locale][kind];
  const to = own ? locale : 'en';
  return (
    <a
      href={legalHref(locale, kind)}
      hrefLang={own ? undefined : LOCALE_META[to].lang}
      lang={own ? undefined : LOCALE_META[to].lang}
    >
      {label}
    </a>
  );
}

/** 푸터에 함께 걸 다른 말들. 자기 말과 겹치는 것은 빠집니다. */
function otherLangs(locale: Locale): Locale[] {
  const out: Locale[] = [];
  // 방침이 남의 말로 갔다면 그 말의 랜딩도 함께 안내합니다.
  if (!HAS_PAGE[locale].privacy && locale !== 'en') out.push('en');
  if (locale !== DEFAULT_LOCALE) out.push(DEFAULT_LOCALE);
  return out;
}

export function Landing({ c, locale }: { c: LandingContent; locale: Locale }) {
  return (
    <>
      <header className="topbar">
        <a className="wordmark" href="#top">
          <span className="mark">✎</span>
          <span>Preaching&nbsp;Lab</span>
        </a>
        {/* 네 말이 서로를 가리킵니다. **자기 말은 링크가 아니라 글자입니다.** */}
        <nav className="langs" aria-label={c.nav.langLabel}>
          {LOCALES.map((l) =>
            l === locale ? (
              <span key={l} lang={LOCALE_META[l].lang}>
                {LOCALE_META[l].name}
              </span>
            ) : (
              <a key={l} href={href(l, 'landing')} hrefLang={LOCALE_META[l].lang} lang={LOCALE_META[l].lang}>
                {LOCALE_META[l].name}
              </a>
            ),
          )}
        </nav>
        {/* 오른쪽 끝. **두 종류의 손님이 옵니다** — 처음 오신 분과, 이미
            쓰고 계신 분. 앞엣분께는 신청을, 뒤엣분께는 들어가는 문을
            드립니다. 조용한 쪽(`btn-quiet`)이 「내 리포트」인 것은, 랜딩이
            아직 처음 오신 분을 향한 화면이기 때문입니다. */}
        <div className="topbar-end">
          <a className="btn btn-quiet" href="/my">
            {c.nav.mine}
          </a>
          {c.nav.apply ? (
            <a className="btn btn-ghost" href="#apply">
              {c.nav.apply}
            </a>
          ) : null}
        </div>
      </header>

      <main id="top">
        {/* Hero — 설교 원고 한 대목과, 그 여백에 붙는 주석.
            제품이 하는 일을 제품의 재료로 보여준다. */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow reveal">{c.hero.eyebrow}</p>
              <h1 className="reveal" style={d('.06s')}>
                {c.hero.h1}
              </h1>
              <p className="lede reveal" style={d('.12s')}>
                {c.hero.lede}
              </p>
              <p className="lede-note reveal" style={d('.15s')}>
                {c.hero.ledeNote}
              </p>
              <div className="hero-actions reveal" style={d('.18s')}>
                <a className="btn btn-solid" href="#apply">
                  {c.hero.ctaPrimary}
                </a>
                <a className="btn btn-quiet" href="#sample">
                  {c.hero.ctaSecondary}
                </a>
              </div>
            </div>

            {/* 시그니처: 원고와 그 여백에 붙는 주석 */}
            <figure className="specimen">
              <blockquote className="manuscript reveal" style={d('.3s')}>
                <span className="ms-label">{c.hero.specimenLabel}</span>
                <p>{c.hero.specimenQuote}</p>
              </blockquote>

              <svg className="tether" viewBox="0 0 60 54" aria-hidden="true">
                <path d="M14 2 C 14 26, 30 24, 46 50" fill="none" />
              </svg>

              <div className="annotation reveal" style={d('.66s')}>
                <p className="an-head">
                  <span className="pen">✎</span> {c.hero.anHead}
                </p>
                <p className="an-why">{c.hero.anWhy}</p>
                <p className="an-fix">
                  <b>{c.hero.anFixLabel}</b> — {c.hero.anFix}
                </p>
              </div>
            </figure>
          </div>
        </section>

        <section className="section problem">
          <div className="wrap narrow">
            <h2 className="reveal">{c.problem.h2}</h2>
            <div className="cols">
              {c.problem.paras.map((p, i) => (
                <p key={i} className="reveal" style={i === 0 ? undefined : d(`.${(i + 1) * 6}s`)}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="section flow">
          <div className="wrap">
            <h2 className="reveal">{c.flow.h2}</h2>
            <ol className="steps">
              {c.flow.steps.map((s, i) => (
                <li key={i} className="reveal" style={i === 0 ? undefined : d(`.${i * 8}s`)}>
                  <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.h3}</h3>
                  <p>{s.p}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section sample" id="sample">
          <div className="wrap">
            <p className="eyebrow reveal">{c.sample.eyebrow}</p>
            <h2 className="reveal" style={d('.06s')}>
              {c.sample.h2}
            </h2>
            <p className="note reveal" style={d('.1s')}>
              {c.sample.note}
            </p>

            <article className="report reveal" style={d('.14s')}>
              <header className="report-head">
                <p className="rh-meta">{c.sample.reportMeta}</p>
                <h3 className="masked">
                  {c.sample.reportTitle} <span>{c.sample.reportTitleMasked}</span>
                </h3>
              </header>

              <div className="scores">
                {c.sample.scores.map((s) => (
                  <div key={s.label} className="score">
                    <span>{s.label}</span>
                    <b data-n={s.n}>{s.n}</b>
                    <Pips n={s.n} />
                    <em>{s.verdict}</em>
                  </div>
                ))}
              </div>
              <p className="scores-note">{c.sample.scoresNote}</p>

              <div className="finding">
                <p className="f-head">{c.sample.findingHead}</p>
                <p className="f-why">{c.sample.findingWhy}</p>
                <blockquote className="f-quote">{c.sample.findingQuote}</blockquote>
                <p className="f-fix">
                  <b>{c.sample.findingFixLabel}</b> — {c.sample.findingFix}
                </p>
              </div>
            </article>

            <p className="sample-tail reveal">{c.sample.tail}</p>
          </div>
        </section>

        <section className="section trend">
          <div className="wrap">
            <h2 className="reveal">{c.trend.h2}</h2>
            <p className="lede narrow reveal" style={d('.06s')}>
              {c.trend.lede}
            </p>
            <div className="trend-grid">
              {c.trend.cards.map((t, i) => (
                <div key={t.label} className="tcard reveal" style={i === 0 ? undefined : d(`.${i * 8}s`)}>
                  <p className="t-label">{t.label}</p>
                  <p className="t-line">{t.line}</p>
                  <p className="t-sub">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section assure">
          <div className="wrap narrow">
            <h2 className="reveal">{c.assure.h2}</h2>
            <dl className="faq">
              {c.assure.faq.map((f) => (
                <div key={f.q} className="reveal">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section pricing">
          <div className="wrap">
            <h2 className="reveal">{c.pricing.h2}</h2>
            {c.pricing.kind === 'plans' ? (
              <>
                <p className="note reveal" style={d('.06s')}>
                  {c.pricing.note}
                </p>
                <div className="plans">
                  {c.pricing.plans.map((p, i) => (
                    <div
                      key={p.name}
                      className={`plan${p.featured ? ' featured' : ''} reveal`}
                      style={i === 0 ? undefined : d(`.${i * 8}s`)}
                    >
                      {p.featured ? <p className="p-tag">{p.featured}</p> : null}
                      <p className="p-name">{p.name}</p>
                      <p className="p-price">
                        <b>{p.price}</b>
                        <span>{p.unit}</span>
                      </p>
                      <ul>
                        {p.items.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* **숫자를 적지 않습니다.** 한국조차 아직 시범 기간이고 유료 사용자가
                 없습니다. 없는 가격을 지어 적는 것은 이 서비스가 하지 않기로 한
                 종류의 일이고, 원화를 환율로 옮기는 것도 틀립니다.
                 이 문장은 앱 설정 화면(`settings.priceNote`)과 한 글자도 같습니다. */
              <p className="lede narrow reveal" style={d('.06s')}>
                {c.pricing.note}
              </p>
            )}
          </div>
        </section>

        <section className="section apply" id="apply">
          <div className="wrap narrow">
            <p className="eyebrow reveal">{c.apply.eyebrow}</p>
            <h2 className="reveal" style={d('.06s')}>
              {c.apply.h2}
            </h2>
            {c.apply.ledes.map((l, i) => (
              <p key={i} className="lede reveal" style={d(i === 0 ? '.1s' : '.12s')}>
                {l}
              </p>
            ))}

            <ApplyForm t={c.apply.form} locale={locale} note={c.apply.statusNote} />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <p className="f-mark">
            <span className="mark">✎</span> Preaching Lab
          </p>
          <p className="f-desc">{c.foot.desc}</p>
          <p className="f-fine">{c.foot.fine}</p>
          <p className="f-fine">
            <LegalLink locale={locale} kind="privacy" label={c.foot.privacy} />
            {' · '}
            <LegalLink locale={locale} kind="terms" label={c.foot.terms} />
            {/* 그 뒤에 다른 말로 가는 길. **자기 말은 안 넣습니다.**
                방침이 남의 말로 가면 그 말도 함께 안내합니다 — es·pt 페이지가
                방침은 영어로 보내면서 영어 랜딩도 함께 걸어 두고 있었습니다. */}
            {otherLangs(locale).map((l) => (
              <span key={l}>
                {' · '}
                <a href={href(l, 'landing')} hrefLang={LOCALE_META[l].lang} lang={LOCALE_META[l].lang}>
                  {LOCALE_META[l].name}
                </a>
              </span>
            ))}
          </p>
        </div>
      </footer>
    </>
  );
}
