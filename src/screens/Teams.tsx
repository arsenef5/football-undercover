import { useMemo, useState } from 'react';
import { PencilIcon, PlayIcon, PlusIcon } from '../components/Icons';
import { SwipeRow } from '../components/SwipeRow';
import { TeamSheet } from '../components/TeamSheet';
import { Avatar, Button, CheckMark, EmptyState, IconButton, Screen } from '../components/ui';
import { DEFAULT_COLOR, randomAvatar } from '../data/avatars';
import { clampConfig, suggestConfig } from '../game/engine';
import { T } from '../i18n';
import { useNav } from '../nav';
import { nextTeamName, useStore, type Team } from '../store/store';

/**
 * Équipes : on en choisit une, on lance la partie (l'écran Nouvelle partie arrive pré-rempli).
 * Le crayon ouvre l'éditeur ; un glissement vers la gauche supprime l'équipe.
 */
export function Teams() {
  const { state, dispatch, addTeam, addPlayer } = useStore();
  const nav = useNav();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const last = state.lastSetup?.teamId;
    if (last && state.teams.some((t) => t.id === last)) return last;
    return state.teams[0]?.id ?? null;
  });

  const byId = useMemo(() => new Map(state.players.map((p) => [p.id, p])), [state.players]);
  const teams = useMemo(() => [...state.teams].sort((a, b) => b.createdAt - a.createdAt), [state.teams]);
  const selected = teams.find((t) => t.id === selectedId) ?? null;

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const summary = (t: Team) => {
    const n = t.playerIds.filter((id) => byId.has(id)).length;
    if (n < 3) return T.teams.count(n);
    const cfg =
      t.undercovers !== null && t.white !== null
        ? clampConfig(n, { undercovers: t.undercovers, mrWhite: t.white })
        : suggestConfig(n);
    return `${T.teams.count(n)} · ${T.setup.summary(n - cfg.undercovers - (cfg.mrWhite ? 1 : 0), cfg.undercovers, cfg.mrWhite)}`;
  };

  return (
    <>
      <Screen
        title={T.teams.title}
        withTabbar
        right={
          <IconButton label={T.teams.add} onClick={openNew}>
            <PlusIcon />
          </IconButton>
        }
        footer={
          teams.length > 0 ? (
            <Button disabled={!selected} onClick={() => selected && nav.go({ name: 'setup', teamId: selected.id })}>
              <PlayIcon size={18} />
              {selected ? T.teams.launchWith(selected.name) : T.teams.launch}
            </Button>
          ) : undefined
        }
      >
        {teams.length === 0 ? (
          <>
            <EmptyState icon="🛡️" title={T.teams.empty} hint={T.teams.emptyHint} />
            <Button onClick={openNew}>
              <PlusIcon size={18} />
              {T.teams.add}
            </Button>
          </>
        ) : (
          <>
            <p className="muted" style={{ fontSize: 13 }}>
              {T.teams.pick}
            </p>
            <div className="list">
              {teams.map((t) => {
                const members = t.playerIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
                const on = t.id === selectedId;
                return (
                  <SwipeRow
                    key={t.id}
                    className={`row compact ${on ? 'is-on' : ''}`}
                    onTap={() => setSelectedId(t.id)}
                    onDelete={() => {
                      dispatch({ type: 'team/remove', id: t.id });
                      if (selectedId === t.id) setSelectedId(null);
                    }}
                  >
                    <CheckMark on={on} />
                    <div className="avatar-stack">
                      {members.slice(0, 3).map((p) => (
                        <Avatar key={p.id} name={p.name} color={p.color} photo={p.photo} size="sm" />
                      ))}
                    </div>
                    <div className="grow">
                      <div className="name">
                        {t.name}
                        {t.auto ? (
                          <span className="badge" style={{ marginLeft: 8, height: 20, fontSize: 9 }}>
                            {T.teams.autoTag}
                          </span>
                        ) : null}
                      </div>
                      <div className="sub">{summary(t)}</div>
                    </div>
                    <IconButton
                      label={T.common.edit}
                      onClick={() => {
                        setEditing(t);
                        setOpen(true);
                      }}
                    >
                      <PencilIcon size={18} />
                    </IconButton>
                  </SwipeRow>
                );
              })}
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              {T.teams.rowHint}
            </p>
            <div style={{ marginTop: 8 }}>
              <Button variant="secondary" onClick={openNew}>
                <PlusIcon size={18} />
                {T.teams.add}
              </Button>
            </div>
          </>
        )}
      </Screen>

      <TeamSheet
        open={open}
        initial={editing}
        players={state.players}
        defaultName={nextTeamName(state.teams)}
        onCreatePlayer={(name) => addPlayer(name, randomAvatar(), DEFAULT_COLOR)}
        onDeletePlayer={(id) => dispatch({ type: 'player/remove', id })}
        onClose={() => setOpen(false)}
        onSave={(draft) => {
          if (editing) dispatch({ type: 'team/update', id: editing.id, patch: { ...draft, auto: false } });
          else {
            const t = addTeam(draft.name, draft.playerIds, draft.undercovers, draft.white, false);
            setSelectedId(t.id);
          }
          setOpen(false);
        }}
      />
    </>
  );
}
