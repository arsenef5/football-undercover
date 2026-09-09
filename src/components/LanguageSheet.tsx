import type { WordLang } from '../game/types';
import { T, type Lang } from '../i18n';
import { tap } from '../native';
import { useStore } from '../store/store';
import { FlagFR, FlagGB } from './Icons';
import { Sheet } from './ui';

function LangOptions<V extends Lang | WordLang>({ value, onChange, label }: { value: V; onChange: (v: V) => void; label: string }) {
  const opts: { v: V; label: string; flag: JSX.Element }[] = [
    { v: 'fr' as V, label: T.lang.fr, flag: <FlagFR size={28} /> },
    { v: 'en' as V, label: T.lang.en, flag: <FlagGB size={28} /> },
  ];
  return (
    <div className="lang-opts" role="radiogroup" aria-label={label}>
      {opts.map((o) => (
        <button
          key={String(o.v)}
          type="button"
          role="radio"
          aria-checked={o.v === value}
          className={`lang-opt ${o.v === value ? 'is-on' : ''}`}
          onClick={() => {
            void tap();
            onChange(o.v);
          }}
        >
          {o.flag}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Les deux réglages de langue : menus et mots. Réutilisé dans l'accueil (feuille) et dans Plus. */
export function LangPickers() {
  const { state, dispatch } = useStore();
  const s = state.settings;
  return (
    <div className="list">
      <div className="setting" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div className="label">{T.lang.ui}</div>
        <LangOptions<Lang> value={s.uiLang} label={T.lang.ui} onChange={(v) => dispatch({ type: 'settings/set', patch: { uiLang: v } })} />
      </div>
      <div className="setting" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div>
          <div className="label">{T.lang.words}</div>
          <div className="hint">{T.lang.wordsHint}</div>
        </div>
        <LangOptions<WordLang> value={s.wordLang} label={T.lang.words} onChange={(v) => dispatch({ type: 'settings/set', patch: { wordLang: v } })} />
      </div>
    </div>
  );
}

export function LanguageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title={T.lang.title}>
      <LangPickers />
    </Sheet>
  );
}
