/** Avatars et couleurs proposés à la création d'un joueur. */
export const AVATARS: string[] = [
  '⚽', '🧤', '🏆', '🥅', '🎯', '🔥', '⚡', '💎', '👑', '🚀',
  '🦁', '🐺', '🦅', '🐐', '🐍', '🦈', '🐯', '🦊', '🐻', '🦍',
  '🕶️', '🎩', '🧢', '🎭', '🃏', '🎲', '🧠', '💣', '🛡️', '🗿',
];

export const COLORS: string[] = [
  '#FF2B2B', // rouge signature
  '#FF7A1A', // orange
  '#FFC21A', // or
  '#37D67A', // vert
  '#1AC8ED', // cyan
  '#3B7BFF', // bleu
  '#8B5CF6', // violet
  '#F43F8E', // rose
  '#A3E635', // lime
  '#F5F5F5', // blanc
];

export function randomAvatar(exclude: readonly string[] = []): string {
  const pool = AVATARS.filter((a) => !exclude.includes(a));
  const list = pool.length > 0 ? pool : AVATARS;
  return list[Math.floor(Math.random() * list.length)];
}

/** Couleur par défaut d'un nouveau joueur : le rouge signature (modifiable dans sa fiche). */
export const DEFAULT_COLOR = COLORS[0];

export function randomColor(exclude: readonly string[] = []): string {
  const pool = COLORS.filter((c) => !exclude.includes(c));
  const list = pool.length > 0 ? pool : COLORS;
  return list[Math.floor(Math.random() * list.length)];
}
