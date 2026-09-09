import { useMemo, useState } from 'react';
import { Avatar, Button, Confirm, EmptyState, Screen, Segmented } from '../components/ui';
import { T } from '../i18n';
import { useStore } from '../store/store';

export function Ranking() {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState<'session' | 'all'>('session');
  const [askReset, setAskReset] = useState(false);

  const rows = useMemo(() => {
    const list = state.players.map((p) => ({ p, pts: mode === 'session' ? (state.session[p.id] ?? 0) : p.points }));
    return list.filter((r) => (mode === 'session' ? r.pts > 0 : r.p.games > 0)).sort((a, b) => b.pts - a.pts || b.p.wins - a.p.wins || a.p.name.localeCompare(b.p.name, 'fr'));
  }, [state.players, state.session, mode]);

  return (
    <>
      <Screen title={T.ranking.title} withTabbar>
        <Segmented<'session' | 'all'>
          full
          value={mode}
          options={[
            { value: 'session', label: T.ranking.session },
            { value: 'all', label: T.ranking.allTime },
          ]}
          onChange={setMode}
        />
        <div style={{ height: 14 }} />
        {rows.length === 0 ? (
          <EmptyState icon="🏆" title={T.ranking.empty} hint={T.ranking.emptyHint} />
        ) : (
          <div className="list">
            {rows.map(({ p, pts }, i) => (
              <div key={p.id} className="row">
                <span className={`rank ${i < 3 ? 'top' : ''}`}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                <Avatar name={p.name} color={p.color} size="sm" />
                <div className="grow">
                  <div className="name">{p.name}</div>
                  <div className="sub">{T.ranking.stats(p.games, p.wins)}</div>
                </div>
                <span className="total">
                  {pts}
                  <small>{T.common.points}</small>
                </span>
              </div>
            ))}
          </div>
        )}
        {mode === 'session' && Object.keys(state.session).length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <Button variant="secondary" onClick={() => setAskReset(true)}>
              {T.ranking.resetSession}
            </Button>
          </div>
        ) : null}
      </Screen>
      <Confirm
        open={askReset}
        title={T.ranking.resetSession}
        text={T.ranking.resetSessionConfirm}
        onCancel={() => setAskReset(false)}
        onConfirm={() => {
          dispatch({ type: 'session/reset' });
          setAskReset(false);
        }}
      />
    </>
  );
}
