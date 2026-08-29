'use client';

import { useEffect } from 'react';

/**
 * 스크롤에 맞춰 나타나는 처리. `assets/app.js` 에 있던 것을 그대로 옮겼습니다.
 *
 * 움직임을 줄이라고 설정하신 분과 `IntersectionObserver` 가 없는 브라우저에는
 * **처음부터 다 보이게** 합니다. 이 갈래가 없으면 그런 분께는 페이지가
 * 통째로 빈 화면입니다.
 */
export function Reveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
