import { fr, type Strings } from './fr';
import { en } from './en';

export type Lang = 'fr' | 'en';

const DICTS: Record<Lang, Strings> = { fr, en };

let current: Lang = 'fr';

/** Change la langue des menus. Les composants lisent `T` au rendu : un re-rendu suffit. */
export function setLang(lang: Lang): void {
  if (lang === current) return;
  current = lang;
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
}

export function getLang(): Lang {
  return current;
}

/**
 * Dictionnaire courant. Un Proxy pour que `T.home.play` lise toujours la langue active
 * sans que chaque composant ait à s'abonner.
 */
export const T: Strings = new Proxy({} as Strings, {
  get: (_target, key) => DICTS[current][key as keyof Strings],
  ownKeys: () => Reflect.ownKeys(DICTS[current]),
  getOwnPropertyDescriptor: (_target, key) => ({
    enumerable: true,
    configurable: true,
    value: DICTS[current][key as keyof Strings],
  }),
});

export type { Strings };
