import { useState } from 'react';
import { CloseIcon } from '../components/Icons';
import { QuitGame } from '../components/QuitGame';
import { Avatar, Button, Confirm, RoleBadge, Screen } from '../components/ui';
import type { GamePlayer } from '../game/types';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { thump } from '../native';
import { useNav } from '../nav';

export function Vote() {
  const { game, eliminate, backToDiscussion } = useGame();
  const nav = useNav();
  const [target, setTarget] = useState<GamePlayer | null>(null);

  if (!game) return null;

  const confirm = () => {
    if (!target) return;
    const id = target.id;
    setTarget(null);
    const next = eliminate(id);
    if (!next) return;
    void thump();
    nav.replace({ name: 'eliminated', playerId: id });
  };

  return (
    <>
      <Screen
        title={`${T.vote.title} · ${T.discuss.round(game.round)}`}
        right={<QuitGame />}
        footer={
          <Button
            variant="ghost"
            onClick={() => {
              backToDiscussion();
              nav.replace({ name: 'discuss' });
            }}
          >
            {T.vote.backToDiscuss}
          </Button>
        }
      >
        <p className="muted" style={{ fontSize: 13 }}>
          {T.vote.hint}
        </p>
        <div className="grid-2" style={{ marginTop: 8 }}>
          {game.players.map((p) =>
            p.alive ? (
              <button key={p.id} type="button" className="vote-card" onClick={() => setTarget(p)}>
                <Avatar name={p.name} color={p.color} size="lg" />
                <span className="nm">{p.name}</span>
              </button>
            ) : (
              <div key={p.id} className="vote-card dead" aria-label={`${p.name} : ${T.vote.out}`}>
                <Avatar name={p.name} color={p.color} size="lg" dead />
                <span className="nm">{p.name}</span>
                <RoleBadge role={p.role} />
                <span className="x">
                  <CloseIcon />
                </span>
              </div>
            ),
          )}
        </div>
      </Screen>

      <Confirm
        open={target !== null}
        title={target ? T.vote.confirm(target.name) : ''}
        text={T.vote.confirmHint}
        confirmLabel={T.vote.eliminate}
        danger
        onCancel={() => setTarget(null)}
        onConfirm={confirm}
      />
    </>
  );
}
