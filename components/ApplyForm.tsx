'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { FormStrings } from '@/content/types';
import { countVisit } from './VisitCount';

const CONTACT_EMAIL = 'hello@preachinglab.cloud';
const TURNSTILE_SITEKEY = '0x4AAAAAAEI8vrcA5igHQyM3';

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

/**
 * 파일럿 신청 폼. `assets/app.js` 의 제출 흐름을 그대로 옮겼습니다.
 *
 * **말을 `<html lang>` 에서 읽지 않습니다.** 옛 코드는 그렇게 했고 그것이
 * 그때는 옳았습니다(페이지마다 숨은 칸을 두는 것보다 어긋날 자리가 적습니다).
 * 지금은 **어느 말인지 그리는 쪽이 이미 알고 있어서** 그냥 받습니다 —
 * 읽을 일이 없으면 어긋날 일도 없습니다.
 *
 * 보내는 곳은 그대로 `/apply` 입니다. Cloudflare Pages Function 은
 * 정적 내보내기 옆에 그대로 삽니다.
 */
export function ApplyForm({ t, locale, note }: { t: FormStrings; locale: string; note: ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{ kind: string; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const val = (name: string) =>
    (formRef.current?.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? '';

  const field = (name: string) =>
    formRef.current?.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  const say = (kind: string, text: string) => setStatus({ kind, text });

  /** 서버가 안 될 때 쓰는 예전 경로. 메일 앱에 내용을 채워 엽니다. */
  function mailtoFallback() {
    const lines = [
      `${t.mailName}: ${val('name')}`,
      `${t.mailChurch}: ${val('church') || '-'}`,
      `${t.mailEmail}: ${val('contact')}`,
      `${t.mailLink}: ${val('link') || '-'}`,
      '',
      `${t.mailGoal}:`,
      val('goal') || '-',
    ];
    location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(t.mailSubject.replace('{name}', val('name')))}` +
      `&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    for (const name of ['name', 'contact']) {
      const el = field(name);
      if (el && !el.value.trim()) {
        el.focus();
        el.setAttribute('aria-invalid', 'true');
        say('bad', t.fillMarked);
        return;
      }
      el?.removeAttribute('aria-invalid');
    }

    // 이메일이 아니면 접수 확인도 답장도 보낼 수 없습니다. 실제로 휴대폰 번호만
    // 적고 신청하신 분들이 아무 연락도 못 받은 채 기다리신 적이 있습니다.
    const contactEl = field('contact');
    if (contactEl && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactEl.value.trim())) {
      contactEl.focus();
      contactEl.setAttribute('aria-invalid', 'true');
      say('bad', t.needEmail);
      return;
    }
    contactEl?.removeAttribute('aria-invalid');

    setBusy(true);
    say('busy', t.sending);

    try {
      const res = await fetch('/apply', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: val('name'),
          church: val('church'),
          contact: val('contact'),
          link: val('link'),
          goal: val('goal'),
          website: val('website'), // 사람에게는 안 보이는 칸 — 봇 거르기
          turnstile:
            (document.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement | null)?.value ?? '',
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));

      // 토큰은 한 번 쓰면 끝입니다. 성공이든 실패든 새로 받아야 다시 누를 수 있습니다.
      window.turnstile?.reset();

      if (res.ok && data.ok) {
        formRef.current?.querySelectorAll('input, textarea').forEach((el) => {
          (el as HTMLInputElement).value = '';
        });
        // 방문과 신청을 나란히 놓아야 "와서 안 누르는 것" 이 보입니다.
        countVisit('/apply-done');
        say('good', t.received);
        setBusy(false);
        return;
      }

      if (res.status === 400 && data.field) {
        const el = field(data.field);
        el?.focus();
        el?.setAttribute('aria-invalid', 'true');
        say('bad', data.error ?? t.checkInput);
        setBusy(false);
        return;
      }

      // 사람 확인 실패. 메일 앱으로 밀지 않습니다 — 봇이면 그쪽도 막아야 하고,
      // 사람이면 잠깐 뒤 다시 누르는 것으로 대개 통과합니다.
      if (res.status === 403) {
        say('bad', data.error ?? t.humanFailed);
        setBusy(false);
        return;
      }

      throw new Error(data.error ?? `HTTP ${res.status}`);
    } catch {
      window.turnstile?.reset();
      say('bad', t.mailFallback);
      setBusy(false);
      mailtoFallback();
    }
  }

  return (
    <form ref={formRef} id="applyForm" className="apply-form reveal" style={{ '--d': '.16s' } as React.CSSProperties} onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">{t.name}</label>
        <input id="f-name" name="name" type="text" autoComplete="name" placeholder={t.namePlaceholder} required />
      </div>
      <div className="field">
        <label htmlFor="f-church">{t.church}</label>
        <input id="f-church" name="church" type="text" autoComplete="organization" placeholder={t.churchPlaceholder} />
      </div>
      <div className="field">
        <label htmlFor="f-contact">{t.contact}</label>
        <input
          id="f-contact"
          name="contact"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t.contactPlaceholder}
          required
        />
        <p className="hint">{t.contactHint}</p>
      </div>
      <div className="field">
        <label htmlFor="f-link">
          {t.link} <span className="opt">{t.optional}</span>
        </label>
        <input id="f-link" name="link" type="text" placeholder={t.linkPlaceholder} inputMode="url" />
        <p className="hint">{t.linkHint}</p>
      </div>
      <div className="field">
        <label htmlFor="f-goal">
          {t.goal} <span className="opt">{t.optional}</span>
        </label>
        <textarea id="f-goal" name="goal" rows={3} placeholder={t.goalPlaceholder} />
        <p className="hint">{t.goalHint}</p>
      </div>
      {/* 봇 거르기. 사람에게는 보이지 않고, 채워져 있으면 조용히 버립니다. */}
      <div className="trap" aria-hidden="true">
        <label htmlFor="f-website">{t.trapLabel}</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {/* 사람 확인. interaction-only 라 평소에는 아무것도 보이지 않고,
          의심스러울 때만 확인 상자가 나타납니다. */}
      <div
        className="cf-turnstile"
        data-sitekey={TURNSTILE_SITEKEY}
        data-appearance="interaction-only"
        data-language={locale}
        data-size="flexible"
        data-theme="light"
      />
      <button className="btn btn-solid btn-block" type="submit" disabled={busy}>
        {t.submit}
      </button>
      <p className={`form-status${status ? ` ${status.kind}` : ''}`} id="applyStatus" role="status" aria-live="polite">
        {status ? status.text : null}
      </p>
      <p className="form-note">{note}</p>
    </form>
  );
}
