import { useEffect, useMemo, useState } from 'react';
import { PlusIcon } from '../components/Icons';
import { RolesConfig } from '../components/RolesConfig';
import { SwipeRow } from '../components/SwipeRow';
import { Avatar, Button, CheckMark, Chip, Screen, SectionTitle, Segmented, Setting, Slider, Toggle, useToast } from '../components/ui';
import { DEFAULT_COLOR, randomAvatar } from '../data/avatars';
import { CATEGORY_ORDER, countWordsByCategory, groupsFor } from '../data/words';
import {
  ALL_CATEGORIES,
  clampConfig,
  MAX_PLAYERS,
  MIN_PLAYERS,
  shares,
  suggestConfig,
  validateConfig,
  WEIGHT_PRESETS,
} from '../game/engine';
import type { Category, GameConfig } from '../game/types';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { thump } from '../native';
import { useNav } from '../nav';
import { findTeamByRoster, nextTeamName, useStore } from '../store/store';

type Preset = 'players' | 'mix' | 'balanced' | 'custom';

function detectPreset(weights: Record<Category, number>): Preset {
  const same = (a: Record<Category, number>, b: Record<Category, number>) => ALL_CATEGORIES.every((c) => a[c] === b[c]);
  if (same(weights, WEIGHT_PRESETS.players)) return 'players';
  if (same(weights, WEIGHT_PRESETS.mix)) return 'mix';
  if (same(weights, WEIGHT_PRESETS.balanced)) return 'balanced';
  return 'custom';
}

export function Setup() {
  const { state, dispatch, addPlayer, addTeam } = useStore();
  const game = useGame();
  const nav = useNav();
  const [toast, showToast] = useToast();
  const routeTeamId = nav.route.name === 'setup' ? nav.route.teamId : undefined;

  const players = useMemo(
    () => [...state.players].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [state.players],
  );
  const byId = useMemo(() => new Map(state.players.map((p) => [p.id, p])), [state.players]);

  // Effectif de départ : l'équipe demandée (bouton « Lancer une partie »), sinon la dernière table.
  const initialTeam = useMemo(() => {
    const id = routeTeamId ?? state.lastSetup?.teamId ?? null;
    return id ? state.teams.find((t) => t.id === id) ?? null : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selected, setSelected] = useState<string[]>(() =>
    (initialTeam ? initialTeam.playerIds : (state.lastSetup?.playerIds ?? [])).filter((id) => byId.has(id)),
  );
  const [teamId, setTeamId] = useState<string | null>(initialTeam?.id ?? null);
  const [touched, setTouched] = useState<boolean>(() =>
    initialTeam ? initialTeam.undercovers !== null : state.lastSetup?.undercovers !== null && state.lastSetup?.undercovers !== undefined,
  );
  const [config, setConfig] = useState<GameConfig>(() => {
    const ids = (initialTeam ? initialTeam.playerIds : (state.lastSetup?.playerIds ?? [])).filter((id) => byId.has(id));
    const n = ids.length;
    if (initialTeam && initialTeam.undercovers !== null && initialTeam.white !== null && n >= MIN_PLAYERS) {
      return clampConfig(n, { undercovers: initialTeam.undercovers, mrWhite: initialTeam.white });
    }
    const ls = state.lastSetup;
    if (!initialTeam && ls && ls.undercovers !== null && ls.mrWhite !== null && n >= MIN_PLAYERS) {
      return clampConfig(n, { undercovers: ls.undercovers, mrWhite: ls.mrWhite });
    }
    return suggestConfig(Math.max(MIN_PLAYERS, n));
  });
  const [quickName, setQuickName] = useState('');

  const n = selected.length;
  const effective = useMemo(
    () => (n >= MIN_PLAYERS ? (touched ? clampConfig(n, config) : suggestConfig(n)) : null),
    [n, touched, config],
  );

  // Quand l'effectif change sans réglage manuel, on suit le réglage conseillé.
  useEffect(() => {
    if (!touched && n >= MIN_PLAYERS) setConfig(suggestConfig(n));
  }, [n, touched]);

  const weights = state.settings.weights;
  const preset = detectPreset(weights);
  const pct = shares(weights);
  const words = groupsFor(state.settings.premium);
  const wordCount = useMemo(() => countWordsByCategory(words), [words]);

  const setWeights = (w: Record<Category, number>) => dispatch({ type: 'settings/set', patch: { weights: w } });

  const toggle = (id: string) => {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
    setTeamId(null);
  };

  const loadTeam = (id: string) => {
    const team = state.teams.find((t) => t.id === id);
    if (!team) return;
    const ids = team.playerIds.filter((pid) => byId.has(pid));
    setSelected(ids);
    setTeamId(id);
    if (team.undercovers !== null && team.white !== null && ids.length >= MIN_PLAYERS) {
      setTouched(true);
      setConfig(clampConfig(ids.length, { undercovers: team.undercovers, mrWhite: team.white }));
    } else {
      setTouched(false);
    }
  };

  /** Prénom tapé : joueur existant → sélectionné ; inconnu → créé puis sélectionné. */
  const quickAdd = () => {
    const name = quickName.trim();
    if (!name) return;
    const existing = state.players.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setSelected((cur) => (cur.includes(existing.id) ? cur : [...cur, existing.id]));
    } else {
      const p = addPlayer(name, randomAvatar(), DEFAULT_COLOR);
      setSelected((cur) => [...cur, p.id]);
    }
    setTeamId(null);
    setQuickName('');
  };

  const removePlayer = (id: string) => {
    setSelected((cur) => cur.filter((x) => x !== id));
    dispatch({ type: 'player/remove', id });
  };

  const error =
    n < MIN_PLAYERS
      ? T.setup.minPlayers(MIN_PLAYERS)
      : n > MAX_PLAYERS
        ? T.setup.maxPlayers(MAX_PLAYERS)
        : effective
          ? validateConfig(n, effective)
          : null;
  const anyWeight = ALL_CATEGORIES.some((c) => (weights[c] ?? 0) > 0);

  const start = () => {
    if (error || !effective) return;
    const seats = selected.map((id) => byId.get(id)!).map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, color: p.color, photo: p.photo ?? null }));

    // Une table jouée devient une équipe réutilisable, sauf si le même effectif existe déjà.
    let tid = teamId;
    const existing = findTeamByRoster(state.teams, selected);
    if (existing) tid = existing.id;
    else {
      const team = addTeam(nextTeamName(state.teams), selected, null, null, true);
      tid = team.id;
    }

    dispatch({
      type: 'setup/set',
      setup: { playerIds: selected, teamId: tid, undercovers: touched ? effective.undercovers : null, mrWhite: touched ? effective.mrWhite : null },
    });
    try {
      game.start(seats, effective, words, {
        exclude: state.recentPairIds,
        weights: anyWeight ? weights : undefined,
        lang: state.settings.wordLang,
        whiteCanStart: state.settings.whiteCanStart,
      });
      void thump();
      // Mode créateur : écran Réalisation (aperçu, caméra, micro, REC) avant la distribution.
      nav.go({ name: state.settings.creatorMode ? 'creator' : 'reveal' });
    } catch (e) {
      showToast(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <>
      <Screen
        title={T.setup.title}
        onBack={() => nav.back()}
        footer={
          <>
            {effective ? (
              <div className="center muted" style={{ fontSize: 12 }}>
                {n} {T.common.players} · {T.setup.summary(n - effective.undercovers - (effective.mrWhite ? 1 : 0), effective.undercovers, effective.mrWhite)}
              </div>
            ) : (
              <div className="center muted" style={{ fontSize: 12 }}>
                {error}
              </div>
            )}
            <Button disabled={!!error} onClick={start}>
              {T.setup.start}
            </Button>
          </>
        }
      >
        <SectionTitle right={<span className="pill-count">{n}</span>}>{T.setup.who}</SectionTitle>

        {state.teams.length > 0 ? (
          <div className="chips scroll" style={{ marginBottom: 12 }}>
            {state.teams.map((t) => (
              <Chip key={t.id} on={teamId === t.id} onClick={() => loadTeam(t.id)}>
                {t.name}
                <span className="n">{t.playerIds.length}</span>
              </Chip>
            ))}
          </div>
        ) : null}

        <form
          className="quick-add"
          style={{ marginBottom: 10 }}
          onSubmit={(e) => {
            e.preventDefault();
            quickAdd();
          }}
        >
          <input
            className="input"
            value={quickName}
            placeholder={T.setup.quickAddPlaceholder}
            maxLength={18}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="done"
            aria-label={T.setup.quickAdd}
            onChange={(e) => setQuickName(e.target.value)}
          />
          <Button type="submit" variant="secondary" disabled={!quickName.trim()} haptic>
            <PlusIcon />
          </Button>
        </form>

        {players.length === 0 ? (
          <p className="muted" style={{ fontSize: 13 }}>
            {T.setup.noPlayers}
          </p>
        ) : (
          <div className="tiles">
            {players.map((p) => {
              const on = selected.includes(p.id);
              return (
                <SwipeRow key={p.id} className={`tile ${on ? 'is-on' : ''}`} onTap={() => toggle(p.id)} onDelete={() => removePlayer(p.id)}>
                  <Avatar name={p.name} color={p.color} photo={p.photo} size="sm" />
                  <span className="name">{p.name}</span>
                  <CheckMark on={on} />
                </SwipeRow>
              );
            })}
          </div>
        )}
        {players.length > 0 ? (
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            {T.teams.swipeHint}
          </p>
        ) : null}

        <SectionTitle>{T.setup.roles}</SectionTitle>
        {n >= MIN_PLAYERS && effective ? (
          <RolesConfig
            playerCount={n}
            config={effective}
            onChange={(cfg) => {
              setTouched(true);
              setConfig(cfg);
            }}
          />
        ) : (
          <p className="muted" style={{ fontSize: 13 }}>
            {T.setup.minPlayers(MIN_PLAYERS)}
          </p>
        )}

        <SectionTitle>{T.setup.categories}</SectionTitle>
        <Segmented<Preset>
          full
          value={preset}
          options={[
            { value: 'players', label: T.setup.presetPlayers },
            { value: 'mix', label: T.setup.presetMix },
            { value: 'balanced', label: T.setup.presetBalanced },
          ]}
          onChange={(v) => {
            if (v !== 'custom') setWeights({ ...WEIGHT_PRESETS[v] });
          }}
        />
        <div className="weights" style={{ marginTop: 8 }}>
          {CATEGORY_ORDER.map((c) => (
            <div key={c} className={`wrow ${(weights[c] ?? 0) === 0 ? 'is-zero' : ''}`}>
              <div className="lbl">
                <span>
                  {T.categories[c]} <span className="muted" style={{ fontSize: 11 }}>({wordCount[c]})</span>
                </span>
                <span className="pct">{Math.round(pct[c] * 100)} %</span>
              </div>
              <Slider value={weights[c] ?? 0} label={T.categories[c]} onChange={(v) => setWeights({ ...weights, [c]: v })} />
            </div>
          ))}
        </div>
        {!anyWeight ? (
          <p className="error" style={{ marginTop: 6 }}>
            {T.setup.categoriesHint}
          </p>
        ) : null}

        <SectionTitle>{T.setup.timer}</SectionTitle>
        <Segmented<number>
          full
          value={state.settings.timerSeconds}
          options={[
            { value: 0, label: T.setup.timerOff },
            { value: 30, label: '30 s' },
            { value: 60, label: '60 s' },
            { value: 90, label: '90 s' },
          ]}
          onChange={(v) => dispatch({ type: 'settings/set', patch: { timerSeconds: v } })}
        />

        <SectionTitle>{T.creator.title}</SectionTitle>
        <div className={`list creator-setting ${state.settings.creatorMode ? 'is-on' : ''}`}>
          <Setting label={T.creator.title} hint={T.creator.hint}>
            <Toggle
              on={state.settings.creatorMode}
              label={T.creator.title}
              onChange={(v) => dispatch({ type: 'settings/set', patch: { creatorMode: v } })}
            />
          </Setting>
        </div>
        <div style={{ height: 8 }} />
      </Screen>
      {toast}
    </>
  );
}
