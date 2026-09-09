import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { T } from '../i18n';
import { tap, thump } from '../native';
import { TrashIcon } from './Icons';

const REVEAL = 72;

/**
 * Ligne « glisser pour supprimer » : un glissement vers la gauche découvre la poubelle,
 * un glissement à fond supprime directement. Un appui simple déclenche `onTap`.
 * Le défilement vertical reste natif (touch-action: pan-y).
 */
export function SwipeRow({
  children,
  onDelete,
  onTap,
  className = '',
  deleteLabel = T.common.delete,
}: {
  children: ReactNode;
  onDelete: () => void;
  onTap?: () => void;
  className?: string;
  deleteLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const axis = useRef<'none' | 'h' | 'v'>('none');
  const armedRef = useRef(false);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [snapped, setSnapped] = useState(false);
  const [armed, setArmed] = useState(false);
  const [gone, setGone] = useState(false);

  const width = () => ref.current?.offsetWidth ?? 300;

  const remove = () => {
    setGone(true);
    setDx(-width());
    void thump();
    window.setTimeout(onDelete, 200);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || gone) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    axis.current = 'none';
    armedRef.current = false;
    setDragging(true);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || e.pointerId !== s.id) return;
    const mx = e.clientX - s.x;
    const my = e.clientY - s.y;
    if (axis.current === 'none') {
      if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      axis.current = Math.abs(mx) > Math.abs(my) ? 'h' : 'v';
      if (axis.current === 'h') {
        try {
          ref.current?.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
    }
    if (axis.current !== 'h') return;
    const w = width();
    const d = Math.min(0, Math.max(-w, mx - (snapped ? REVEAL : 0)));
    setDx(d);
    const nowArmed = -d > w * 0.55;
    if (nowArmed !== armedRef.current) {
      armedRef.current = nowArmed;
      setArmed(nowArmed);
      void tap();
    }
  };

  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (!s || e.pointerId !== s.id) return;
    start.current = null;
    setDragging(false);
    const currentAxis = axis.current;
    axis.current = 'none';

    if (currentAxis === 'none') {
      // appui simple
      if (snapped) {
        setSnapped(false);
        setDx(0);
        return;
      }
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input')) return;
      onTap?.();
      return;
    }
    if (currentAxis === 'v') {
      setDx(snapped ? -REVEAL : 0);
      return;
    }
    if (armedRef.current) {
      remove();
      return;
    }
    if (-dx > REVEAL * 0.5) {
      setSnapped(true);
      setDx(-REVEAL);
    } else {
      setSnapped(false);
      setDx(0);
    }
  };

  const onCancel = () => {
    start.current = null;
    axis.current = 'none';
    setDragging(false);
    setArmed(false);
    armedRef.current = false;
    setDx(snapped ? -REVEAL : 0);
  };

  return (
    <div className={`swipe ${armed ? 'armed' : ''} ${gone ? 'gone' : ''}`}>
      <div className="swipe-under" aria-hidden>
        <TrashIcon />
      </div>
      <div
        ref={ref}
        className={`swipe-content ${dragging ? 'dragging' : ''} ${className}`}
        style={{ transform: `translateX(${dx}px)` }}
        role={onTap ? 'button' : undefined}
        tabIndex={onTap ? 0 : undefined}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
        onKeyDown={(e) => {
          if (onTap && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onTap();
          }
          if (e.key === 'Delete' || e.key === 'Backspace') remove();
        }}
      >
        {children}
      </div>
      {snapped && !gone ? (
        <button type="button" className="swipe-trash" aria-label={deleteLabel} onClick={remove}>
          <TrashIcon />
        </button>
      ) : null}
    </div>
  );
}
