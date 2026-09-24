import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  backToDiscussion,
  createGame,
  eliminate,
  goToVote,
  reorderSeats,
  resolveWhiteGuess,
  revealNext,
  type CreateGameOptions,
} from './engine';
import type { Game, GameConfig, Seat, WordGroup } from './types';
import { isPro, loadGame, saveGame, useStore } from '../store/store';

interface GameValue {
  game: Game | null;
  start: (seats: Seat[], cfg: GameConfig, groups: readonly WordGroup[], opts?: CreateGameOptions) => Game;
  revealNext: () => void;
  goToVote: () => void;
  backToDiscussion: () => void;
  eliminate: (playerId: string) => Game | null;
  resolveWhite: (guess: string, correct: boolean) => Game | null;
  reorder: (ids: string[]) => void;
  /** Photo d'un joueur mise à jour pendant la partie (écran Réalisation). */
  setPhoto: (playerId: string, photo: string | null) => void;
  clear: () => void;
}

const GameContext = createContext<GameValue | null>(null);

/** La partie en cours, persistée à chaque changement pour survivre à une fermeture de l'app. */
export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<Game | null>(() => loadGame());
  const { state } = useStore();

  /*
   * Une partie inachevée tirée dans le paquet Pro ne se reprend pas sans la Pro : sinon un ancien
   * détenteur de code (dont le code ne vaut plus rien sur téléphone) continuerait de jouer avec un
   * mot payant. On l'abandonne une fois, au démarrage.
   */
  useEffect(() => {
    if (game && game.phase !== 'over' && game.pair.pack === 'pro' && !isPro(state.settings)) setGame(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveGame(game);
  }, [game]);

  const start = useCallback<GameValue['start']>((seats, cfg, pairs, opts) => {
    const g = createGame(seats, cfg, pairs, opts);
    setGame(g);
    return g;
  }, []);

  const value = useMemo<GameValue>(
    () => ({
      game,
      start,
      revealNext: () => setGame((g) => (g ? revealNext(g) : g)),
      goToVote: () => setGame((g) => (g ? goToVote(g) : g)),
      backToDiscussion: () => setGame((g) => (g ? backToDiscussion(g) : g)),
      eliminate: (playerId) => {
        if (!game) return null;
        const next = eliminate(game, playerId);
        setGame(next);
        return next;
      },
      resolveWhite: (guess, correct) => {
        if (!game) return null;
        const next = resolveWhiteGuess(game, guess, correct);
        setGame(next);
        return next;
      },
      reorder: (ids) => setGame((g) => (g ? reorderSeats(g, ids) : g)),
      setPhoto: (playerId, photo) =>
        setGame((g) => (g ? { ...g, players: g.players.map((p) => (p.id === playerId ? { ...p, photo } : p)) } : g)),
      clear: () => setGame(null),
    }),
    [game, start],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame doit être utilisé sous GameProvider');
  return ctx;
}
