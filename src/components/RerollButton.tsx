import { useState } from 'react';
import { groupsFor } from '../data/words';
import { ALL_CATEGORIES } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { thump } from '../native';
import { isPro, useStore } from '../store/store';
import { RefreshIcon } from './Icons';
import { Button, Confirm, IconButton } from './ui';

/**
 * « Relancer le mot » : mot inconnu d'un joueur → on retire un nouveau mot ET de nouveaux rôles
 * (sinon la demande trahirait un rôle), et tout le monde revoit sa carte.
 */
export function RerollButton({
  label,
  small,
  variant = 'ghost',
  icon,
  afterReroll,
}: {
  label?: string;
  small?: boolean;
  variant?: 'ghost' | 'secondary';
  /** Icône seule (en-tête d'écran) au lieu d'un bouton texte. */
  icon?: boolean;
  afterReroll?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { game, start } = useGame();
  const { state } = useStore();
  if (!game) return null;

  const reroll = () => {
    const seats = game.players.map(({ id, name, avatar, color, photo }) => ({ id, name, avatar, color, photo: photo ?? null }));
    const anyWeight = ALL_CATEGORIES.some((c) => (state.settings.weights[c] ?? 0) > 0);
    start(seats, game.config, groupsFor(isPro(state.settings)), {
      exclude: [game.pair.id, ...state.recentPairIds],
      weights: anyWeight ? state.settings.weights : undefined,
      lang: state.settings.wordLang,
      whiteCanStart: state.settings.whiteCanStart,
    });
    void thump();
    setOpen(false);
    afterReroll?.();
  };

  return (
    <>
      {icon ? (
        <IconButton label={label ?? T.reveal.reroll} onClick={() => setOpen(true)}>
          <RefreshIcon size={20} />
        </IconButton>
      ) : (
        <Button variant={variant} small={small} onClick={() => setOpen(true)}>
          <RefreshIcon size={16} />
          {label ?? T.reveal.reroll}
        </Button>
      )}
      <Confirm
        open={open}
        title={T.reveal.rerollTitle}
        text={T.reveal.rerollText}
        confirmLabel={T.reveal.rerollConfirm}
        onCancel={() => setOpen(false)}
        onConfirm={reroll}
      />
    </>
  );
}
