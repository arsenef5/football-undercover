import { useState } from 'react';
import pkg from '../../package.json';
import { ChevronIcon, InfoIcon, SparkIcon, TrashIcon, UsersIcon } from '../components/Icons';
import { LangPickers } from '../components/LanguageSheet';
import { Button, Confirm, Screen, SectionTitle, Segmented, Setting, Toggle } from '../components/ui';
import { BASE_WORD_COUNT, PRO_WORD_COUNT } from '../data/words';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { isNative } from '../native';
import { useNav } from '../nav';
import { useStore } from '../store/store';

export function Settings() {
  const { state, dispatch } = useStore();
  const game = useGame();
  const nav = useNav();
  const [askReset, setAskReset] = useState(false);
  const s = state.settings;
  const set = (patch: Partial<typeof s>) => dispatch({ type: 'settings/set', patch });

  return (
    <>
      <Screen title={T.settings.title} withTabbar>
        <SectionTitle>{T.lang.title}</SectionTitle>
        <LangPickers />

        <SectionTitle>{T.settings.players}</SectionTitle>
        <button type="button" className="link-row" onClick={() => nav.go({ name: 'players' })}>
          <UsersIcon />
          <span className="grow">
            <span className="t">{T.settings.players}</span>
            <span className="s" style={{ display: 'block' }}>
              {T.settings.playersHint}
            </span>
          </span>
          <ChevronIcon size={18} />
        </button>

        <SectionTitle>{T.settings.game}</SectionTitle>
        <div className="list">
          <Setting label={T.settings.haptics}>
            <Toggle on={s.haptics} label={T.settings.haptics} onChange={(v) => set({ haptics: v })} />
          </Setting>
          <Setting label={T.settings.showCategory}>
            <Toggle on={s.showCategory} label={T.settings.showCategory} onChange={(v) => set({ showCategory: v })} />
          </Setting>
          <Setting label={T.settings.whiteSeesCategory}>
            <Toggle on={s.whiteSeesCategory} label={T.settings.whiteSeesCategory} onChange={(v) => set({ whiteSeesCategory: v })} />
          </Setting>
          <Setting label={T.settings.whiteCanStart} hint={T.settings.whiteCanStartHint}>
            <Toggle on={s.whiteCanStart} label={T.settings.whiteCanStart} onChange={(v) => set({ whiteCanStart: v })} />
          </Setting>
          <Setting label={T.settings.timer}>
            <Segmented<number>
              value={s.timerSeconds}
              options={[
                { value: 0, label: T.setup.timerOff },
                { value: 30, label: '30' },
                { value: 60, label: '60' },
                { value: 90, label: '90' },
              ]}
              onChange={(v) => set({ timerSeconds: v })}
            />
          </Setting>
        </div>

        <SectionTitle>{T.settings.pro}</SectionTitle>
        <div className="list">
          <button type="button" className="link-row gold" onClick={() => nav.go({ name: 'pro' })}>
            <SparkIcon className="gold" />
            <span className="grow">
              <span className="t">{s.premium ? T.pro.active : T.home.pro}</span>
              <span className="s" style={{ display: 'block' }}>
                {T.home.proHint}
              </span>
            </span>
            <ChevronIcon size={18} />
          </button>
          {!isNative ? (
            <Setting label={T.settings.proToggle} hint={T.settings.proToggleHint}>
              <Toggle on={s.premium} label={T.settings.proToggle} onChange={(v) => set({ premium: v })} />
            </Setting>
          ) : null}
        </div>

        <SectionTitle>{T.settings.about}</SectionTitle>
        <div className="list">
          <button type="button" className="link-row" onClick={() => nav.go({ name: 'rules' })}>
            <InfoIcon />
            <span className="grow">
              <span className="t">{T.settings.rules}</span>
            </span>
            <ChevronIcon size={18} />
          </button>
          <div className="link-row">
            <span className="grow">
              <span className="t">{T.settings.version(pkg.version)}</span>
              <span className="s" style={{ display: 'block' }}>
                {T.settings.words(BASE_WORD_COUNT, PRO_WORD_COUNT)}
              </span>
            </span>
          </div>
        </div>

        <SectionTitle>{T.settings.data}</SectionTitle>
        <Button variant="danger" onClick={() => setAskReset(true)}>
          <TrashIcon size={18} />
          {T.settings.resetAll}
        </Button>
        <div style={{ height: 8 }} />
      </Screen>

      <Confirm
        open={askReset}
        title={T.settings.resetAll}
        text={T.settings.resetAllConfirm}
        confirmLabel={T.settings.resetAll}
        danger
        onCancel={() => setAskReset(false)}
        onConfirm={() => {
          dispatch({ type: 'all/reset' });
          game.clear();
          setAskReset(false);
        }}
      />
    </>
  );
}
