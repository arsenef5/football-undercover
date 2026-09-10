import { useLayoutEffect, useRef, useState } from 'react';
import { COLORS, DEFAULT_COLOR, randomAvatar } from '../data/avatars';
import { fileToPhoto } from '../data/photo';
import { T } from '../i18n';
import type { Player } from '../store/store';
import { tap } from '../native';
import { CameraIcon, TrashIcon } from './Icons';
import { Avatar, Button, Sheet } from './ui';

export interface PlayerDraft {
  name: string;
  avatar: string;
  color: string;
  /** Photo (data URL) ou null pour les initiales. */
  photo: string | null;
}

/** Éditeur de joueur (création ou modification) : prénom, photo (facultative) et couleur. */
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
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // Pré-remplissage avant la peinture : pas de champ vide affiché un instant.
  useLayoutEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      setName(initial.name);
      setColor(initial.color);
      setPhoto(initial.photo ?? null);
    } else {
      setName('');
      setColor(DEFAULT_COLOR);
      setPhoto(null);
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
    onSave({ name: trimmed, avatar: initial?.avatar ?? randomAvatar(), color, photo });
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      setPhoto(await fileToPhoto(file));
      setError(null);
    } catch {
      setError(T.players.photoFailed);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
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
        <div className="photo-pick">
          <button type="button" className="photo-btn" aria-label={T.players.photoAdd} disabled={busy} onClick={() => fileRef.current?.click()}>
            <Avatar name={name.trim() || '?'} color={color} photo={photo} size="xl" />
            <span className="cam">
              <CameraIcon size={16} />
            </span>
          </button>
          <div className="photo-actions">
            <Button small inline variant="secondary" disabled={busy} onClick={() => cameraRef.current?.click()}>
              <CameraIcon size={16} />
              {T.players.photoTake}
            </Button>
            <Button small inline variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()}>
              {T.players.photoPick}
            </Button>
            {photo ? (
              <Button small inline variant="ghost" onClick={() => setPhoto(null)}>
                <TrashIcon size={16} />
                {T.players.photoRemove}
              </Button>
            ) : null}
          </div>
          <p className="muted" style={{ fontSize: 12, margin: 0, textAlign: 'center' }}>
            {T.players.photoHint}
          </p>
          <input ref={fileRef} type="file" accept="image/*" hidden aria-hidden tabIndex={-1} onChange={(e) => void pick(e.target.files?.[0])} />
          <input ref={cameraRef} type="file" accept="image/*" capture="user" hidden aria-hidden tabIndex={-1} onChange={(e) => void pick(e.target.files?.[0])} />
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
