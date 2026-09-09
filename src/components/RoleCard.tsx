import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import type { Category, GamePlayer } from '../game/types';
import { T } from '../i18n';
import { thump } from '../native';
import { SpyIcon } from './Icons';
import { nb } from './ui';

/**
 * La carte de rôle : recto avec le nom du joueur, verso avec son mot.
 * Elle s'incline sous le doigt (effet 3D) et se retourne au premier appui.
 *
 * Le verso a exactement le même fond et la même lueur quel que soit le rôle :
 * aucun reflet coloré sur le visage ne doit trahir un carton blanc.
 */
export function RoleCard({
  player,
  category,
  open,
  onOpen,
  showCategory,
  whiteSeesCategory,
}: {
  player: GamePlayer;
  category: Category;
  open: boolean;
  onOpen: () => void;
  showCategory: boolean;
  whiteSeesCategory: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const setVars = (rx: number, ry: number, gx: number, gy: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    el.style.setProperty('--gx', `${gx.toFixed(1)}%`);
    el.style.setProperty('--gy', `${gy.toFixed(1)}%`);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setVars(-y * 18, x * 18, (x + 0.5) * 100, (y + 0.5) * 100);
  };

  const reset = () => setVars(0, 0, 50, 30);

  const isWhite = player.role === 'white';
  const catLabel = T.categories[category];
  const showCat = isWhite ? whiteSeesCategory : showCategory;

  return (
    <div
      ref={ref}
      className={`flip ${open ? 'is-open' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={open ? T.reveal.yourWord : T.reveal.tapToReveal}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onPointerUp={reset}
      onClick={() => {
        if (!open) {
          void thump();
          onOpen();
        }
      }}
      onKeyDown={(e) => {
        if (!open && (e.key === 'Enter' || e.key === ' ')) onOpen();
      }}
    >
      <div className="tilt">
        <div className="flip-inner">
          <div className="face front">
            <span className="card-mark">{T.reveal.mark}</span>
            <div className="card-mid">
              <SpyIcon className="spy" />
              <div className="display card-name">{player.name}</div>
            </div>
            <div className="hint">{nb(T.reveal.tapToReveal)}</div>
          </div>

          <div className="face back">
            <span className="card-mark">{showCat ? `${T.reveal.category} · ${catLabel}` : T.reveal.mark}</span>
            {isWhite ? (
              <div className="card-mid">
                <span className="white-card" aria-hidden />
                <div className="display word">{T.roles.white}</div>
              </div>
            ) : (
              <div className="card-mid">
                <span className="eyebrow">{T.reveal.yourWord}</span>
                <div className="display word">{player.word}</div>
              </div>
            )}
            <div className="hint">{nb(isWhite ? T.reveal.whiteHint : T.reveal.starterHint)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
