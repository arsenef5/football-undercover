import confetti from 'canvas-confetti';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CardIcon, GlassesIcon, JerseyIcon, RefreshIcon, TrashIcon, VideoIcon } from '../components/Icons';
import { Avatar, Button, RoleBadge, Screen, SectionTitle, useToast } from '../components/ui';
import { useCreator } from '../creator/CreatorContext';
import { groupsFor } from '../data/words';
import { ALL_CATEGORIES } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { showInterstitialIfDue } from '../monetization/ads';
import { promoDue, requestProPromo } from '../monetization/promo';
import { isNative, notify } from '../native';
import { useNav } from '../nav';
import { useStore } from '../store/store';

function burst(colors: string[]) {
  const fire = (x: number, angle: number) =>
    confetti({
      particleCount: 90,
      spread: 70,
      startVelocity: 48,
      angle,
      origin: { x, y: 0.7 },
      colors,
      scalar: 1.1,
      ticks: 220,
      zIndex: 60,
      disableForReducedMotion: true,
    });
  void fire(0.1, 60);
  void fire(0.9, 120);
  window.setTimeout(() => void fire(0.5, 90), 350);
}

export function Result() {
  const { game, start, clear } = useGame();
  const { state, dispatch } = useStore();
  const creator = useCreator();
  const nav = useNav();
  const recorded = useRef<string | null>(null);
  const [toast, showToast] = useToast();
  const [saving, setSaving] = useState(false);

  const result = game?.result ?? null;

  // Mode créateur : la scène de fin reste 4 s à l'image, puis la vidéo est finalisée.
  useEffect(() => {
    if (!creator.recording || !game || !result) return;
    const undercoverCount = game.players.filter((p) => p.role === 'undercover').length;
    creator.setScene({
      type: 'result',
      title:
        result.winner === 'civils' ? T.result.winStarters : result.winner === 'undercovers' ? T.result.winUndercovers(undercoverCount) : T.result.winWhite,
      sub: result.winner === 'civils' ? T.result.subStarters : result.winner === 'undercovers' ? T.result.subUndercovers : T.result.subWhite,
      civilWord: game.civilWord,
      undercoverWord: game.undercoverWord,
      civilLabel: T.result.startersWord,
      undercoverLabel: T.result.undercoverWord,
    });
    const t = window.setTimeout(() => void creator.stop(), 4000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id, creator.recording]);

  const saveVideo = async () => {
    if (saving) return;
    setSaving(true);
    const ok = await creator.save();
    setSaving(false);
    showToast(ok ? T.creator.saved : T.creator.saveFailed);
  };

  // Une seule inscription au palmarès par partie (le store garde aussi un garde-fou).
  useEffect(() => {
    if (!game || !result || recorded.current === game.id) return;
    recorded.current = game.id;
    dispatch({ type: 'result/record', game });
    void notify('success');
    // Version gratuite : un interstitiel toutes les N parties, après les confettis,
    // puis de temps en temps la fenêtre Version Pro.
    if (!state.settings.premium) {
      const played = state.gamesPlayed + 1;
      window.setTimeout(() => {
        void showInterstitialIfDue(played).then((shown) => {
          if (promoDue(played, shown)) requestProPromo();
        });
      }, 1800);
    }
    const colors =
      result.winner === 'civils' ? ['#dcdcdc', '#8e8e8e', '#ff2b2b'] : result.winner === 'undercovers' ? ['#ff2b2b', '#ff7a1a', '#f5f5f5'] : ['#ffffff', '#f5f5f5', '#c9c9c9'];
    const t = window.setTimeout(() => burst(colors), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id, result?.winner]);

  const sessionRows = useMemo(() => {
    if (!game) return [];
    const byId = new Map(state.players.map((p) => [p.id, p]));
    return game.players
      .map((p) => ({ p, pts: state.session[p.id] ?? 0, saved: byId.get(p.id) }))
      .sort((a, b) => b.pts - a.pts || a.p.name.localeCompare(b.p.name, 'fr'));
  }, [game, state.players, state.session]);

  if (!game || !result) return null;

  const undercoverCount = game.players.filter((p) => p.role === 'undercover').length;
  const title =
    result.winner === 'civils' ? T.result.winStarters : result.winner === 'undercovers' ? T.result.winUndercovers(undercoverCount) : T.result.winWhite;
  const lastWhite = [...game.history].reverse().find((h) => h.role === 'white' && h.whiteGuess);
  const whiteGuessed = game.history.some((h) => h.role === 'white' && h.whiteGuessCorrect);
  const sub =
    result.winner === 'civils'
      ? T.result.subStarters
      : result.winner === 'undercovers'
        ? T.result.subUndercovers
        : whiteGuessed
          ? T.result.subWhite
          : T.result.subWhiteSurvived;
  const anyWeight = ALL_CATEGORIES.some((c) => (state.settings.weights[c] ?? 0) > 0);

  const again = () => {
    const seats = game.players.map(({ id, name, avatar, color }) => ({ id, name, avatar, color }));
    start(seats, game.config, groupsFor(state.settings.premium), {
      exclude: [game.pair.id, ...state.recentPairIds],
      weights: anyWeight ? state.settings.weights : undefined,
      lang: state.settings.wordLang,
      whiteCanStart: state.settings.whiteCanStart,
    });
    if (state.settings.creatorMode) void creator.start();
    nav.replace({ name: 'reveal' });
  };

  const finish = () => {
    clear();
    nav.reset({ name: 'home' });
  };

  const showVideo = creator.recording || creator.status === 'starting' || creator.hasVideo;

  return (
    <>
    <Screen
      title={T.result.title}
      footer={
        <>
          <Button onClick={again} sub={T.result.againHint}>
            <RefreshIcon size={18} />
            {T.result.again}
          </Button>
          <Button variant="secondary" onClick={finish}>
            {T.result.finish}
          </Button>
        </>
      }
    >
      <div
        className="winner"
        style={{
          ['--win-glow' as string]:
            result.winner === 'civils' ? 'rgba(220, 220, 220, 0.26)' : result.winner === 'undercovers' ? 'rgba(255, 43, 43, 0.45)' : 'rgba(255, 255, 255, 0.34)',
        }}
      >
        {result.winner === 'civils' ? (
          <JerseyIcon className="trophy silver" style={{ color: 'var(--role-civil)' }} />
        ) : result.winner === 'undercovers' ? (
          <GlassesIcon className="trophy red" style={{ color: 'var(--role-undercover)' }} />
        ) : (
          <CardIcon className="trophy" style={{ color: 'var(--role-white)' }} />
        )}
        <div className={`title display ${result.winner === 'undercovers' ? 'red' : ''}`}>{title}</div>
        <p className="muted">{sub}</p>
        {lastWhite?.whiteGuess ? <span className="badge">{T.result.guessed(lastWhite.whiteGuess)}</span> : null}
      </div>

      {showVideo ? (
        <div className={`card video-ready ${creator.hasVideo ? 'is-ready' : ''}`}>
          <div className="vr-head">
            <span className="vr-icon">
              <VideoIcon size={22} />
            </span>
            <div className="grow">
              <div className="display h3">{creator.hasVideo ? T.creator.ready : T.creator.finishing}</div>
              <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>
                {creator.hasVideo ? T.creator.readyHint : T.creator.title}
              </p>
            </div>
          </div>
          {creator.hasVideo ? (
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <Button onClick={() => void saveVideo()} disabled={saving}>
                <VideoIcon size={18} />
                {isNative ? T.creator.share : T.creator.save}
              </Button>
              <Button variant="secondary" onClick={() => creator.discard()} aria-label={T.creator.discard}>
                <TrashIcon size={18} />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <SectionTitle right={<span className="badge">{T.categories[game.pair.cat]}</span>}>{T.result.words}</SectionTitle>
      <div className="words-box">
        <div className="w">
          <span className="eyebrow">{T.result.startersWord}</span>
          <div className="v">{game.civilWord}</div>
        </div>
        <div className="w undercover">
          <span className="eyebrow red">{T.result.undercoverWord}</span>
          <div className="v">{game.undercoverWord}</div>
        </div>
      </div>

      <SectionTitle>{T.result.points}</SectionTitle>
      <div className="list">
        {game.players.map((p) => {
          const pts = result.points[p.id] ?? 0;
          return (
            <div key={p.id} className="row points-row">
              <Avatar name={p.name} color={p.color} size="sm" dead={!p.alive} />
              <div className="grow">
                <div className="name">{p.name}</div>
                <div className="sub">
                  <RoleBadge role={p.role} />
                </div>
              </div>
              <span className={`pts ${pts > 0 ? 'win' : ''}`}>{pts > 0 ? `+${pts}` : '0'}</span>
            </div>
          );
        })}
      </div>

      <SectionTitle>{T.result.session}</SectionTitle>
      <div className="list">
        {sessionRows.map(({ p, pts }, i) => (
          <div key={p.id} className="row">
            <span className={`rank ${i < 3 ? 'top' : ''}`}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
            <Avatar name={p.name} color={p.color} size="sm" />
            <span className="grow name">{p.name}</span>
            <span className="total">
              {pts}
              <small>{T.common.points}</small>
            </span>
          </div>
        ))}
      </div>
    </Screen>
    {toast}
    </>
  );
}
