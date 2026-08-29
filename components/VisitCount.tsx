'use client';

import { useEffect } from 'react';

/**
 * 몇 분이나 오시는지 한 번 알립니다. `assets/app.js` 에서 그대로 옮겼습니다.
 *
 * **외부 분석 도구를 쓰지 않습니다.** 구글 애널리틱스를 넣는 순간 목사님이
 * 이 페이지를 봤다는 사실이 광고 회사로 갑니다. 설교를 맡아 두는 서비스가
 * 할 일이 아닙니다.
 *
 * `no-cors` 라 응답을 읽지 못하고, 실패해도 아무 일도 일어나지 않습니다.
 */
const COUNT_AT = 'https://my.preachinglab.cloud/v';

export function countVisit(path: string) {
  try {
    const u = new URL(COUNT_AT);
    u.searchParams.set('p', path);
    if (document.referrer) u.searchParams.set('r', document.referrer);
    fetch(u, { mode: 'no-cors', credentials: 'omit', keepalive: true }).catch(() => {});
  } catch {
    /* 세지 못해도 그만입니다 */
  }
}

export function VisitCount() {
  useEffect(() => {
    countVisit(location.pathname.replace(/\.html$/, '') || '/');
  }, []);
  return null;
}
