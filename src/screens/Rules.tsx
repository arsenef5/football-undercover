import { CardIcon, GlassesIcon, JerseyIcon } from '../components/Icons';
import { Screen, SectionTitle } from '../components/ui';
import { T } from '../i18n';
import { useNav } from '../nav';

export function Rules() {
  const nav = useNav();
  return (
    <Screen title={T.rules.title} onBack={() => nav.back()} bodyClass="rules">
      <p className="text-2">{T.rules.intro}</p>

      <SectionTitle>{T.rules.roles}</SectionTitle>
      <div className="role-card">
        <span className="ic civil">
          <JerseyIcon />
        </span>
        <div>
          <div className="t">{T.rules.starter}</div>
          <div className="d">{T.rules.starterText}</div>
        </div>
      </div>
      <div className="role-card">
        <span className="ic undercover">
          <GlassesIcon />
        </span>
        <div>
          <div className="t">{T.rules.undercover}</div>
          <div className="d">{T.rules.undercoverText}</div>
        </div>
      </div>
      <div className="role-card">
        <span className="ic white">
          <CardIcon />
        </span>
        <div>
          <div className="t">{T.rules.white}</div>
          <div className="d">{T.rules.whiteText}</div>
        </div>
      </div>

      <SectionTitle>{T.rules.setup}</SectionTitle>
      <p className="text-2">{T.rules.setupText}</p>

      <SectionTitle>{T.rules.flow}</SectionTitle>
      <ol>
        {T.rules.flowSteps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      <SectionTitle>{T.rules.win}</SectionTitle>
      <ul>
        {T.rules.winSteps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <SectionTitle>{T.rules.points}</SectionTitle>
      <ul>
        {T.rules.pointsSteps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <SectionTitle>{T.rules.tips}</SectionTitle>
      <ul>
        {T.rules.tipsSteps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </Screen>
  );
}
