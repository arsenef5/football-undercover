import type { Category } from '../../game/types';

/** Un mot : identique dans les deux langues, ou [français, anglais]. */
export type Entry = string | [string, string];

export interface GroupDef {
  cat: Category;
  words: Entry[];
}
