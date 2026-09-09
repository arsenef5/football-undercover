import { useEffect, useState } from 'react';
import { BallIcon, ChevronIcon, FlagFR, FlagGB, InfoIcon, PlayIcon, SparkIcon } from '../components/Icons';
import { LanguageSheet } from '../components/LanguageSheet';
import { Button, Logo, Screen } from '../components/ui';
import { countWords, groupsFor } from '../data/words';
import { counts } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { routeForPhase, useNav } from '../nav';
import { useStore } from '../store/store';

/** Le vrai logo (assets → public/logo.png) s'il est présent, sinon le lockup texte. */
function HeroArt() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    const img = new Image();
    const url = `${import.meta.env.BASE_URL}logo.png`;
    img.onload = () => setSrc(url);
    img.src = url;
  }, []);
  if (src) return <img className="hero-art" src={src} alt={T.app.name} />;
  return <Logo size="lg" />;
}

export function Home() {
  const { state } = useStore();
  const { game } = useGame();
  const nav = useNav();
  const words = groupsFor(state.settings.premium);
  const resumable = game && game.phase !== 'over' ? game : null;
  const alive = resumable ? counts(resumable.players).alive : 0;
  const [langOpen, setLangOpen] = useState(false);

  return (
    <Screen headerless withTabbar bodyClass="fixed">
      <div className="hero">
        <button type="button" className="flag-btn" aria-label={T.lang.title} onClick={() => setLangOpen(true)}>
          {state.settings.uiLang === 'fr' ? <FlagFR size={26} /> : <FlagGB size={26} />}
        </button>
        <HeroArt />
        <div className="tag">{T.app.values}</div>
      </div>
      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />

      <div className="stats" aria-label="Statistiques">
        <div className="stat">
          <div className="v">{state.players.length}</div>
          <div className="l">{T.home.statsPlayers}</div>
        </div>
        <div className="stat">
          <div className="v">{state.gamesPlayed}</div>
          <div className="l">{T.home.statsGames}</div>
        </div>
        <div className="stat">
          <div className="v">{countWords(words)}</div>
          <div className="l">{T.home.statsWords}</div>
        </div>
      </div>

      <div className="home-actions">
        {resumable ? (
          <Button variant="secondary" sub={T.home.resumeHint(alive, resumable.round)} onClick={() => nav.go(routeForPhase(resumable.phase))}>
            {T.home.resume}
          </Button>
        ) : null}
        <Button onClick={() => nav.go({ name: 'setup' })}>
          <PlayIcon size={18} />
          {T.home.play}
        </Button>
        <button type="button" className="link-row" onClick={() => nav.go({ name: 'rules' })}>
          <InfoIcon />
          <span className="grow">
            <span className="t">{T.home.rules}</span>
          </span>
          <ChevronIcon size={18} />
        </button>
        {!state.settings.premium ? (
          <button type="button" className="link-row gold" onClick={() => nav.go({ name: 'pro' })}>
            <SparkIcon className="gold" />
            <span className="grow">
              <span className="t">{T.home.pro}</span>
              <span className="s" style={{ display: 'block' }}>
                {T.home.proHint}
              </span>
            </span>
            <ChevronIcon size={18} />
          </button>
        ) : (
          <div className="link-row">
            <BallIcon className="gold" />
            <span className="grow">
              <span className="t">{T.pro.active}</span>
            </span>
          </div>
        )}
      </div>
    </Screen>
  );
}
