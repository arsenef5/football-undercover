import { useState } from 'react';
import { groupsFor } from '../data/words';
import { ALL_CATEGORIES } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { thump } from '../native';
import { useStore } from '../store/store';
import { RefreshIcon } from './Icons';
import { Button, Confirm } from './ui';

/**
 * « Relancer le mot » : mot inconnu d'un joueur → on retire un nouveau mot ET de nouveaux rôles
 * (sinon la demande trahirait un rôle), et tout le monde revoit sa carte.
 */
export function RerollButton({
  label,
  small,
  variant = 'ghost',
  afterReroll,
}: {
  label?: string;
  small?: boolean;
  variant?: 'ghost' | 'secondary';
  afterReroll?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { game, start } = useGame();
  const { state } = useStore();
  if (!game) return null;

  const reroll = () => {
    const seats = game.players.map(({ id, name, avatar, color }) => ({ id, name, avatar, color }));
    const anyWeight = ALL_CATEGORIES.some((c) => (state.settings.weights[c] ?? 0) > 0);
    start(seats, game.config, groupsFor(state.settings.premium), {
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
      <Button variant={variant} small={small} onClick={() => setOpen(true)}>
        <RefreshIcon size={16} />
        {label ?? T.reveal.reroll}
      </Button>
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
