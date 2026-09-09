import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { Category, Game, WordLang } from '../game/types';
import { DEFAULT_WEIGHTS } from '../game/engine';
import type { Lang } from '../i18n';

/* ------------------------------------------------------------------ */
/* Modèle persistant                                                   */
/* ------------------------------------------------------------------ */

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  /** Points cumulés sur toutes les parties. */
  points: number;
  wins: number;
  games: number;
  createdAt: number;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  createdAt: number;
  /** Rôles par défaut proposés au lancement (null = réglage conseillé selon l'effectif). */
  undercovers: number | null;
  white: boolean | null;
  /** Créée automatiquement au lancement d'une partie (nom généré à partir des prénoms). */
  auto: boolean;
}

/** Même effectif, quel que soit l'ordre ? */
export function sameRoster(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((id) => set.has(id));
}

export function findTeamByRoster(teams: readonly Team[], ids: readonly string[]): Team | undefined {
  return teams.find((t) => sameRoster(t.playerIds, ids));
}

/** Nom par défaut d'une nouvelle équipe : TEAM 1, TEAM 2… (le premier numéro libre). */
export function nextTeamName(teams: readonly Team[]): string {
  const used = new Set(
    teams.map((t) => {
      const m = /^TEAM\s+(\d+)$/i.exec(t.name.trim());
      return m ? Number(m[1]) : 0;
    }),
  );
  let n = 1;
  while (used.has(n)) n++;
  return `TEAM ${n}`;
}

export interface Settings {
  /** Version Pro (sans pub, plus de mots). Bascule de test tant que la boutique n'existe pas. */
  premium: boolean;
  haptics: boolean;
  /** Affiche la catégorie sur la carte des titulaires / undercovers. */
  showCategory: boolean;
  /** Le carton blanc voit aussi la catégorie. */
  whiteSeesCategory: boolean;
  /** Le carton blanc peut être le premier à parler (par défaut : jamais). */
  whiteCanStart: boolean;
  /** Durée du chrono de discussion, 0 = pas de chrono. */
  timerSeconds: number;
  /** Curseurs par catégorie (poids relatifs, 0 = jamais). */
  weights: Record<Category, number>;
  /** Langue des menus. */
  uiLang: Lang;
  /** Langue des mots secrets (indépendante des menus). */
  wordLang: WordLang;
  /** Mode créateur 🎥 : filme la partie et incruste mots, votes et éliminations dans la vidéo. */
  creatorMode: boolean;
}

export interface LastSetup {
  playerIds: string[];
  teamId: string | null;
  undercovers: number | null;
  mrWhite: boolean | null;
}

export interface AppState {
  version: 1;
  players: Player[];
  teams: Team[];
  settings: Settings;
  /** Points de la soirée en cours (remis à zéro à la demande). */
  session: Record<string, number>;
  recentPairIds: string[];
  lastSetup: LastSetup | null;
  gamesPlayed: number;
  /** Garde-fou : une partie n'est comptée qu'une fois, même si l'écran de résultat est rouvert. */
  lastRecordedGameId: string | null;
}

export const DEFAULT_SETTINGS: Settings = {
  premium: false,
  haptics: true,
  showCategory: true,
  whiteSeesCategory: true,
  whiteCanStart: false,
  timerSeconds: 0,
  weights: { ...DEFAULT_WEIGHTS },
  uiLang: 'fr',
  wordLang: 'fr',
  creatorMode: false,
};

export const INITIAL_STATE: AppState = {
  version: 1,
  players: [],
  teams: [],
  settings: DEFAULT_SETTINGS,
  session: {},
  recentPairIds: [],
  lastSetup: null,
  gamesPlayed: 0,
  lastRecordedGameId: null,
};

const STORAGE_KEY = 'fu.state.v1';
const GAME_KEY = 'fu.game.v1';
const RECENT_LIMIT = 60;

export function uid(prefix = 'id'): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `${prefix}_${c.randomUUID().slice(0, 8)}`;
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/* ------------------------------------------------------------------ */
/* Persistance                                                         */
/* ------------------------------------------------------------------ */

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadState(): AppState {
  try {
    const parsed = safeParse<Partial<AppState>>(localStorage.getItem(STORAGE_KEY));
    if (!parsed || parsed.version !== 1) return INITIAL_STATE;
    const settings = { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) };
    settings.weights = { ...DEFAULT_WEIGHTS, ...(parsed.settings?.weights ?? {}) };
    const players = Array.isArray(parsed.players) ? parsed.players : [];
    const teams: Team[] = Array.isArray(parsed.teams)
      ? parsed.teams.map((t) => ({ ...t, undercovers: t.undercovers ?? null, white: t.white ?? null, auto: t.auto ?? false }))
      : [];
    // Migration : des joueurs mais aucune équipe → on en crée une avec tout le monde.
    if (players.length >= 3 && teams.length === 0) {
      teams.push({
        id: uid('t'),
        name: nextTeamName(teams),
        playerIds: players.map((p) => p.id),
        createdAt: Date.now(),
        undercovers: null,
        white: null,
        auto: true,
      });
    }
    return {
      ...INITIAL_STATE,
      ...parsed,
      settings,
      players,
      teams,
      session: parsed.session ?? {},
      recentPairIds: Array.isArray(parsed.recentPairIds) ? parsed.recentPairIds : [],
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* stockage indisponible (navigation privée) : on joue sans sauvegarde */
  }
}

export function loadGame(): Game | null {
  try {
    const g = safeParse<Game>(localStorage.getItem(GAME_KEY));
    if (!g || !Array.isArray(g.players) || !g.pair) return null;
    return g;
  } catch {
    return null;
  }
}

export function saveGame(game: Game | null): void {
  try {
    if (game) localStorage.setItem(GAME_KEY, JSON.stringify(game));
    else localStorage.removeItem(GAME_KEY);
  } catch {
    /* idem */
  }
}

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

export type Action =
  | { type: 'player/add'; player: Player }
  | { type: 'player/update'; id: string; patch: Partial<Pick<Player, 'name' | 'avatar' | 'color'>> }
  | { type: 'player/remove'; id: string }
  | { type: 'team/add'; team: Team }
  | { type: 'team/update'; id: string; patch: Partial<Pick<Team, 'name' | 'playerIds' | 'undercovers' | 'white' | 'auto'>> }
  | { type: 'team/remove'; id: string }
  | { type: 'settings/set'; patch: Partial<Settings> }
  | { type: 'setup/set'; setup: LastSetup }
  | { type: 'result/record'; game: Game }
  | { type: 'session/reset' }
  | { type: 'all/reset' };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'player/add':
      return { ...state, players: [...state.players, action.player] };
    case 'player/update':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      };
    case 'player/remove': {
      const session = { ...state.session };
      delete session[action.id];
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
        teams: state.teams.map((t) => ({ ...t, playerIds: t.playerIds.filter((id) => id !== action.id) })),
        session,
        lastSetup: state.lastSetup
          ? { ...state.lastSetup, playerIds: state.lastSetup.playerIds.filter((id) => id !== action.id) }
          : null,
      };
    }
    case 'team/add':
      return { ...state, teams: [...state.teams, action.team] };
    case 'team/update':
      return { ...state, teams: state.teams.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)) };
    case 'team/remove':
      return {
        ...state,
        teams: state.teams.filter((t) => t.id !== action.id),
        lastSetup: state.lastSetup?.teamId === action.id ? { ...state.lastSetup, teamId: null } : state.lastSetup,
      };
    case 'settings/set':
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case 'setup/set':
      return { ...state, lastSetup: action.setup };
    case 'result/record': {
      const { game } = action;
      if (!game.result || state.lastRecordedGameId === game.id) return state;
      const points = game.result.points;
      const winners = new Set(game.result.winnerIds);
      const inGame = new Set(game.players.map((p) => p.id));
      const players = state.players.map((p) => {
        if (!inGame.has(p.id)) return p;
        return {
          ...p,
          points: p.points + (points[p.id] ?? 0),
          wins: p.wins + (winners.has(p.id) ? 1 : 0),
          games: p.games + 1,
        };
      });
      const session = { ...state.session };
      Object.entries(points).forEach(([id, pts]) => {
        session[id] = (session[id] ?? 0) + pts;
      });
      const recentPairIds = [game.pair.id, ...state.recentPairIds.filter((id) => id !== game.pair.id)].slice(
        0,
        RECENT_LIMIT,
      );
      return {
        ...state,
        players,
        session,
        recentPairIds,
        gamesPlayed: state.gamesPlayed + 1,
        lastRecordedGameId: game.id,
      };
    }
    case 'session/reset':
      return { ...state, session: {} };
    case 'all/reset':
      return INITIAL_STATE;
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Contexte React                                                      */
/* ------------------------------------------------------------------ */

interface StoreValue {
  state: AppState;
  dispatch: (action: Action) => void;
  addPlayer: (name: string, avatar: string, color: string) => Player;
  addTeam: (name: string, playerIds: string[], undercovers: number | null, white: boolean | null, auto?: boolean) => Team;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      dispatch,
      addPlayer: (name, avatar, color) => {
        const player: Player = {
          id: uid('p'),
          name: name.trim(),
          avatar,
          color,
          points: 0,
          wins: 0,
          games: 0,
          createdAt: Date.now(),
        };
        dispatch({ type: 'player/add', player });
        return player;
      },
      addTeam: (name, playerIds, undercovers, white, auto = false) => {
        const team: Team = {
          id: uid('t'),
          name: name.trim(),
          playerIds,
          createdAt: Date.now(),
          undercovers,
          white,
          auto,
        };
        dispatch({ type: 'team/add', team });
        return team;
      },
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore doit être utilisé sous StoreProvider');
  return ctx;
}
