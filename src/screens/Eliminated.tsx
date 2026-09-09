import { useEffect } from 'react';
import { Avatar, Button, RoleIcon, Screen } from '../components/ui';
import { playerById } from '../game/engine';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { notify } from '../native';
import { useNav } from '../nav';

/** Révélation du rôle du joueur éliminé, puis aiguillage : devinette, tour suivant ou résultat. */
export function Eliminated() {
  const { game } = useGame();
  const nav = useNav();
  const route = nav.route;
  const playerId = route.name === 'eliminated' ? route.playerId : null;
  const player = game && playerId ? playerById(game, playerId) : undefined;

  useEffect(() => {
    void notify('warning');
  }, []);

  if (!game || !player) return null;

  const next = () => {
    if (game.phase === 'whiteGuess') nav.replace({ name: 'whiteGuess' });
    else if (game.phase === 'over') nav.replace({ name: 'result' });
    else nav.replace({ name: 'discuss' });
  };
  const label =
    game.phase === 'whiteGuess' ? T.eliminated.whiteGuess : game.phase === 'over' ? T.eliminated.results : T.eliminated.continue;

  return (
    <Screen title={T.eliminated.title} footer={<Button onClick={next}>{label}</Button>}>
      <div className="flash" />
      <div className="elim">
        <Avatar name={player.name} color={player.color} size="xl" dead />
        <div>
          <div className="display h2">{player.name}</div>
          <div className="eyebrow" style={{ marginTop: 8 }}>
            {T.eliminated.was}
          </div>
        </div>
        <div className={`elim-icon ${player.role}`} aria-hidden>
          <RoleIcon role={player.role} size={56} />
        </div>
        <div className={`role display ${player.role}`}>{T.roles[player.role]}</div>
        {game.phase === 'whiteGuess' ? (
          <p className="text-2" style={{ maxWidth: 300 }}>
            {T.eliminated.whiteNext}
          </p>
        ) : null}
      </div>
    </Screen>
  );
}
