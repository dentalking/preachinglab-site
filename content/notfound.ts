import type { Locale } from './routes';

/**
 * 없는 주소에 뜨는 말.
 *
 * **네 말을 다 내보내고 브라우저가 하나만 남깁니다.** 정적 파일이라 서버가
 * 말을 고를 수 없고, 자바스크립트가 꺼져 있어도 무언가는 보여야 하기
 * 때문입니다. 옛 `404.html` 이 하던 그대로입니다.
 */
export const NOT_FOUND: Record<Locale, { title: string; body: [string, string]; cta: string; href: string }> = {
  ko: {
    title: '여기에는 아무것도 없습니다',
    body: ['주소가 잘못 적혔거나, 옮겨진 쪽입니다.', '아래로 가시면 처음 화면이 열립니다.'],
    cta: '처음으로',
    href: '/',
  },
  en: {
    title: 'There is nothing here',
    body: ['The address may be mistyped, or the page has moved.', 'The link below opens the first page.'],
    cta: 'Go to the start',
    href: '/en/',
  },
  es: {
    title: 'Aquí no hay nada',
    body: [
      'Puede que la dirección esté mal escrita, o que la página se haya movido.',
      'El enlace de abajo abre la primera página.',
    ],
    cta: 'Ir al inicio',
    href: '/es/',
  },
  pt: {
    title: 'Aqui não há nada',
    body: ['O endereço pode estar errado, ou a página foi movida.', 'O link abaixo abre a primeira página.'],
    cta: 'Ir para o início',
    href: '/pt/',
  },
};
