import { useMemo, useState } from 'react';
import { PlusIcon } from '../components/Icons';
import { PlayerSheet } from '../components/PlayerSheet';
import { SwipeRow } from '../components/SwipeRow';
import { Avatar, Button, EmptyState, IconButton, Screen, useToast } from '../components/ui';
import { T } from '../i18n';
import { useNav } from '../nav';
import { useStore, type Player } from '../store/store';

/** Gestion des joueurs (depuis Plus) : appui = modifier, glissement vers la gauche = supprimer. */
export function Players() {
  const { state, dispatch, addPlayer } = useStore();
  const nav = useNav();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [toast, showToast] = useToast();

  const players = useMemo(
    () => [...state.players].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [state.players],
  );

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <>
      <Screen
        title={T.players.title}
        onBack={() => nav.back()}
        right={
          <IconButton label={T.players.add} onClick={openNew}>
            <PlusIcon />
          </IconButton>
        }
      >
        {players.length === 0 ? (
          <EmptyState icon="🧢" title={T.players.empty} hint={T.players.emptyHint} />
        ) : (
          <>
            <p className="muted" style={{ fontSize: 12 }}>
              {T.players.swipeHint}
            </p>
            <div className="list">
              {players.map((p) => (
                <SwipeRow
                  key={p.id}
                  className="row compact"
                  onTap={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                  onDelete={() => {
                    dispatch({ type: 'player/remove', id: p.id });
                    showToast(`${p.name} · ${T.common.delete}`);
                  }}
                >
                  <Avatar name={p.name} color={p.color} photo={p.photo} size="sm" />
                  <div className="grow">
                    <div className="name">{p.name}</div>
                    <div className="sub">
                      {T.players.stats(p.games, p.wins)} · {p.points} {T.common.points}
                    </div>
                  </div>
                </SwipeRow>
              ))}
            </div>
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <Button variant={players.length === 0 ? 'primary' : 'secondary'} onClick={openNew}>
            <PlusIcon size={18} />
            {T.players.add}
          </Button>
        </div>
      </Screen>

      <PlayerSheet
        open={open}
        initial={editing}
        existingNames={state.players.map((p) => p.name)}
        onClose={() => setOpen(false)}
        onSave={(draft) => {
          if (editing) dispatch({ type: 'player/update', id: editing.id, patch: draft });
          else addPlayer(draft.name, draft.avatar, draft.color, draft.photo);
          setOpen(false);
        }}
      />
      {toast}
    </>
  );
}
