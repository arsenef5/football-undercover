import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Phase } from './game/types';

export type Route =
  | { name: 'home' }
  | { name: 'players' }
  | { name: 'teams' }
  | { name: 'ranking' }
  | { name: 'settings' }
  | { name: 'rules' }
  | { name: 'pro' }
  | { name: 'setup'; teamId?: string }
  | { name: 'videos' }
  | { name: 'creator' }
  | { name: 'reveal' }
  | { name: 'discuss' }
  | { name: 'vote' }
  | { name: 'eliminated'; playerId: string }
  | { name: 'whiteGuess' }
  | { name: 'result' };

export type TabName = 'home' | 'teams' | 'ranking' | 'settings';
export const TABS: TabName[] = ['home', 'teams', 'ranking', 'settings'];

interface NavValue {
  route: Route;
  stack: Route[];
  /** Empile un écran. */
  go: (route: Route) => void;
  /** Remplace l'écran courant (les écrans de partie s'enchaînent sans empiler). */
  replace: (route: Route) => void;
  /** Revient à l'écran précédent ; renvoie false s'il n'y en a pas. */
  back: () => boolean;
  /** Vide la pile et affiche un onglet. */
  reset: (route: Route) => void;
}

const NavContext = createContext<NavValue | null>(null);

export function NavProvider({ initial, children }: { initial: Route; children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([initial]);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const go = useCallback((route: Route) => setStack((s) => [...s, route]), []);
  const replace = useCallback((route: Route) => setStack((s) => [...s.slice(0, -1), route]), []);
  const reset = useCallback((route: Route) => setStack([route]), []);
  const back = useCallback(() => {
    if (stackRef.current.length <= 1) return false;
    setStack((s) => (s.length <= 1 ? s : s.slice(0, -1)));
    return true;
  }, []);

  const value = useMemo<NavValue>(
    () => ({ route: stack[stack.length - 1], stack, go, replace, back, reset }),
    [stack, go, replace, back, reset],
  );
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

/** Écran à afficher pour reprendre une partie selon sa phase. */
export function routeForPhase(phase: Phase): Route {
  switch (phase) {
    case 'reveal':
      return { name: 'reveal' };
    case 'discuss':
      return { name: 'discuss' };
    case 'vote':
      return { name: 'vote' };
    case 'whiteGuess':
      return { name: 'whiteGuess' };
    default:
      return { name: 'result' };
  }
}

export function useNav(): NavValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav doit être utilisé sous NavProvider');
  return ctx;
}
