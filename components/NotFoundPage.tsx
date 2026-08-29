import { LOCALES } from '@/content/routes';
import { NOT_FOUND } from '@/content/notfound';

/**
 * 없는 주소. 옛 `404.html` 을 그대로 옮겼습니다.
 *
 * 말을 고르는 스크립트가 **인라인**인 것은 일부러입니다 — 번들을 기다리는
 * 동안 한국어가 잠깐 보였다 바뀌면 그것대로 이상합니다.
 */
const PICK = `(function(){try{
  var code=(navigator.language||'ko').slice(0,2).toLowerCase();
  var langs=['ko','en','es','pt'];
  var pick=langs.indexOf(code)>=0?code:'en';
  if(pick==='ko')return;
  document.documentElement.lang=pick;
  var all=document.querySelectorAll('[data-i18n]');
  for(var i=0;i<all.length;i++){all[i].hidden=all[i].getAttribute('lang')!==pick;}
}catch(e){}})();`;

export function NotFoundPage() {
  return (
    <>
      <main id="top">
        <section className="hero">
          <div className="wrap narrow">
            <p className="eyebrow">
              <span className="mark">✎</span> Preaching Lab
            </p>

            {/* 네 말을 다 적어 두고 보이는 것 하나만 남깁니다. 자바스크립트가
                꺼져 있어도 한국어는 보입니다. */}
            {LOCALES.map((l) => (
              <h1 key={l} data-i18n="title" lang={l} hidden={l !== 'ko'}>
                {NOT_FOUND[l].title}
              </h1>
            ))}

            {LOCALES.map((l) => (
              <p key={l} className="lede" data-i18n="body" lang={l} hidden={l !== 'ko'}>
                {NOT_FOUND[l].body[0]}
                <br />
                {NOT_FOUND[l].body[1]}
              </p>
            ))}

            <p>
              {LOCALES.map((l) => (
                <a key={l} className="btn btn-solid" data-i18n="cta" lang={l} href={NOT_FOUND[l].href} hidden={l !== 'ko'}>
                  {NOT_FOUND[l].cta}
                </a>
              ))}
            </p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <p className="f-mark">
            <span className="mark">✎</span> Preaching Lab
          </p>
        </div>
      </footer>
      <script dangerouslySetInnerHTML={{ __html: PICK }} />
    </>
  );
}
