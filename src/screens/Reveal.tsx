import { useEffect, useState } from 'react';
import { EyeIcon, UsersIcon } from '../components/Icons';
import { QuitGame } from '../components/QuitGame';
import { ReorderSheet } from '../components/ReorderSheet';
import { RerollButton } from '../components/RerollButton';
import { ReviewWord } from '../components/ReviewWord';
import { RoleCard } from '../components/RoleCard';
import { Avatar, Button, ProgressBar, Screen, SpyIcon } from '../components/ui';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { useNav } from '../nav';
import { useStore } from '../store/store';

/**
 * Distribution des rôles : le téléphone passe de main en main. Le nom du joueur est en grand
 * sur la carte ; il la retourne, mémorise, la cache, et passe au suivant. Une fois tout le monde
 * servi : revoir un mot (œil) ou réorganiser l'ordre des sièges, puis commencer.
 */
export function Reveal() {
  const { game, revealNext } = useGame();
  const { state } = useStore();
  const nav = useNav();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  const [reorder, setReorder] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [game?.revealIndex, game?.id]);

  if (!game) return null;
  const total = game.players.length;
  const done = game.phase !== 'reveal' || game.revealIndex >= total;
  const player = done ? null : game.players[game.revealIndex];

  const hide = () => {
    if (busy) return;
    setBusy(true);
    setOpen(false);
    window.setTimeout(() => {
      revealNext();
      setBusy(false);
    }, 400);
  };

  return (
    <>
      <Screen
        title={T.reveal.title}
        right={<QuitGame />}
        footer={
          done ? (
            <>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" onClick={() => setReview(true)}>
                  <EyeIcon size={18} />
                  {T.reveal.review}
                </Button>
                <Button variant="secondary" onClick={() => setReorder(true)}>
                  <UsersIcon size={18} />
                  {T.reveal.reorder}
                </Button>
              </div>
              <RerollButton small />
              <Button onClick={() => nav.replace({ name: 'discuss' })}>{T.reveal.startGame}</Button>
            </>
          ) : open ? (
            <>
              <RerollButton small label={T.reveal.unknownWord} />
              <Button onClick={hide}>{T.reveal.memorized}</Button>
            </>
          ) : (
            <div className="center muted" style={{ fontSize: 12 }}>
              {T.reveal.secret}
            </div>
          )
        }
      >
        <ProgressBar value={Math.min(1, game.revealIndex / total)} />
        <div className="center muted" style={{ fontSize: 12, marginTop: 8 }}>
          {T.reveal.progress(Math.min(game.revealIndex + 1, total), total)}
        </div>

        {done ? (
          <div className="pass-to" style={{ paddingTop: 40 }}>
            <SpyIcon size={96} style={{ color: 'var(--red)', filter: 'drop-shadow(0 0 24px var(--red-glow))' }} />
            <div className="display h1">{T.reveal.allDone}</div>
            <p className="muted">{T.discuss.hint}</p>
          </div>
        ) : player ? (
          <div className="reveal-wrap">
            <div className="pass-to">
              <span className="eyebrow">{T.reveal.passTo}</span>
              <Avatar name={player.name} color={player.color} size="sm" />
            </div>
            <RoleCard
              player={player}
              category={game.pair.cat}
              open={open}
              onOpen={() => setOpen(true)}
              showCategory={state.settings.showCategory}
              whiteSeesCategory={state.settings.whiteSeesCategory}
            />
          </div>
        ) : null}
      </Screen>

      <ReviewWord open={review} onClose={() => setReview(false)} />
      <ReorderSheet open={reorder} onClose={() => setReorder(false)} />
    </>
  );
}
