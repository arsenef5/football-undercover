import { clampConfig, maxImpostors, suggestConfig } from '../game/engine';
import type { GameConfig } from '../game/types';
import { T } from '../i18n';
import { Setting, Stepper, Toggle } from './ui';

/**
 * Réglage des rôles pour une table de `playerCount` joueurs.
 * Les titulaires sont déduits ; undercovers et carton blanc se règlent, dans les bornes
 * qui gardent les titulaires majoritaires.
 */
export function RolesConfig({
  playerCount,
  config,
  onChange,
}: {
  playerCount: number;
  config: GameConfig;
  onChange: (cfg: GameConfig) => void;
}) {
  const max = maxImpostors(playerCount);
  const white = config.mrWhite;
  const undercovers = config.undercovers;
  const minU = white ? 0 : 1;
  const maxU = Math.max(minU, max - (white ? 1 : 0));
  const starters = playerCount - undercovers - (white ? 1 : 0);
  const suggested = suggestConfig(playerCount);
  const isSuggested = suggested.undercovers === undercovers && suggested.mrWhite === white;

  const setUndercovers = (v: number) => onChange(clampConfig(playerCount, { undercovers: v, mrWhite: white }));
  const setWhite = (v: boolean) => onChange(clampConfig(playerCount, { undercovers, mrWhite: v }));

  return (
    <div className="list">
      <Setting label={T.setup.starters} hint={T.setup.startersHint}>
        <span className="big-num">{starters}</span>
      </Setting>
      <Setting label={T.setup.undercovers} hint={T.setup.undercoversHint}>
        <Stepper value={undercovers} min={minU} max={maxU} onChange={setUndercovers} label={T.setup.undercovers} />
      </Setting>
      <Setting label={T.setup.white} hint={T.setup.whiteHint}>
        <Toggle on={white} onChange={setWhite} label={T.setup.white} />
      </Setting>
      <div className="summary-line">
        <span>{T.setup.summary(starters, undercovers, white)}</span>
        {isSuggested ? <span className="badge red">{T.setup.suggested}</span> : null}
      </div>
    </div>
  );
}
