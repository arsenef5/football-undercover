/**
 * UN SALON = UN OBJET (Cloudflare Durable Object).
 *
 * Le salon est l'ARBITRE : lui seul tire les mots, connaît les rôles, compte les votes et applique
 * les règles. Les téléphones ne sont que des écrans. C'est la seule façon d'avoir un jeu de bluff
 * honnête à distance : un joueur qui fouille son téléphone n'y trouve que son propre mot.
 *
 * Le moteur de jeu est CELUI DE L'APP (src/game/engine.ts), importé tel quel : les règles ne
 * peuvent pas diverger entre le salon et le téléphone.
 */
import {
  clampConfig,
  computeOutcome,
  counts,
  createGame,
  eliminate,
  finish,
  goToVote,
  isGuessLikelyCorrect,
  nextRoundOrder,
  resolveWhiteGuess,
  suggestConfig,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from '../../src/game/engine';
import type { Game, GamePlayer, Role, Seat, WordLang } from '../../src/game/types';
import { groupsFor } from '../../src/data/words';
import type { ClientMsg, PrivateView, RoomPlayer, RoomView, ServerMsg } from '../../src/online/protocol';
import { cleanName } from '../../src/online/protocol';

const COLORS = ['#FF2B2B', '#1AC8ED', '#37D67A', '#FFC21A', '#8B5CF6', '#FF7A1A', '#00C2A8', '#E84393'];
/** Un salon sans personne disparaît au bout de ce délai. */
const EMPTY_TTL_MS = 10 * 60 * 1000;
/** Un salon vit au maximum 4 heures. */
const MAX_LIFE_MS = 4 * 60 * 60 * 1000;

interface Seated {
  id: string;
  name: string;
  color: string;
  connected: boolean;
  seen: boolean;
  points: number;
  lastSeen: number;
}

interface Persisted {
  code: string;
  createdAt: number;
  hostId: string | null;
  seats: Seated[];
  config: { undercovers: number; mrWhite: boolean; lang: WordLang };
  game: Game | null;
  votes: Record<string, string>;
  lastElimination: RoomView['lastElimination'];
  whiteGuess: RoomView['whiteGuess'];
}

export class Room {
  private ctx: DurableObjectState;
  private s: Persisted;
  /** Connexions vivantes : une par siège (une seule fenêtre par joueur). */
  private sockets = new Map<string, WebSocket>();

  constructor(ctx: DurableObjectState) {
    this.ctx = ctx;
    this.s = {
      code: '',
      createdAt: Date.now(),
      hostId: null,
      seats: [],
      config: { undercovers: 1, mrWhite: true, lang: 'fr' },
      game: null,
      votes: {},
      lastElimination: null,
      whiteGuess: null,
    };
    ctx.blockConcurrencyWhile(async () => {
      const saved = await ctx.storage.get<Persisted>('state');
      if (saved) this.s = saved;
    });
  }

  private async save() {
    await this.ctx.storage.put('state', this.s);
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const code = (url.searchParams.get('code') || '').toUpperCase();

    if (url.pathname.endsWith('/exists')) {
      const alive = this.s.seats.length > 0 && Date.now() - this.s.createdAt < MAX_LIFE_MS;
      return Response.json({ exists: alive, code: this.s.code });
    }
    if (url.pathname.endsWith('/claim')) {
      const free = this.s.seats.length === 0 || Date.now() - this.s.createdAt > MAX_LIFE_MS;
      if (!free) return Response.json({ ok: false });
      this.s = { ...this.s, code, createdAt: Date.now(), hostId: null, seats: [], game: null, votes: {}, lastElimination: null, whiteGuess: null };
      this.s.config = { undercovers: 1, mrWhite: true, lang: 'fr' };
      await this.save();
      await this.ctx.storage.setAlarm(Date.now() + EMPTY_TTL_MS);
      return Response.json({ ok: true });
    }
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('attendu : websocket', { status: 426 });

    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    server.accept();
    let seatId = '';
    server.addEventListener('message', async (ev) => {
      let msg: ClientMsg;
      try {
        msg = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      try {
        seatId = (await this.onMessage(server, seatId, msg)) || seatId;
      } catch (e) {
        this.send(server, { t: 'error', code: 'bad-move', message: String((e as Error)?.message || e) });
      }
    });
    const bye = async () => {
      if (!seatId) return;
      this.sockets.delete(seatId);
      const seat = this.s.seats.find((p) => p.id === seatId);
      if (seat) {
        seat.connected = false;
        seat.lastSeen = Date.now();
        // Dans le salon d'attente, partir c'est partir. En partie, on garde sa place.
        if (!this.s.game) this.s.seats = this.s.seats.filter((p) => p.id !== seatId);
        this.passHostIfNeeded();
        await this.save();
        this.broadcast();
      }
    };
    server.addEventListener('close', bye);
    server.addEventListener('error', bye);
    return new Response(null, { status: 101, webSocket: client });
  }

  /** Nettoyage : un salon vide finit par disparaître. */
  async alarm() {
    const someone = this.s.seats.some((p) => p.connected);
    const old = Date.now() - this.s.createdAt > MAX_LIFE_MS;
    if (!someone || old) {
      await this.ctx.storage.deleteAll();
      this.s.seats = [];
      this.s.game = null;
      return;
    }
    await this.ctx.storage.setAlarm(Date.now() + EMPTY_TTL_MS);
  }

  private send(ws: WebSocket, m: ServerMsg) {
    try {
      ws.send(JSON.stringify(m));
    } catch {
      /* connexion déjà fermée */
    }
  }

  private broadcast() {
    const view = this.view();
    for (const [id, ws] of this.sockets) this.send(ws, { t: 'room', room: view, you: id });
  }

  private sendPrivate(id: string) {
    const ws = this.sockets.get(id);
    if (!ws) return;
    this.send(ws, { t: 'private', priv: this.privateOf(id) });
  }

  private privateOf(id: string): PrivateView | null {
    const g = this.s.game;
    if (!g) return null;
    const p = g.players.find((x) => x.id === id);
    if (!p) return null;
    return { role: p.role, word: p.word, category: g.pair.cat };
  }

  private host(): Seated | undefined {
    return this.s.seats.find((p) => p.id === this.s.hostId);
  }

  private passHostIfNeeded() {
    const h = this.host();
    if (h && h.connected) return;
    const next = this.s.seats.find((p) => p.connected) ?? this.s.seats[0];
    this.s.hostId = next ? next.id : null;
  }

  private async onMessage(ws: WebSocket, seatId: string, msg: ClientMsg): Promise<string | void> {
    if (msg.t === 'ping') {
      this.send(ws, { t: 'pong' });
      return;
    }

    if (msg.t === 'hello') {
      const name = cleanName(msg.name) || 'Joueur';
      const existing = this.s.seats.find((p) => p.id === msg.seatId);
      if (!existing) {
        if (this.s.game) {
          this.send(ws, { t: 'error', code: 'started', message: 'La partie a déjà commencé.' });
          return;
        }
        if (this.s.seats.length >= MAX_PLAYERS) {
          this.send(ws, { t: 'error', code: 'full', message: 'Le salon est complet.' });
          return;
        }
        this.s.seats.push({
          id: msg.seatId,
          name,
          color: msg.color || COLORS[this.s.seats.length % COLORS.length],
          connected: true,
          seen: false,
          points: 0,
          lastSeen: Date.now(),
        });
      } else {
        existing.name = name;
        existing.connected = true;
        existing.lastSeen = Date.now();
      }
      if (!this.s.code) this.s.code = (msg.code || '').toUpperCase();
      if (!this.s.hostId) this.s.hostId = msg.seatId;
      // Une seule fenêtre par joueur : la nouvelle remplace l'ancienne.
      const old = this.sockets.get(msg.seatId);
      if (old && old !== ws) {
        try {
          old.close(4000, 'remplacé');
        } catch {
          /* déjà fermée */
        }
      }
      this.sockets.set(msg.seatId, ws);
      await this.save();
      this.broadcast();
      this.sendPrivate(msg.seatId);
      return msg.seatId;
    }

    if (!seatId) return;
    const me = this.s.seats.find((p) => p.id === seatId);
    if (!me) return;
    const isHost = this.s.hostId === seatId;

    switch (msg.t) {
      case 'config': {
        if (!isHost || this.s.game) return this.deny(ws, isHost);
        const cfg = { ...this.s.config };
        if (typeof msg.undercovers === 'number') cfg.undercovers = msg.undercovers;
        if (typeof msg.mrWhite === 'boolean') cfg.mrWhite = msg.mrWhite;
        if (msg.lang) cfg.lang = msg.lang;
        const clamped = clampConfig(this.s.seats.length, { undercovers: cfg.undercovers, mrWhite: cfg.mrWhite });
        this.s.config = { ...clamped, lang: cfg.lang };
        break;
      }
      case 'start': {
        if (!isHost || this.s.game) return this.deny(ws, isHost);
        if (this.s.seats.length < MIN_PLAYERS) {
          this.send(ws, { t: 'error', code: 'bad-move', message: `Il faut au moins ${MIN_PLAYERS} joueurs.` });
          return;
        }
        this.newGame();
        break;
      }
      case 'seen': {
        me.seen = true;
        if (this.s.game && this.s.seats.every((p) => p.seen)) {
          this.s.game = { ...this.s.game, phase: 'discuss', revealIndex: this.s.game.players.length };
        }
        break;
      }
      case 'toVote': {
        if (!isHost) return this.deny(ws, isHost);
        if (!this.s.game || this.s.game.phase !== 'discuss') return;
        this.s.game = goToVote(this.s.game);
        this.s.votes = {};
        break;
      }
      case 'vote': {
        const g = this.s.game;
        if (!g || g.phase !== 'vote') return;
        const voter = g.players.find((p) => p.id === seatId);
        const target = g.players.find((p) => p.id === msg.target);
        if (!voter?.alive || !target?.alive) return;
        this.s.votes[seatId] = msg.target;
        this.resolveVotesIfDone();
        break;
      }
      case 'guess': {
        const g = this.s.game;
        if (!g || g.phase !== 'whiteGuess' || g.pendingWhiteId !== seatId) return;
        const text = String(msg.text || '').slice(0, 40);
        const white = g.players.find((p) => p.id === seatId);
        this.s.whiteGuess = { id: seatId, name: white?.name ?? '', guess: text };
        // Le salon tranche tout seul quand la réponse est manifestement bonne ou fausse ;
        // l'hôte n'arbitre que les cas limites (et jamais s'il est le carton blanc).
        if (isGuessLikelyCorrect(text, g.civilWord)) this.applyGuess(text, true);
        break;
      }
      case 'judge': {
        const g = this.s.game;
        if (!g || g.phase !== 'whiteGuess' || !this.s.whiteGuess?.guess) return;
        if (seatId === g.pendingWhiteId) return; // le carton blanc ne se juge pas lui-même
        if (!isHost) return this.deny(ws, isHost);
        this.applyGuess(this.s.whiteGuess.guess, msg.correct);
        break;
      }
      case 'again': {
        if (!isHost) return this.deny(ws, isHost);
        this.newGame();
        break;
      }
      case 'kick': {
        if (!isHost || this.s.game) return this.deny(ws, isHost);
        this.s.seats = this.s.seats.filter((p) => p.id !== msg.target);
        const ws2 = this.sockets.get(msg.target);
        if (ws2) {
          this.send(ws2, { t: 'error', code: 'kicked', message: 'Tu as été retiré du salon.' });
          this.sockets.delete(msg.target);
        }
        break;
      }
    }
    await this.save();
    this.broadcast();
  }

  private deny(ws: WebSocket, isHost: boolean) {
    if (!isHost) this.send(ws, { t: 'error', code: 'not-host', message: "Seul le capitaine peut faire ça." });
  }

  private newGame() {
    const seats: Seat[] = this.s.seats.map((p) => ({ id: p.id, name: p.name, avatar: '⚽', color: p.color, photo: null }));
    const cfg = clampConfig(seats.length, this.s.config);
    const groups = groupsFor(true);
    this.s.game = createGame(seats, cfg, groups, { lang: this.s.config.lang });
    this.s.votes = {};
    this.s.lastElimination = null;
    this.s.whiteGuess = null;
    for (const p of this.s.seats) p.seen = false;
    for (const id of this.sockets.keys()) this.sendPrivate(id);
  }

  /** Tous les vivants ont voté : on dépouille. Égalité = personne n'est éliminé. */
  private resolveVotesIfDone() {
    const g = this.s.game;
    if (!g) return;
    const alive = g.players.filter((p) => p.alive);
    if (alive.some((p) => !this.s.votes[p.id])) return;

    const tally = new Map<string, number>();
    for (const target of Object.values(this.s.votes)) tally.set(target, (tally.get(target) ?? 0) + 1);
    let best: string[] = [];
    let max = 0;
    for (const [id, n] of tally) {
      if (n > max) {
        max = n;
        best = [id];
      } else if (n === max) best.push(id);
    }
    this.s.votes = {};
    if (best.length !== 1) {
      // Égalité : la manche repart en discussion, personne n'est éliminé.
      this.s.game = { ...g, phase: 'discuss', speakingOrder: nextRoundOrder(g), round: g.round + 1 };
      this.s.lastElimination = null;
      return;
    }
    const outId = best[0];
    const out = g.players.find((p) => p.id === outId)!;
    const after = eliminate(g, outId);
    this.s.lastElimination = { id: out.id, name: out.name, role: out.role };
    this.s.game = after;
    if (after.phase === 'whiteGuess') this.s.whiteGuess = { id: outId, name: out.name, guess: null };
    if (after.phase === 'over') this.awardPoints(after);
  }

  private applyGuess(text: string, correct: boolean) {
    const g = this.s.game;
    if (!g) return;
    const after = resolveWhiteGuess(g, text, correct);
    this.s.game = after;
    this.s.whiteGuess = { ...(this.s.whiteGuess ?? { id: '', name: '' }), guess: text } as RoomView['whiteGuess'];
    if (after.phase === 'over') this.awardPoints(after);
  }

  private awardPoints(g: Game) {
    const res = g.result;
    if (!res) return;
    for (const [id, pts] of Object.entries(res.points)) {
      const seat = this.s.seats.find((p) => p.id === id);
      if (seat) seat.points += pts;
    }
  }

  private view(): RoomView {
    const g = this.s.game;
    const revealed = (p: GamePlayer): Role | null => (!p.alive || g?.phase === 'over' ? p.role : null);
    const players: RoomPlayer[] = this.s.seats.map((seat) => {
      const gp = g?.players.find((p) => p.id === seat.id);
      return {
        id: seat.id,
        name: seat.name,
        color: seat.color,
        host: seat.id === this.s.hostId,
        connected: seat.connected,
        alive: gp ? gp.alive : true,
        seen: seat.seen,
        voted: !!this.s.votes[seat.id],
        role: gp ? revealed(gp) : null,
        points: seat.points,
      };
    });
    const phase: RoomView['phase'] = !g ? 'lobby' : (g.phase as RoomView['phase']);
    const n = this.s.seats.length;
    const blocked = n < MIN_PLAYERS ? `Il faut au moins ${MIN_PLAYERS} joueurs (vous êtes ${n}).` : null;
    return {
      code: this.s.code,
      phase,
      round: g?.round ?? 0,
      players,
      speakingOrder: g?.phase === 'discuss' ? g.speakingOrder : [],
      config: this.s.config,
      category: g ? g.pair.cat : null,
      lastElimination: this.s.lastElimination,
      whiteGuess: this.s.whiteGuess,
      result:
        g?.result && g.phase === 'over'
          ? {
              winner: g.result.winner,
              civilWord: g.civilWord,
              undercoverWord: g.undercoverWord,
              lines: g.players.map((p) => ({
                id: p.id,
                name: p.name,
                role: p.role,
                points: g.result?.points[p.id] ?? 0,
              })),
            }
          : null,
      blocked,
    };
  }
}

/** Compteurs exposés pour les tests du serveur. */
export const _internals = { counts, computeOutcome, finish, suggestConfig };
