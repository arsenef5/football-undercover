import { useEffect, useState } from 'react';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { tap } from '../native';
import { BackIcon } from './Icons';
import { Avatar, Button, RoleBadge, Sheet } from './ui';

/** Réorganise les sièges (donc l'ordre de parole) avec des flèches monter / descendre. */
export function ReorderSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { game, reorder } = useGame();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (open && game) setIds(game.players.map((p) => p.id));
  }, [open, game]);

  if (!open || !game) return null;
  const byId = new Map(game.players.map((p) => [p.id, p]));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    void tap();
    setIds((cur) => {
      const next = cur.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={T.reveal.reorder}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            {T.common.cancel}
          </Button>
          <Button
            onClick={() => {
              reorder(ids);
              onClose();
            }}
          >
            {T.reveal.done}
          </Button>
        </>
      }
    >
      <p className="muted" style={{ fontSize: 13 }}>
        {T.reveal.reorderHint}
      </p>
      <div className="list">
        {ids.map((id, i) => {
          const p = byId.get(id);
          if (!p) return null;
          return (
            <div key={id} className={`row ${p.alive ? '' : 'is-off'}`}>
              <span className="num muted" style={{ width: 22, textAlign: 'center', fontSize: 12 }}>
                {i + 1}
              </span>
              <Avatar name={p.name} color={p.color} size="sm" dead={!p.alive} />
              <span className="grow name">{p.name}</span>
              {!p.alive ? <RoleBadge role={p.role} /> : null}
              <div className="actions">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={T.reveal.up}
                  disabled={i === 0}
                  style={{ opacity: i === 0 ? 0.3 : 1 }}
                  onClick={() => move(i, -1)}
                >
                  <BackIcon style={{ transform: 'rotate(90deg)' }} />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={T.reveal.down}
                  disabled={i === ids.length - 1}
                  style={{ opacity: i === ids.length - 1 ? 0.3 : 1 }}
                  onClick={() => move(i, 1)}
                >
                  <BackIcon style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
