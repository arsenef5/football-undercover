import { useEffect, useState } from 'react';
import { DotsIcon, PlayIcon, PodiumIcon, ShieldIcon } from './components/Icons';
import { ProPromo } from './components/ProPromo';
import { CreatorPip, CreatorProvider } from './creator/CreatorContext';
import { GameProvider, useGame } from './game/useGame';
import { setLang, T } from './i18n';
import { initAds, setAdsEnabled, setBannerWanted } from './monetization/ads';
import { onProPromo } from './monetization/promo';
import { currentOffer, fetchProActive, fetchProOffer, onProChange, purchasesAvailable } from './monetization/purchases';
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
import { Videos } from './screens/Videos';
import { CreatorSetup } from './screens/CreatorSetup';
import { Vote } from './screens/Vote';
import { WhiteGuess } from './screens/WhiteGuess';
import { isPro, StoreProvider, useStore } from './store/store';
import { useProOffered } from './monetization/access';

const GAME_ROUTES: Route['name'][] = ['creator', 'reveal', 'discuss', 'vote', 'eliminated', 'whiteGuess', 'result'];

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
      // L'écran Pro décide lui-même : il accueille un acheteur, et renvoie les autres si rien n'est à vendre.
      return <Pro />;
    case 'setup':
      return <Setup />;
    case 'videos':
      return <Videos />;
    case 'creator':
      return <CreatorSetup />;
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
  const proOffered = useProOffered();
  const { state, dispatch } = useStore();
  const { game } = useGame();
  const route = nav.route;
  const isTab = (TABS as string[]).includes(route.name);
  const isGameRoute = GAME_ROUTES.includes(route.name);
  const premium = isPro(state.settings);
  const [promoOpen, setPromoOpen] = useState(false);

  // Langue des menus : appliquée avant le rendu des écrans.
  setLang(state.settings.uiLang);

  // Fenêtre Version Pro : demandée par l'écran de résultat après une pub (ou l'aperçu dans Plus).
  useEffect(() => onProPromo(() => setPromoOpen(true)), []);

  useEffect(() => {
    void setupNativeUi();
  }, []);

  /*
   * Le produit « Version Pro » est demandé à l'App Store au lancement, puis à chaque retour dans
   * l'app tant qu'il n'a pas répondu (réseau absent au démarrage, par exemple). Rien de la Pro ne
   * s'affiche avant sa réponse.
   */
  useEffect(() => {
    if (!purchasesAvailable) return;
    void fetchProOffer();
    // Pas de réponse au premier essai : on réessaie tout seul, sans attendre que l'app passe en
    // arrière-plan. Un examinateur Apple qui ne trouve pas l'achat refuse la version.
    const essais = [5000, 30000, 120000].map((ms) =>
      window.setTimeout(() => {
        if (!currentOffer()) void fetchProOffer();
      }, ms),
    );
    const relancer = () => {
      if (!currentOffer()) void fetchProOffer();
    };
    const auRetour = () => {
      if (document.visibilityState === 'visible') relancer();
    };
    document.addEventListener('visibilitychange', auRetour);
    window.addEventListener('online', relancer);
    return () => {
      essais.forEach((t) => window.clearTimeout(t));
      document.removeEventListener('visibilitychange', auRetour);
      window.removeEventListener('online', relancer);
    };
  }, []);

  /*
   * Version Pro : sur iPhone, l'App Store fait foi ; sur le web, les codes et l'interrupteur de test.
   * On relit l'achat au lancement et à chaque retour dans l'app : une perte locale (réinstallation,
   * nouvel iPhone) se répare toute seule.
   */
  const [proConnu, setProConnu] = useState(!purchasesAvailable);
  useEffect(() => {
    if (!purchasesAvailable) return;
    let vivant = true;
    const relire = () =>
      fetchProActive().then((active) => {
        if (!vivant) return;
        if (active !== null) dispatch({ type: 'settings/set', patch: { premium: active } });
        setProConnu(true);
      });
    void relire();
    // Filet : si StoreKit ne répond pas, on n'attend pas indéfiniment pour afficher l'app normale.
    const filet = window.setTimeout(() => vivant && setProConnu(true), 4000);
    const auRetour = () => {
      if (document.visibilityState === 'visible') void relire();
    };
    document.addEventListener('visibilitychange', auRetour);
    const stop = onProChange((active) => dispatch({ type: 'settings/set', patch: { premium: active } }));
    return () => {
      vivant = false;
      window.clearTimeout(filet);
      document.removeEventListener('visibilitychange', auRetour);
      stop();
    };
  }, [dispatch]);

  /*
   * Publicité : uniquement en version gratuite, jamais sur les écrans de partie. Sur iPhone, on
   * attend le verdict de l'App Store : un acheteur qui réinstalle l'app ne doit voir ni le formulaire
   * de consentement publicitaire, ni la demande de suivi, ni une bannière.
   */
  useEffect(() => {
    if (!proConnu) return;
    setAdsEnabled(!premium);
    if (!premium) void initAds();
  }, [premium, proConnu]);

  useEffect(() => {
    setBannerWanted(proConnu && !premium && !isGameRoute);
  }, [premium, proConnu, isGameRoute, route.name]);

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
      {isGameRoute && route.name !== 'creator' ? <CreatorPip /> : null}
      <ProPromo open={proOffered && promoOpen && !premium} onClose={() => setPromoOpen(false)} />
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
