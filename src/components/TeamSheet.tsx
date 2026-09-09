import { useLayoutEffect, useMemo, useState } from 'react';
import { clampConfig, MIN_PLAYERS, suggestConfig } from '../game/engine';
import type { GameConfig } from '../game/types';
import { T } from '../i18n';
import { tap } from '../native';
import type { Player, Team } from '../store/store';
import { PlusIcon } from './Icons';
import { RolesConfig } from './RolesConfig';
import { SwipeRow } from './SwipeRow';
import { Avatar, Button, CheckMark, SectionTitle, Setting, Sheet, Toggle } from './ui';

export interface TeamDraft {
  name: string;
  playerIds: string[];
  undercovers: number | null;
  white: boolean | null;
}

/**
 * Éditeur d'équipe : nom, effectif (tuiles compactes), prénom à taper pour ajouter un joueur
 * (existant → coché ; inconnu → créé puis coché), rôles par défaut.
 */
export function TeamSheet({
  open,
  initial,
  players,
  defaultName,
  onCreatePlayer,
  onDeletePlayer,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: Team | null;
  players: Player[];
  /** Nom pré-rempli pour une nouvelle équipe (TEAM 1, TEAM 2…). */
  defaultName: string;
  onCreatePlayer: (name: string) => Player;
  onDeletePlayer: (id: string) => void;
  onSave: (draft: TeamDraft) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [ids, setIds] = useState<string[]>([]);
  const [auto, setAuto] = useState(true);
  const [config, setConfig] = useState<GameConfig>({ undercovers: 1, mrWhite: false });
  const [quick, setQuick] = useState('');
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    setQuick('');
    if (initial) {
      setName(initial.name);
      setIds(initial.playerIds.filter((id) => players.some((p) => p.id === id)));
      const custom = initial.undercovers !== null && initial.white !== null;
      setAuto(!custom);
      setConfig(
        custom
          ? clampConfig(initial.playerIds.length, { undercovers: initial.undercovers ?? 1, mrWhite: initial.white ?? false })
          : suggestConfig(Math.max(MIN_PLAYERS, initial.playerIds.length)),
      );
    } else {
      setName(defaultName);
      setIds([]);
      setAuto(true);
      setConfig(suggestConfig(MIN_PLAYERS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id]);

  const count = ids.length;
  const sorted = useMemo(() => [...players].sort((a, b) => a.name.localeCompare(b.name, 'fr')), [players]);
  const effective = useMemo(
    () => (count >= MIN_PLAYERS ? (auto ? suggestConfig(count) : clampConfig(count, config)) : null),
    [auto, config, count],
  );

  const toggleId = (id: string) => {
    void tap();
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
    setError(null);
  };

  /** Prénom tapé : joueur existant → ajouté à l'équipe ; inconnu → créé puis ajouté. */
  const quickAdd = () => {
    const n = quick.trim();
    if (!n) return;
    const existing = players.find((p) => p.name.toLowerCase() === n.toLowerCase());
    const p = existing ?? onCreatePlayer(n);
    setIds((cur) => (cur.includes(p.id) ? cur : [...cur, p.id]));
    setQuick('');
    setError(null);
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError(T.teams.nameRequired);
    if (count < MIN_PLAYERS) return setError(T.teams.needThree);
    const cfg = effective ?? suggestConfig(count);
    onSave({
      name: trimmed,
      playerIds: ids,
      undercovers: auto ? null : cfg.undercovers,
      white: auto ? null : cfg.mrWhite,
    });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={initial ? T.teams.edit : T.teams.add}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            {T.common.cancel}
          </Button>
          <Button onClick={submit}>{T.common.save}</Button>
        </>
      }
    >
      <div className="field">
        <label className="lbl" htmlFor="team-name">
          {T.teams.name}
        </label>
        <input
          id="team-name"
          className="input"
          value={name}
          placeholder={T.teams.namePlaceholder}
          maxLength={24}
          autoComplete="off"
          autoCapitalize="sentences"
          enterKeyHint="done"
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
        />
      </div>

      <SectionTitle right={<span className="pill-count">{count}</span>}>{T.teams.members}</SectionTitle>
      <form
        className="quick-add"
        onSubmit={(e) => {
          e.preventDefault();
          quickAdd();
        }}
      >
        <input
          className="input"
          value={quick}
          placeholder={T.setup.quickAddPlaceholder}
          maxLength={18}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
          aria-label={T.teams.quickAdd}
          onChange={(e) => setQuick(e.target.value)}
        />
        <Button type="submit" variant="secondary" disabled={!quick.trim()}>
          <PlusIcon />
        </Button>
      </form>
      <p className="muted" style={{ fontSize: 12, margin: '8px 0 10px' }}>
        {sorted.length === 0 ? T.teams.quickAddHint : `${T.teams.membersHint} ${T.teams.swipeHint}`}
      </p>
      {sorted.length > 0 ? (
        <div className="tiles">
          {sorted.map((p) => {
            const on = ids.includes(p.id);
            return (
              <SwipeRow
                key={p.id}
                className={`tile ${on ? 'is-on' : ''}`}
                onTap={() => toggleId(p.id)}
                onDelete={() => {
                  setIds((cur) => cur.filter((x) => x !== p.id));
                  onDeletePlayer(p.id);
                }}
              >
                <Avatar name={p.name} color={p.color} size="sm" />
                <span className="name">{p.name}</span>
                <CheckMark on={on} />
              </SwipeRow>
            );
          })}
        </div>
      ) : null}

      {count >= MIN_PLAYERS ? (
        <>
          <SectionTitle>{T.teams.roles}</SectionTitle>
          <p className="muted" style={{ fontSize: 13 }}>
            {T.teams.rolesHint}
          </p>
          <div className="list">
            <Setting
              label={`${T.setup.suggested.charAt(0).toUpperCase()}${T.setup.suggested.slice(1)}`}
              hint={
                effective
                  ? T.setup.summary(count - effective.undercovers - (effective.mrWhite ? 1 : 0), effective.undercovers, effective.mrWhite)
                  : undefined
              }
            >
              <Toggle
                on={auto}
                label={T.setup.suggested}
                onChange={(v) => {
                  setAuto(v);
                  if (!v) setConfig(suggestConfig(count));
                }}
              />
            </Setting>
          </div>
          {!auto ? (
            <div style={{ marginTop: 10 }}>
              <RolesConfig playerCount={count} config={clampConfig(count, config)} onChange={setConfig} />
            </div>
          ) : null}
        </>
      ) : null}

      {error ? (
        <div className="error" style={{ marginTop: 12 }}>
          {error}
        </div>
      ) : null}
    </Sheet>
  );
}
