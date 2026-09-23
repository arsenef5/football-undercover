/**
 * MODE EN LIGNE 🌐 — un seul écran qui suit la partie : accueil, salon d'attente, mot secret,
 * ordre de parole, vote, élimination, résultat.
 *
 * Ce que cet écran NE FAIT PAS, et c'est volontaire : il ne décide rien. Il affiche ce que le
 * salon lui envoie et renvoie les gestes du joueur. Aucun mot, aucun rôle n'est calculé ici.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Button, Screen, SectionTitle } from '../components/ui';
import { createRoom, forgetRoom, lastRoom, OnlineClient, roomExists, type OnlineState } from '../online/client';
import { isRoomCode, nameError, normalizeCode } from '../online/protocol';
import { T } from '../i18n';
import { useNav } from '../nav';
import { isPro, useStore } from '../store/store';
import { shareText, tap } from '../native';

const NAME_KEY = 'fu.online.name';

export function Online() {
  const nav = useNav();
  const { state } = useStore();
  const clientRef = useRef<OnlineClient | null>(null);
  if (!clientRef.current) clientRef.current = new OnlineClient();
  const client = clientRef.current;

  const [net, setNet] = useState<OnlineState>(client.state);
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || state.players[0]?.name || '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState<'create' | 'join' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [guess, setGuess] = useState('');

  const [reprise, setReprise] = useState<string | null>(null);

  useEffect(() => client.subscribe(setNet), [client]);
  useEffect(() => () => client.leave(), [client]);

  // Au retour (app fermée par iOS, rechargement), on propose de reprendre le salon quitté.
  useEffect(() => {
    const code = lastRoom();
    if (!code) return;
    let vivant = true;
    void roomExists(code).then((ok) => {
      if (!vivant) return;
      if (ok) setReprise(code);
      else forgetRoom();
    });
    return () => {
      vivant = false;
    };
  }, []);

  const color = state.players[0]?.color ?? '#FF2B2B';
  const room = net.room;
  const me = room?.players.find((p) => p.id === net.me) ?? null;
  const isHost = !!me?.host;

  const enter = (roomCode: string) => {
    localStorage.setItem(NAME_KEY, name.trim());
    client.connect(roomCode, name.trim() || 'Joueur', color);
  };

  // Le capitaine partage sa banque de mots : s'il est Pro, tout le salon en profite.
  const pro = isPro(state.settings);
  useEffect(() => {
    if (room?.phase === 'lobby' && me?.host) client.send({ t: 'config', pro });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.phase, me?.host, pro]);

  /** Vérifie le pseudo avant d'entrer : mieux vaut le dire ici que se faire refuser par le salon. */
  const pseudoOk = () => {
    const err = nameError(name);
    if (err === 'court') setNotice(T.online.needName);
    if (err === 'grossier') setNotice(T.online.badName);
    return err === null;
  };

  const create = async () => {
    if (!pseudoOk()) return;
    setBusy('create');
    setNotice(null);
    try {
      enter(await createRoom());
    } catch {
      setNotice(T.online.serverDown);
    } finally {
      setBusy(null);
    }
  };

  const join = async () => {
    if (!pseudoOk()) return;
    const c = normalizeCode(code);
    if (!isRoomCode(c)) return setNotice(T.online.badCode);
    setBusy('join');
    setNotice(null);
    if (!(await roomExists(c))) {
      setNotice(T.online.noRoom);
      setBusy(null);
      return;
    }
    enter(c);
    setBusy(null);
  };

  /*
   * Un compte à rebours n'a de sens que s'il DESCEND. Le salon n'envoie une vue qu'aux moments
   * utiles : on retranche donc localement le temps écoulé depuis la dernière vue reçue, et on
   * redessine chaque seconde tant qu'il y a une échéance à afficher.
   */
  const recu = useRef(0);
  const [, tic] = useState(0);
  useEffect(() => {
    recu.current = Date.now();
    tic((n) => n + 1);
  }, [room?.voteEndsIn, room?.guessEndsIn]);
  const compteARebours = room?.voteEndsIn ?? room?.guessEndsIn ?? null;
  useEffect(() => {
    if (compteARebours === null) return;
    const id = window.setInterval(() => tic((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [compteARebours === null]);
  const restant = (envoye: number | null) =>
    envoye === null ? null : Math.max(0, envoye - Math.floor((Date.now() - recu.current) / 1000));

  /* ------------------------------------------------------------------ hors salon */
  if (!room) {
    return (
      <Screen title={T.online.title} onBack={() => nav.go({ name: 'home' })}>
        <p className="muted center" style={{ marginTop: 4 }}>
          {T.online.pitch}
        </p>
        {reprise ? (
          <>
            <div style={{ height: 8 }} />
            <Button
              onClick={() => {
                setNotice(null);
                enter(reprise);
              }}
              sub={reprise}
            >
              {T.online.resume}
            </Button>
          </>
        ) : null}
        <SectionTitle>{T.online.yourName}</SectionTitle>
        <input
          className="input"
          value={name}
          maxLength={14}
          placeholder={T.online.namePlaceholder}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ height: 18 }} />
        <Button onClick={create} disabled={busy !== null}>
          {busy === 'create' ? T.online.creating : T.online.create}
        </Button>
        <SectionTitle>{T.online.joinTitle}</SectionTitle>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input code-field"
            value={code}
            maxLength={4}
            inputMode="text"
            autoCapitalize="characters"
            placeholder="FKTB"
            onChange={(e) => setCode(normalizeCode(e.target.value))}
          />
          <Button variant="secondary" onClick={join} disabled={busy !== null}>
            {T.online.join}
          </Button>
        </div>
        {notice ? (
          <div className="center" style={{ color: 'var(--red)', fontSize: 13, marginTop: 14 }}>
            {notice}
          </div>
        ) : null}
        <p className="muted center" style={{ fontSize: 12, marginTop: 24 }}>
          {T.online.callHint}
        </p>
      </Screen>
    );
  }

  /* ------------------------------------------------------------------ dans le salon */
  const alive = room.players.filter((p) => p.alive);
  const banner =
    net.status === 'lost' ? (
      <div className="online-lost">{T.online.reconnecting}</div>
    ) : null;

  const sortie = () => {
    client.leave();
    nav.go({ name: 'home' });
  };

  const header = (
    <>
      {banner}
      {net.error ? <div className="online-lost erreur">{net.error}</div> : null}
      {room.lastElimination && room.phase !== 'over' ? (
        <div className="online-out">
          <strong>{room.lastElimination.name}</strong> {T.online.wasRole} <em>{T.roles[room.lastElimination.role]}</em>
        </div>
      ) : null}
      <div className="room-code">
        <span className="eyebrow">{T.online.code}</span>
        <strong className="display">{room.code}</strong>
      </div>
    </>
  );

  const players = (
    <div className="online-players">
      {room.players.map((p) => (
        <div key={p.id} className={`online-player${p.alive ? '' : ' out'}${p.connected ? '' : ' away'}`}>
          <Avatar name={p.name} color={p.color} size="sm" />
          <div className="col">
            <span className="nm">
              {p.name}
              {p.id === net.me ? ` ${T.online.you}` : ''}
            </span>
            <span className="st">
              {[
                !p.connected ? T.online.away : null,
                p.host ? T.online.host : null,
                !p.alive && p.role ? T.roles[p.role] : null,
                p.alive && room.phase === 'reveal' ? (p.seen ? T.online.ready : T.online.reading) : null,
                p.alive && room.phase === 'vote' ? (p.voted ? T.online.hasVoted : T.online.voting) : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>
          {p.id !== net.me ? (
            <button
              type="button"
              className="kick"
              aria-label={T.online.report}
              title={T.online.report}
              onClick={() => {
                client.send({ t: 'report', target: p.id });
                setNotice(T.online.reported);
              }}
            >
              ⚑
            </button>
          ) : null}
          {isHost && room.phase === 'lobby' && p.id !== net.me ? (
            <button type="button" className="kick" aria-label={T.online.kick} onClick={() => client.send({ t: 'kick', target: p.id })}>
              ✕
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );

  if (room.phase === 'lobby') {
    return (
      <Screen
        title={T.online.lobby}
        onBack={sortie}
        footer={
          isHost ? (
            <>
              <Button onClick={() => client.send({ t: 'start' })} disabled={!!room.blocked}>
                {T.online.start}
              </Button>
              {room.blocked ? <div className="center muted" style={{ fontSize: 12 }}>{room.blocked}</div> : null}
            </>
          ) : (
            <div className="center muted" style={{ fontSize: 13 }}>
              {T.online.waitHost}
            </div>
          )
        }
      >
        {header}
        <Button
          variant="secondary"
          onClick={() => {
            void tap();
            void shareText(T.online.invite(room.code));
            setNotice(T.online.copied);
          }}
        >
          {T.online.share}
        </Button>
        {notice ? <div className="center muted" style={{ fontSize: 12, marginTop: 8 }}>{notice}</div> : null}
        {isHost ? (
          <>
            <SectionTitle>{T.online.settings}</SectionTitle>
            <div className="online-settings">
              <div className="row">
                <span>{T.setup.undercovers}</span>
                <div className="chips">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`chip${room.config.undercovers === n ? ' on' : ''}`}
                      onClick={() => client.send({ t: 'config', undercovers: n })}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="row">
                <span>{T.roles.white}</span>
                <button
                  type="button"
                  className={`chip${room.config.mrWhite ? ' on' : ''}`}
                  onClick={() => client.send({ t: 'config', mrWhite: !room.config.mrWhite })}
                >
                  {room.config.mrWhite ? T.online.on : T.online.off}
                </button>
              </div>
              <div className="row">
                <span>{T.lang.words}</span>
                <div className="chips">
                  {(['fr', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      className={`chip${room.config.lang === l ? ' on' : ''}`}
                      onClick={() => client.send({ t: 'config', lang: l })}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
        <SectionTitle>{T.online.inRoom(room.players.length)}</SectionTitle>
        {players}
        <p className="muted center" style={{ fontSize: 12, marginTop: 18 }}>
          {T.online.callHint}
        </p>
      </Screen>
    );
  }

  if (room.phase === 'reveal') {
    const seen = !!me?.seen;
    return (
      <Screen title={T.online.yourWordTitle} onBack={sortie}>
        {header}
        <div className="online-word">
          {!net.priv ? (
            <span className="muted">…</span>
          ) : seen ? (
            <>
              <span className="eyebrow">{T.online.hidden}</span>
              <span className="muted center">{T.online.waitOthers}</span>
            </>
          ) : (
            <>
              <span className="eyebrow">
                {T.reveal.category} · {T.categories[net.priv.category]}
              </span>
              <strong className="display word">{net.priv.word ?? T.roles.white}</strong>
              <span className="muted center">{net.priv.word ? T.reveal.starterHint : T.reveal.whiteHint}</span>
            </>
          )}
        </div>
        {!seen ? (
          <Button onClick={() => client.send({ t: 'seen' })}>{T.reveal.memorized}</Button>
        ) : isHost && room.players.some((p) => !p.seen) ? (
          <Button variant="secondary" onClick={() => client.send({ t: 'ready' })}>
            {T.online.startAnyway}
          </Button>
        ) : null}
        {players}
      </Screen>
    );
  }

  if (room.phase === 'discuss') {
    const monTour = room.turnId === net.me;
    const qui = room.players.find((p) => p.id === room.turnId) ?? null;
    const absent = !!qui && !qui.connected;
    return (
      <Screen
        title={T.online.round(room.round)}
        onBack={sortie}
        footer={
          monTour ? (
            <Button onClick={() => client.send({ t: 'spoke' })}>{T.online.done}</Button>
          ) : qui ? (
            <>
              <div className="center" style={{ fontSize: 13 }}>
                {absent ? T.online.turnAway(qui.name) : T.online.turnOf(qui.name)}
              </div>
              {isHost || absent ? (
                <Button variant="secondary" onClick={() => client.send({ t: 'skip' })}>
                  {T.online.skip}
                </Button>
              ) : null}
            </>
          ) : isHost ? (
            <Button onClick={() => client.send({ t: 'toVote' })}>{T.discuss.vote}</Button>
          ) : (
            <div className="center muted" style={{ fontSize: 13 }}>{T.online.waitHostVote}</div>
          )
        }
      >
        {header}
        <p className="muted center">{qui ? (monTour ? T.online.yourTurn : T.discuss.hint) : T.online.debate}</p>
        <SectionTitle>{T.discuss.order}</SectionTitle>
        <div className="online-players">
          {room.speakingOrder.map((id, i) => {
            const p = room.players.find((x) => x.id === id)!;
            const encours = room.turnId === id;
            const fait = room.turnId ? room.speakingOrder.indexOf(room.turnId) > i : true;
            return (
              <div key={id} className={`online-player${encours ? ' speaking' : ''}${fait ? ' done' : ''}`}>
                <span className="num">{i + 1}</span>
                <Avatar name={p.name} color={p.color} size="sm" />
                <div className="col">
                  <span className="nm">
                    {p.name}
                    {p.id === net.me ? ` ${T.online.you}` : ''}
                  </span>
                  <span className={`st${encours ? ' red' : ''}`}>
                    {encours ? T.online.speaking : fait ? T.online.spoke : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <MyWord priv={net.priv} />
      </Screen>
    );
  }

  if (room.phase === 'vote') {
    const voted = !!me?.voted;
    return (
      <Screen title={T.vote.title} onBack={sortie}>
        {header}
        <p className="muted center">{voted ? T.online.voteDone : T.vote.hint}</p>
        {room.voteEndsIn !== null ? (
          <div className="center muted" style={{ fontSize: 12 }}>{T.online.voteEnds(restant(room.voteEndsIn) ?? 0)}</div>
        ) : null}
        <div className="grid-2" style={{ marginTop: 14 }}>
          {alive.map((p) => (
            <button
              key={p.id}
              type="button"
              className="vote-card"
              disabled={voted || p.id === net.me || !me?.alive}
              onClick={() => {
                void tap();
                client.send({ t: 'vote', target: p.id });
              }}
            >
              <Avatar name={p.name} color={p.color} size="md" />
              <span className="nm">{p.name}</span>
              {p.voted ? <span className="st">{T.online.hasVoted}</span> : null}
            </button>
          ))}
        </div>
        {players}
        <MyWord priv={net.priv} />
      </Screen>
    );
  }

  if (room.phase === 'whiteGuess') {
    const iAmWhite = room.whiteGuess?.id === net.me;
    const proposal = room.whiteGuess?.guess;
    return (
      <Screen title={T.whiteGuess.title} onBack={sortie}>
        {header}
        {iAmWhite && !proposal ? (
          <>
            <p className="muted center">{T.whiteGuess.prompt(me?.name ?? '')}</p>
            <input className="input" value={guess} placeholder={T.whiteGuess.placeholder} onChange={(e) => setGuess(e.target.value)} />
            <div style={{ height: 14 }} />
            <Button disabled={!guess.trim()} onClick={() => client.send({ t: 'guess', text: guess.trim() })}>
              {T.whiteGuess.submit}
            </Button>
          </>
        ) : proposal ? (
          <>
            <p className="center display h2">« {proposal} »</p>
            {!iAmWhite ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" onClick={() => client.send({ t: 'judge', correct: false })}>
                  {T.whiteGuess.reject}
                </Button>
                <Button onClick={() => client.send({ t: 'judge', correct: true })}>{T.whiteGuess.accept}</Button>
              </div>
            ) : (
              <p className="muted center">{T.online.waitJudge}</p>
            )}
          </>
        ) : (
          <>
            <p className="muted center">{T.online.waitWhite(room.whiteGuess?.name ?? '')}</p>
            {room.guessEndsIn !== null ? (
              <p className="center muted" style={{ fontSize: 12 }}>{T.online.guessEnds(restant(room.guessEndsIn) ?? 0)}</p>
            ) : null}
            {!iAmWhite && room.canSkipWhite ? (
              <Button variant="secondary" onClick={() => client.send({ t: 'judge', correct: false })}>
                {T.online.skipWhite}
              </Button>
            ) : null}
          </>
        )}
      </Screen>
    );
  }

  /* résultat */
  const res = room.result;
  return (
    <Screen
      title={T.result.title}
      footer={
        isHost ? (
          <>
            <Button onClick={() => client.send({ t: 'again' })}>{T.result.again}</Button>
            <Button variant="secondary" onClick={() => client.send({ t: 'toLobby' })}>
              {T.online.backToLobby}
            </Button>
            <Button variant="secondary" onClick={sortie}>
              {T.result.finish}
            </Button>
          </>
        ) : (
          <div className="center muted" style={{ fontSize: 13 }}>{T.online.waitHostAgain}</div>
        )
      }
    >
      {header}
      <div className="pass-to" style={{ paddingTop: 10 }}>
        <div className="display h1 center">{res ? winnerLabel(res.winner, room.config.undercovers) : ''}</div>
      </div>
      {res ? (
        <>
          <div className="words-box">
            <div className="w">
              <span className="eyebrow">{T.result.startersWord}</span>
              <span className="v display">{res.civilWord}</span>
            </div>
            <div className="w undercover">
              <span className="eyebrow">{T.result.undercoverWord}</span>
              <span className="v display">{res.undercoverWord}</span>
            </div>
          </div>
          <SectionTitle>{T.result.points}</SectionTitle>
          <div className="online-players">
            {res.lines.map((l) => (
              <div key={l.id} className="online-player">
                <Avatar name={l.name} color={room.players.find((p) => p.id === l.id)?.color ?? '#888'} size="sm" />
                <div className="col">
                  <span className="nm">{l.name}</span>
                  <span className="st">{T.roles[l.role]}</span>
                </div>
                <span className={`pts${l.points > 0 ? ' win' : ''}`}>{l.points > 0 ? `+${l.points}` : '0'}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </Screen>
  );
}

function winnerLabel(w: 'civils' | 'undercovers' | 'white', undercovers: number): string {
  if (w === 'civils') return T.result.winStarters;
  if (w === 'white') return T.result.winWhite;
  return T.result.winUndercovers(undercovers);
}

/** Rappel discret de son propre mot : jamais affiché en permanence (quelqu'un partage peut-être son écran). */
function MyWord({ priv }: { priv: OnlineState['priv'] }) {
  const [open, setOpen] = useState(false);
  const label = useMemo(() => (priv?.word ? priv.word : T.roles.white), [priv]);
  if (!priv) return null;
  return (
    <div className="my-word">
      <button type="button" className="link-row" onClick={() => setOpen((v) => !v)}>
        {open ? label : T.online.showMyWord}
      </button>
    </div>
  );
}
