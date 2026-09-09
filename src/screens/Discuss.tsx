import { useEffect, useRef, useState } from 'react';
import { EyeIcon, TimerIcon, UsersIcon } from '../components/Icons';
import { QuitGame } from '../components/QuitGame';
import { ReorderSheet } from '../components/ReorderSheet';
import { RerollButton } from '../components/RerollButton';
import { ReviewWord } from '../components/ReviewWord';
import { Avatar, Button, IconButton, RoleBadge, Screen, SectionTitle } from '../components/ui';
import { counts, playerById } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { notify } from '../native';
import { useNav } from '../nav';
import { useStore } from '../store/store';

function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    setLeft(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          setRunning(false);
          void notify('warning');
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, [running]);

  return {
    left,
    running,
    done: left === 0,
    start: () => {
      if (left === 0) setLeft(seconds);
      setRunning(true);
    },
    stop: () => setRunning(false),
  };
}

export function Discuss() {
  const { game, goToVote } = useGame();
  const { state } = useStore();
  const nav = useNav();
  const timer = useCountdown(state.settings.timerSeconds);
  const [review, setReview] = useState(false);
  const [reorder, setReorder] = useState(false);

  if (!game) return null;
  const c = counts(game.players);
  const order = game.speakingOrder.map((id) => playerById(game, id)).filter((p): p is NonNullable<typeof p> => !!p);
  const dead = game.players.filter((p) => !p.alive);
  const mm = Math.floor(timer.left / 60);
  const ss = String(timer.left % 60).padStart(2, '0');

  return (
    <>
      <Screen
        title={T.discuss.round(game.round)}
        right={
          <div style={{ display: 'flex', gap: 6 }}>
            <IconButton label={T.reveal.review} onClick={() => setReview(true)}>
              <EyeIcon />
            </IconButton>
            <RerollButton icon afterReroll={() => nav.replace({ name: 'reveal' })} />
            <QuitGame />
          </div>
        }
        footer={
          <Button
            onClick={() => {
              goToVote();
              nav.replace({ name: 'vote' });
            }}
          >
            {T.discuss.vote}
          </Button>
        }
      >
        <p className="muted" style={{ fontSize: 13 }}>
          {T.discuss.hint}
        </p>

        {state.settings.timerSeconds > 0 ? (
          <div className={`timer ${timer.done ? 'done' : ''}`} style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TimerIcon />
              <span className="time">
                {mm}:{ss}
              </span>
            </div>
            {timer.done ? (
              <span className="badge red">{T.discuss.timerDone}</span>
            ) : (
              <Button small inline variant={timer.running ? 'secondary' : 'primary'} onClick={timer.running ? timer.stop : timer.start}>
                {timer.running ? T.discuss.timerStop : T.discuss.timerStart}
              </Button>
            )}
          </div>
        ) : null}

        <SectionTitle right={<span className="badge">{T.discuss.alive(c.alive)}</span>}>{T.discuss.order}</SectionTitle>
        <div className="order">
          {order.map((p, i) => (
            <div key={p.id} className={`row ${i === 0 ? 'first' : ''}`}>
              <span className="num">{i + 1}</span>
              <Avatar name={p.name} color={p.color} size="sm" />
              <span className="grow name">{p.name}</span>
              {i === 0 ? <span className="badge red">{T.discuss.starts}</span> : null}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button variant="ghost" small onClick={() => setReorder(true)}>
            <UsersIcon size={16} />
            {T.reveal.reorder}
          </Button>
        </div>

        {dead.length > 0 ? (
          <>
            <SectionTitle>{T.vote.out}</SectionTitle>
            <div className="order">
              {dead.map((p) => (
                <div key={p.id} className="row is-off">
                  <span className="num">✕</span>
                  <Avatar name={p.name} color={p.color} size="sm" dead />
                  <span className="grow name">{p.name}</span>
                  <RoleBadge role={p.role} />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Screen>

      <ReviewWord open={review} onClose={() => setReview(false)} />
      <ReorderSheet open={reorder} onClose={() => setReorder(false)} />
    </>
  );
}
