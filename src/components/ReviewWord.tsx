import { useState } from 'react';
import type { GamePlayer } from '../game/types';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { useStore } from '../store/store';
import { RoleCard } from './RoleCard';
import { Avatar, Button, Screen } from './ui';

/**
 * « Revoir un mot » : on choisit le joueur, on lui passe le téléphone, il retourne sa carte,
 * puis la cache. Plein écran par-dessus la partie, sans toucher à son état.
 */
export function ReviewWord({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { game } = useGame();
  const { state } = useStore();
  const [sel, setSel] = useState<GamePlayer | null>(null);
  const [cardOpen, setCardOpen] = useState(false);

  if (!open || !game) return null;
  const alive = game.players.filter((p) => p.alive);

  const back = () => {
    setCardOpen(false);
    setSel(null);
  };

  const hide = () => {
    setCardOpen(false);
    window.setTimeout(() => setSel(null), 380);
  };

  return (
    <div className="overlay">
      <Screen
        title={T.reveal.review}
        onBack={sel ? back : onClose}
        footer={
          sel ? (
            cardOpen ? (
              <Button onClick={hide}>{T.reveal.memorized}</Button>
            ) : (
              <div className="center muted" style={{ fontSize: 12 }}>
                {T.reveal.secret}
              </div>
            )
          ) : (
            <Button variant="secondary" onClick={onClose}>
              {T.reveal.done}
            </Button>
          )
        }
      >
        {sel ? (
          <div className="reveal-wrap">
            <div className="pass-to">
              <span className="eyebrow">{T.reveal.passTo}</span>
            </div>
            <RoleCard
              player={sel}
              category={game.pair.cat}
              open={cardOpen}
              onOpen={() => setCardOpen(true)}
              showCategory={state.settings.showCategory}
              whiteSeesCategory={state.settings.whiteSeesCategory}
            />
          </div>
        ) : (
          <>
            <p className="muted" style={{ fontSize: 13 }}>
              {T.reveal.reviewHint}
            </p>
            <div className="list">
              {alive.map((p) => (
                <button key={p.id} type="button" className="row clickable" onClick={() => setSel(p)}>
                  <Avatar name={p.name} color={p.color} photo={p.photo} size="sm" />
                  <span className="grow name">{p.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </Screen>
    </div>
  );
}
