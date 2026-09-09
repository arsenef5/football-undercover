import { useEffect, useState } from 'react';
import { DotsIcon, PlayIcon, PodiumIcon, ShieldIcon } from './components/Icons';
import { ProPromo } from './components/ProPromo';
import { CreatorPip, CreatorProvider } from './creator/CreatorContext';
import { GameProvider, useGame } from './game/useGame';
import { setLang, T } from './i18n';
import { initAds, setAdsEnabled, setBannerWanted } from './monetization/ads';
import { onProPromo } from './monetization/promo';
import { fetchProActive, onProChange, purchasesAvailable } from './monetization/purchases';
import { onHardwareBack, setHapticsEnabled, setupNativeUi, tap } from './native';
import { NavProvider, TABS, useNav, type Route, type TabName } from './nav';
import { Discuss } from './screens/Discuss';
import { Eliminated } from './screens/Eliminated';
import { Home } from './screens/Home';
import { Players } from './screens/Players';
import { Pro } from './screens/Pro';
import { Ranking } from './screens/Ranking';
import { Result } from './screens/Result';
import { Reveal } from './screens/Reveal';
import { Rules } from './screens/Rules';
import { Settings } from './screens/Settings';
import { Setup } from './screens/Setup';
import { Teams } from './screens/Teams';
import { Vote } from './screens/Vote';
import { WhiteGuess } from './screens/WhiteGuess';
import { StoreProvider, useStore } from './store/store';

const GAME_ROUTES: Route['name'][] = ['reveal', 'discuss', 'vote', 'eliminated', 'whiteGuess', 'result'];

/** Calculé au rendu (et non au chargement du module) pour suivre la langue des menus. */
function tabMeta(): Record<TabName, { label: string; icon: JSX.Element }> {
  return {
    home: { label: T.tabs.home, icon: <PlayIcon /> },
    teams: { label: T.tabs.teams, icon: <ShieldIcon /> },
    ranking: { label: T.tabs.ranking, icon: <PodiumIcon /> },
    settings: { label: T.tabs.more, icon: <DotsIcon /> },
  };
}

function TabBar({ current }: { current: TabName }) {
  const nav = useNav();
  const TAB_META = tabMeta();
  return (
    <nav className="tabbar" aria-label="Navigation">
      {TABS.map((t) => (
        <button
          key={t}
          type="button"
          className={t === current ? 'is-on' : ''}
          aria-current={t === current ? 'page' : undefined}
          onClick={() => {
            if (t !== current) {
              void tap();
              nav.reset({ name: t });
            }
          }}
        >
          {TAB_META[t].icon}
          <span>{TAB_META[t].label}</span>
        </button>
      ))}
    </nav>
  );
}

function CurrentScreen({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <Home />;
    case 'players':
      return <Players />;
    case 'teams':
      return <Teams />;
    case 'ranking':
      return <Ranking />;
    case 'settings':
      return <Settings />;
    case 'rules':
      return <Rules />;
    case 'pro':
      return <Pro />;
    case 'setup':
      return <Setup />;
    case 'reveal':
      return <Reveal />;
    case 'discuss':
      return <Discuss />;
    case 'vote':
      return <Vote />;
    case 'eliminated':
      return <Eliminated />;
    case 'whiteGuess':
      return <WhiteGuess />;
    case 'result':
      return <Result />;
    default:
      return <Home />;
  }
}

function Shell() {
  const nav = useNav();
  const { state, dispatch } = useStore();
  const { game } = useGame();
  const route = nav.route;
  const isTab = (TABS as string[]).includes(route.name);
  const isGameRoute = GAME_ROUTES.includes(route.name);
  const premium = state.settings.premium;
  const [promoOpen, setPromoOpen] = useState(false);

  // Langue des menus : appliquée avant le rendu des écrans.
  setLang(state.settings.uiLang);

  // Fenêtre Version Pro : demandée par l'écran de résultat après une pub (ou l'aperçu dans Plus).
  useEffect(() => onProPromo(() => setPromoOpen(true)), []);

  useEffect(() => {
    void setupNativeUi();
  }, []);

  // Version Pro : l'achat (RevenueCat) fait foi sur mobile ; sur le web on garde l'interrupteur de test.
  useEffect(() => {
    if (!purchasesAvailable) return;
    void fetchProActive().then((active) => {
      if (active !== null) dispatch({ type: 'settings/set', patch: { premium: active } });
    });
    return onProChange((active) => dispatch({ type: 'settings/set', patch: { premium: active } }));
  }, [dispatch]);

  // Publicité : uniquement en version gratuite, jamais sur les écrans de partie.
  useEffect(() => {
    setAdsEnabled(!premium);
    if (!premium) void initAds();
  }, [premium]);

  useEffect(() => {
    setBannerWanted(!premium && !isGameRoute);
  }, [premium, isGameRoute, route.name]);

  useEffect(() => {
    setHapticsEnabled(state.settings.haptics);
  }, [state.settings.haptics]);

  // Bouton retour Android : dépile, sinon l'app se met en arrière-plan.
  useEffect(() => onHardwareBack(() => nav.back()), [nav]);

  // Un écran de partie sans partie (données effacées, lien périmé) renvoie à l'accueil.
  useEffect(() => {
    if (isGameRoute && !game) nav.reset({ name: 'home' });
  }, [isGameRoute, game, nav]);

  // Pas de remontage au changement de langue : l'écran affiché (Accueil ou Plus) lit le store
  // et se re-rend, la feuille de langues reste ouverte.
  const key = route.name === 'eliminated' ? `eliminated-${route.playerId}` : route.name;

  return (
    <div className="app" id="app">
      <div className="app-bg" aria-hidden>
        <span className="orb a" />
        <span className="orb b" />
        <span className="orb c" />
      </div>
      {isGameRoute && !game ? null : <CurrentScreen key={key} route={route} />}
      {isTab ? <TabBar current={route.name as TabName} /> : null}
      {isGameRoute ? <CreatorPip /> : null}
      <ProPromo open={promoOpen && !premium} onClose={() => setPromoOpen(false)} />
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <GameProvider>
        <CreatorProvider>
          <NavProvider initial={{ name: 'home' }}>
            <Shell />
          </NavProvider>
        </CreatorProvider>
      </GameProvider>
    </StoreProvider>
  );
}
