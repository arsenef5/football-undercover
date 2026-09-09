import { useLayoutEffect, useState } from 'react';
import { COLORS, randomAvatar, randomColor } from '../data/avatars';
import { T } from '../i18n';
import type { Player } from '../store/store';
import { tap } from '../native';
import { Avatar, Button, Sheet } from './ui';

export interface PlayerDraft {
  name: string;
  avatar: string;
  color: string;
}

/** Éditeur de joueur (création ou modification) : prénom + couleur, l'avatar affiche les initiales. */
export function PlayerSheet({
  open,
  initial,
  existingNames,
  onSave,
  onClose,
}: {
  open: boolean;
  initial: Player | null;
  existingNames: string[];
  onSave: (draft: PlayerDraft) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  // Pré-remplissage avant la peinture : pas de champ vide affiché un instant.
  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      setName(initial.name);
      setColor(initial.color);
    } else {
      setName('');
      setColor(randomColor());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError(T.players.nameRequired);
    const taken = existingNames.some(
      (n) => n.toLowerCase() === trimmed.toLowerCase() && n.toLowerCase() !== initial?.name.toLowerCase(),
    );
    if (taken) return setError(T.players.nameTaken);
    onSave({ name: trimmed, avatar: initial?.avatar ?? randomAvatar(), color });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={initial ? T.players.edit : T.players.add}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            {T.common.cancel}
          </Button>
          <Button onClick={submit}>{T.common.save}</Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Avatar name={name.trim() || '?'} color={color} size="xl" />
        </div>
        <div className="field">
          <label className="lbl" htmlFor="player-name">
            {T.players.name}
          </label>
          <input
            id="player-name"
            className="input"
            value={name}
            placeholder={T.players.namePlaceholder}
            maxLength={18}
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="done"
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
          />
          {error ? <div className="error">{error}</div> : null}
        </div>
        <div className="field">
          <span className="lbl">{T.players.color}</span>
          <div className="color-row">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={c === color ? 'is-on' : ''}
                style={{ background: c }}
                aria-label={c}
                onClick={() => {
                  void tap();
                  setColor(c);
                }}
              />
            ))}
          </div>
        </div>
        <button type="submit" className="sr-only">
          {T.common.save}
        </button>
      </form>
    </Sheet>
  );
}
