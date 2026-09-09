import { useState } from 'react';
import { useCreator } from '../creator/CreatorContext';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { useNav } from '../nav';
import { CloseIcon } from './Icons';
import { Confirm, IconButton } from './ui';

/** Bouton « quitter » des écrans de partie, avec confirmation : la partie est abandonnée. */
export function QuitGame() {
  const [open, setOpen] = useState(false);
  const game = useGame();
  const creator = useCreator();
  const nav = useNav();
  return (
    <>
      <IconButton label={T.quit.confirm} onClick={() => setOpen(true)}>
        <CloseIcon />
      </IconButton>
      <Confirm
        open={open}
        title={T.quit.title}
        text={T.quit.text}
        confirmLabel={T.quit.confirm}
        danger
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          creator.discard();
          game.clear();
          nav.reset({ name: 'home' });
        }}
      />
    </>
  );
}
