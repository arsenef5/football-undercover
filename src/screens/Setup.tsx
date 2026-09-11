import { useEffect, useMemo, useState } from 'react';
import { CameraIcon, ChevronIcon, PlusIcon, SparkIcon } from '../components/Icons';
import { PlayerSheet } from '../components/PlayerSheet';
import { RolesConfig } from '../components/RolesConfig';
import { SwipeRow } from '../components/SwipeRow';
import { Avatar, Button, CheckMark, Chip, Screen, SectionTitle, Segmented, Setting, Slider, Toggle, useToast } from '../components/ui';
import { DEFAULT_COLOR, randomAvatar } from '../data/avatars';
import { CATEGORY_ORDER, countCombosByCategory, groupsFor } from '../data/words';
import { clampConfig, MAX_PLAYERS, MIN_PLAYERS, suggestConfig, validateConfig } from '../game/engine';
import type { Category, GameConfig } from '../game/types';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { thump } from '../native';
import { useNav } from '../nav';
import { drawOptions, findTeamByRoster, isPro, nextTeamName, type Player, useStore } from '../store/store';

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

  const playerShare = state.settings.playerShare;
  const off = state.settings.categoriesOff;
  const pro = isPro(state.settings);
  const words = groupsFor(pro);
  const wordCount = useMemo(() => countCombosByCategory(words), [words]);

  const setShare = (v: number) => dispatch({ type: 'settings/set', patch: { playerShare: Math.round(v) } });
  const toggleCategory = (c: Category) =>
    dispatch({ type: 'settings/set', patch: { categoriesOff: off.includes(c) ? off.filter((x) => x !== c) : [...off, c] } });
  const others = CATEGORY_ORDER.filter((c) => c !== 'joueur');
  const anyOther = others.some((c) => !off.includes(c));

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

  // Fiche joueur (photo, prénom, couleur) : création depuis l'ajout rapide ou modification depuis une tuile.
  const [sheet, setSheet] = useState<{ open: boolean; player: Player | null }>({ open: false, player: null });
  const openSheet = (player: Player | null) => setSheet({ open: true, player });
  const closeSheet = () => setSheet((s) => ({ ...s, open: false }));

  const error =
    n < MIN_PLAYERS
      ? T.setup.minPlayers(MIN_PLAYERS)
      : n > MAX_PLAYERS
        ? T.setup.maxPlayers(MAX_PLAYERS)
        : effective
          ? validateConfig(n, effective)
          : null;
  const anyCategory = playerShare > 0 || anyOther;

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
      game.start(seats, effective, words, drawOptions(state));
      void thump();
      // Mode créateur : écran Réalisation (aperçu, caméra, micro, REC) avant la distribution.
      nav.go({ name: pro && state.settings.creatorMode ? 'creator' : 'reveal' });
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
          <Button type="button" variant="secondary" aria-label={T.setup.addWithPhoto} onClick={() => openSheet(null)}>
            <CameraIcon />
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
                  <button
                    type="button"
                    className={`tile-photo ${p.photo ? 'has-photo' : ''}`}
                    aria-label={p.photo ? T.players.photoChange : T.players.photoAdd}
                    onClick={() => openSheet(p)}
                  >
                    <Avatar name={p.name} color={p.color} photo={p.photo} size="sm" />
                    <span className="cam" aria-hidden>
                      <CameraIcon size={9} />
                    </span>
                  </button>
                  <span className="name">{p.name}</span>
                  <CheckMark on={on} />
                </SwipeRow>
              );
            })}
          </div>
        )}
        {players.length > 0 ? (
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
            {T.setup.tileHint}
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
        <div className="wrow">
          <div className="lbl">
            <span>
              {T.setup.playerShare} <span className="muted" style={{ fontSize: 11 }}>({wordCount.joueur})</span>
            </span>
            <span className="pct">{playerShare} %</span>
          </div>
          <Slider value={playerShare} min={0} max={100} step={5} label={T.setup.playerShare} onChange={setShare} />
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
          {T.setup.playerShareHint(100 - playerShare)}
        </p>
        <div className="chips" style={{ marginTop: 8 }}>
          {others.map((c) => (
            <Chip key={c} on={!off.includes(c)} onClick={() => toggleCategory(c)}>
              {T.categories[c]}
              <span className="n">{wordCount[c]}</span>
            </Chip>
          ))}
        </div>
        {!anyCategory ? (
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
        {pro ? (
          <div className={`list creator-setting ${state.settings.creatorMode ? 'is-on' : ''}`}>
            <Setting label={T.creator.title} hint={T.creator.hint}>
              <Toggle
                on={state.settings.creatorMode}
                label={T.creator.title}
                onChange={(v) => dispatch({ type: 'settings/set', patch: { creatorMode: v } })}
              />
            </Setting>
          </div>
        ) : (
          <button type="button" className="link-row gold" onClick={() => nav.go({ name: 'pro' })}>
            <SparkIcon className="gold" />
            <span className="grow">
              <span className="t">{T.creator.proOnly}</span>
              <span className="s" style={{ display: 'block' }}>
                {T.creator.proOnlyHint}
              </span>
            </span>
            <ChevronIcon size={18} />
          </button>
        )}
        <div style={{ height: 8 }} />
      </Screen>
      <PlayerSheet
        open={sheet.open}
        initial={sheet.player}
        initialName={quickName.trim()}
        existingNames={state.players.map((p) => p.name)}
        onClose={closeSheet}
        onSave={(draft) => {
          if (sheet.player) {
            dispatch({ type: 'player/update', id: sheet.player.id, patch: { name: draft.name, color: draft.color, photo: draft.photo } });
          } else {
            const p = addPlayer(draft.name, draft.avatar, draft.color, draft.photo);
            setSelected((cur) => [...cur, p.id]);
            setTeamId(null);
            setQuickName('');
          }
          closeSheet();
        }}
      />
      {toast}
    </>
  );
}
