import { useEffect, useState } from 'react';
import { CheckIcon, SparkIcon } from '../components/Icons';
import { Button, Screen, Sheet, useToast } from '../components/ui';
import { T } from '../i18n';
import { PRO_COMBOS_CLAIM } from '../monetization/config';
import { fetchProOffer, purchasePro, purchasesAvailable, restorePro, type ProOffer } from '../monetization/purchases';
import { isNative, notify } from '../native';
import { useNav } from '../nav';
import { isPro, useStore } from '../store/store';
import { codesAllowed, proOffered } from '../monetization/access';

/**
 * Vitrine + achat de la Version Pro (RevenueCat). Sur le web ou sans clés : boutons inactifs
 * et message explicatif, le reste de l'app fonctionne normalement.
 */
export function Pro() {
  const nav = useNav();
  const { state, dispatch } = useStore();
  const [toast, showToast] = useToast();
  const [offer, setOffer] = useState<ProOffer | null>(null);
  const [loading, setLoading] = useState(purchasesAvailable);
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState('');
  const [codeBusy, setCodeBusy] = useState(false);
  const premium = isPro(state.settings);

  // Sans boutique ouverte, cet écran n'a rien à proposer sur téléphone : on n'y reste pas.
  useEffect(() => {
    if (!proOffered) nav.back();
  }, [nav]);

  useEffect(() => {
    if (!purchasesAvailable) return;
    let alive = true;
    void fetchProOffer().then((o) => {
      if (!alive) return;
      setOffer(o);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const activate = (msg: string) => {
    dispatch({ type: 'settings/set', patch: { premium: true } });
    void notify('success');
    showToast(msg);
  };

  const buy = async () => {
    if (!offer || busy) return;
    setBusy('buy');
    const res = await purchasePro(offer);
    setBusy(null);
    if (res.ok) activate(T.pro.thanks);
    else showToast(res.cancelled ? T.pro.cancelled : T.pro.error);
  };

  // Code Pro (Arsène et ses amis) : accepté → Version Pro sur cet appareil, sans boutique.
  const submitCode = async () => {
    if (codeBusy || !code.trim()) return;
    // Import à la demande, et seulement dans la version web : absent du binaire des stores.
    if (!__PRO_CODES__) return;
    setCodeBusy(true);
    const { checkProCode, normalizeCode } = await import('../monetization/codes');
    const ok = await checkProCode(code);
    setCodeBusy(false);
    if (!ok) {
      void notify('error');
      showToast(T.pro.codeBad);
      return;
    }
    dispatch({ type: 'settings/set', patch: { proCode: normalizeCode(code) } });
    setCodeOpen(false);
    setCode('');
    void notify('success');
    showToast(T.pro.codeOk);
  };

  const restore = async () => {
    if (busy) return;
    setBusy('restore');
    const found = await restorePro();
    setBusy(null);
    if (found === null) showToast(T.pro.unavailableStore);
    else if (found) activate(T.pro.restored);
    else showToast(T.pro.notFound);
  };

  const perks = T.pro.perks.map((p, i) => (i === 1 ? T.pro.perkWords(PRO_COMBOS_CLAIM) : p));
  // Les codes n'existent que sur le web : sur un store, seul l'achat de la boutique débloque.
  const codeButton = !__PRO_CODES__ || premium || !codesAllowed ? null : (
    <Button variant="ghost" small onClick={() => setCodeOpen(true)}>
      {T.pro.haveCode}
    </Button>
  );

  let cta: JSX.Element;
  if (premium) {
    cta = (
      <Button variant="gold" disabled>
        {state.settings.proCode ? T.pro.activeCode : T.pro.active}
      </Button>
    );
  } else if (!purchasesAvailable) {
    /*
     * Tant que la boutique n'est pas ouverte (contrat « applications payantes » non signé), on
     * n'affiche NI prix NI bouton d'achat : annoncer un paiement qui ne peut pas aboutir est un
     * motif de refus à la revue Apple. La Version Pro s'active alors par code.
     */
    cta = (
      <>
        {codeButton}
        <div className="center muted" style={{ fontSize: 12 }}>
          {isNative ? T.pro.note : T.pro.unavailableWeb}
        </div>
      </>
    );
  } else {
    cta = (
      <>
        <Button variant="gold" disabled={loading || !offer || busy !== null} onClick={buy}>
          {busy === 'buy' ? T.pro.buying : offer ? T.pro.buy(offer.priceString) : loading ? '…' : T.pro.unavailableStore}
        </Button>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="ghost" small disabled={busy !== null} onClick={restore}>
            {busy === 'restore' ? T.pro.restoring : T.pro.restore}
          </Button>
          {codeButton}
        </div>
        <div className="center muted" style={{ fontSize: 12 }}>
          {T.pro.oneTime}
        </div>
      </>
    );
  }

  return (
    <>
      <Screen title={T.pro.title} onBack={() => nav.back()} footer={cta}>
        <div className="card gold" style={{ textAlign: 'center', marginTop: 8 }}>
          <SparkIcon size={44} className="gold" />
          <div className="display h1" style={{ margin: '10px 0 4px' }}>
            {premium ? T.pro.active : T.pro.headline}
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {T.home.proHint}
          </p>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          {perks.map((p) => (
            <div key={p} className="perk">
              <span className="dot">
                <CheckIcon size={14} />
              </span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </Screen>
      {__PRO_CODES__ ? (
      <Sheet
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title={T.pro.codeTitle}
        actions={
          <>
            <Button variant="secondary" onClick={() => setCodeOpen(false)}>
              {T.common.cancel}
            </Button>
            <Button disabled={codeBusy || !code.trim()} onClick={() => void submitCode()}>
              {T.pro.codeApply}
            </Button>
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitCode();
          }}
        >
          <div className="field">
            <label className="lbl" htmlFor="pro-code">
              {T.pro.codeLabel}
            </label>
            <input
              id="pro-code"
              className="input"
              value={code}
              placeholder={T.pro.codePlaceholder}
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <p className="muted" style={{ fontSize: 12, margin: 0 }}>
            {T.pro.codeHint}
          </p>
          <button type="submit" className="sr-only">
            {T.pro.codeApply}
          </button>
        </form>
      </Sheet>
      ) : null}
      {toast}
    </>
  );
}
