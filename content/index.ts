import type { Landing } from './types';
import type { Locale } from './routes';
import { en } from './en';
import { es } from './es';
import { ko } from './ko';
import { pt } from './pt';

/**
 * 옮겨진 말들. **여기 있는 것만 페이지가 만들어집니다.**
 *
 * 옮기는 중에 빈 껍데기를 내보내지 않기 위해서입니다. 지어낸 자료로
 * 채워 두면 검사는 통과하는데 실물은 비어 있게 됩니다 — 그 함정이
 * 이 저장소에 이미 한 번 있었습니다.
 */
export const LANDING: Partial<Record<Locale, Landing>> = { ko, en, es, pt };

export function hasLanding(locale: Locale): boolean {
  return LANDING[locale] !== undefined;
}
