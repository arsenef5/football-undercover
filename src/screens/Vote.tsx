import { useState } from 'react';
import { CloseIcon } from '../components/Icons';
import { QuitGame } from '../components/QuitGame';
import { Avatar, Button, Chip, Confirm, RoleBadge, Screen, SectionTitle } from '../components/ui';
import { useCreator } from '../creator/CreatorContext';
import type { GamePlayer } from '../game/types';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { tap, thump } from '../native';
import { useNav } from '../nav';

export function Vote() {
  const { game, eliminate, backToDiscussion } = useGame();
  const creator = useCreator();
  const nav = useNav();
  const [target, setTarget] = useState<GamePlayer | null>(null);
  // Mode créateur : votant sélectionné + décompte des votes (incrustés dans la vidéo).
  const [voter, setVoter] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});

  if (!game) return null;
  const alive = game.players.filter((p) => p.alive);
  const filming = creator.recording;
  const tally = (id: string) => Object.values(votes).filter((t) => t === id).length;

  const castVote = (from: GamePlayer, to: GamePlayer) => {
    setVotes((v) => ({ ...v, [from.id]: to.id }));
    creator.popup({ kind: 'vote', from: from.name, to: to.name, verb: T.creator.votesFor });
    void tap();
    // Votant suivant qui n'a pas encore voté, pour enchaîner vite.
    const next = alive.find((p) => p.id !== from.id && !votes[p.id] && p.id !== to.id) ?? alive.find((p) => p.id !== from.id && !votes[p.id]);
    setVoter(next ? next.id : null);
  };

  const onCard = (p: GamePlayer) => {
    if (filming && voter) {
      const from = alive.find((x) => x.id === voter);
      if (from && from.id !== p.id) {
        castVote(from, p);
        return;
      }
    }
    setTarget(p);
  };

  const confirm = () => {
    if (!target) return;
    const id = target.id;
    setTarget(null);
    const next = eliminate(id);
    if (!next) return;
    if (filming) {
      creator.popup({
        kind: 'elim',
        name: target.name,
        color: target.color,
        role: target.role,
        roleLabel: T.roles[target.role],
        outLabel: T.eliminated.was,
      });
    }
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
        {filming ? (
          <>
            <SectionTitle right={<span className="badge red">REC</span>}>{T.creator.voter}</SectionTitle>
            <div className="chips scroll" style={{ marginBottom: 6 }}>
              {alive.map((p) => (
                <Chip key={p.id} on={voter === p.id} onClick={() => setVoter(voter === p.id ? null : p.id)}>
                  <span className="vdot" style={{ background: p.color }} />
                  {p.name}
                  {votes[p.id] ? <span className="n">✓</span> : null}
                </Chip>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
              {T.creator.voterHint}
            </p>
          </>
        ) : (
          <p className="muted" style={{ fontSize: 13 }}>
            {T.vote.hint}
          </p>
        )}
        <div className="grid-2" style={{ marginTop: 8 }}>
          {game.players.map((p) =>
            p.alive ? (
              <button
                key={p.id}
                type="button"
                className={`vote-card ${filming && voter && voter !== p.id ? 'is-target' : ''}`}
                onClick={() => onCard(p)}
              >
                <Avatar name={p.name} color={p.color} size="lg" />
                <span className="nm">{p.name}</span>
                {filming && tally(p.id) > 0 ? <span className="vcount">{T.creator.voteCount(tally(p.id))}</span> : null}
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
