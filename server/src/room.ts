/**
 * UN SALON = UN OBJET (Cloudflare Durable Object).
 *
 * Le salon est l'ARBITRE : lui seul tire les mots, connaît les rôles, compte les votes et applique
 * les règles. Les téléphones ne sont que des écrans. C'est la seule façon d'avoir un jeu de bluff
 * honnête à distance : un joueur qui fouille son téléphone n'y trouve que son propre mot.
 *
 * LE PRINCIPE QUI GOUVERNE TOUT CE FICHIER : une déconnexion n'est PAS un départ.
 * Sur iPhone, l'app est suspendue dès qu'elle passe en arrière-plan — et le jeu demande justement
 * aux joueurs de basculer sur WhatsApp ou Discord pour se parler. Verrouiller son écran, lire un
 * message, répondre à un appel : à chaque fois la connexion tombe. Donc :
 *   - un siège n'est jamais supprimé parce que la connexion est tombée, seulement sur un départ
 *     explicite ou quand le salon meurt de vieillesse ;
 *   - rien n'attend indéfiniment un joueur : le vote a une échéance ;
 *   - mais rien ne se décide non plus à la place des absents : il faut un quorum.
 *
 * Le moteur de jeu est CELUI DE L'APP (src/game/engine.ts), importé tel quel : les règles ne
 * peuvent pas diverger entre le salon et le téléphone.
 */
import {
  acceptsGuessAlone,
  clampConfig,
  createGame,
  eliminate,
  goToVote,
  nextRoundOrder,
  resolveWhiteGuess,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from '../../src/game/engine';
import type { Game, GamePlayer, Role, Seat, WordLang } from '../../src/game/types';
import { groupsFor } from '../../src/data/words';
import type { ClientMsg, PrivateView, RoomPlayer, RoomView, ServerMsg } from '../../src/online/protocol';
import { badWord, cleanName } from '../../src/online/protocol';

const COLORS = ['#FF2B2B', '#1AC8ED', '#37D67A', '#FFC21A', '#8B5CF6', '#FF7A1A', '#00C2A8', '#E84393'];
/** Temps laissé à un vote avant dépouillement d'office. */
const VOTE_MS = 90 * 1000;
/** Temps laissé au carton blanc pour proposer un mot avant que la manche reprenne sans lui. */
const GUESS_MS = 120 * 1000;
/** Absence à partir de laquelle le groupe peut reprendre sans attendre le carton blanc. */
const GONE_MS = 20 * 1000;
/** Au-delà, on ne compte plus ce joueur parmi ceux dont on attend une voix. */
const JOIGNABLE_MS = 3 * 60 * 1000;
/** Absence de l'orateur à partir de laquelle n'importe qui peut passer au suivant. */
const TOUR_ABSENT_MS = 15 * 1000;
/** Un salon meurt quand plus personne n'a donné signe de vie depuis ce délai. */
const IDLE_MS = 2 * 60 * 60 * 1000;
/** Fréquence du ménage. */
const SWEEP_MS = 15 * 60 * 1000;
/** Le capitanat ne change qu'après ce délai d'absence : verrouiller son écran ne le fait pas perdre. */
const HOST_GRACE_MS = 60 * 1000;

interface Seated {
  /** Identifiant public, visible de tous. */
  id: string;
  /** Secret remis au premier arrivé : lui seul prouve que ce siège est le tien. */
  token: string;
  name: string;
  color: string;
  connected: boolean;
  seen: boolean;
  points: number;
  lastSeen: number;
  /** Le joueur a explicitement quitté le salon. */
  gone: boolean;
}

interface Persisted {
  code: string;
  createdAt: number;
  hostId: string | null;
  seats: Seated[];
  config: { undercovers: number; mrWhite: boolean; lang: WordLang; pro: boolean };
  game: Game | null;
  turn: number;
  votes: Record<string, string>;
  /** Échéance du vote en cours (horloge serveur), 0 hors vote. */
  voteUntil: number;
  /** Échéance laissée au carton blanc, 0 hors dernière chance. */
  guessUntil: number;
  lastElimination: RoomView['lastElimination'];
  whiteGuess: RoomView['whiteGuess'];
}

function newToken(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export class Room {
  private ctx: DurableObjectState;
  private s: Persisted;

  constructor(ctx: DurableObjectState) {
    this.ctx = ctx;
    this.s = {
      code: '',
      createdAt: Date.now(),
      hostId: null,
      seats: [],
      config: { undercovers: 1, mrWhite: true, lang: 'fr', pro: false },
      game: null,
      turn: 0,
      votes: {},
      voteUntil: 0,
      guessUntil: 0,
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

  /** Prochain réveil : la plus proche des échéances en cours, sinon le ménage. */
  private async planAlarm() {
    const now = Date.now();
    /*
     * Le bouton « Passer sans sa réponse » n'apparaît qu'après vingt secondes d'absence. Personne
     * n'écrit rien pendant ce temps-là : sans réveil programmé, aucun message ne partirait et le
     * bouton n'apparaîtrait jamais. On se réveille donc pile à l'instant où la règle devient vraie.
     */
    const blanc = this.s.game?.phase === 'whiteGuess' ? this.s.seats.find((p) => p.id === this.s.game?.pendingWhiteId) : undefined;
    const ouvertureDuBouton = blanc && !blanc.connected ? blanc.lastSeen + GONE_MS + 500 : 0;
    // Idem pour la fin du délai de grâce du capitaine : il faut se réveiller pour la constater.
    const h = this.host();
    const finDeGrace = h && !h.connected && !h.gone ? h.lastSeen + HOST_GRACE_MS + 500 : 0;
    const g = this.s.game;
    const orateur = g?.phase === 'discuss' ? this.s.seats.find((p) => p.id === g.speakingOrder[this.s.turn]) : undefined;
    const ouvertureDuTour = orateur && !orateur.connected ? orateur.lastSeen + TOUR_ABSENT_MS + 500 : 0;
    const echeances = [this.s.voteUntil, this.s.guessUntil, ouvertureDuBouton, finDeGrace, ouvertureDuTour].filter((t) => t > now);
    const next = echeances.length ? Math.min(...echeances, now + SWEEP_MS) : now + SWEEP_MS;
    await this.ctx.storage.setAlarm(next);
  }

  private lastActivity(): number {
    return this.s.seats.reduce((max, p) => Math.max(max, p.lastSeen), this.s.createdAt);
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const code = (url.searchParams.get('code') || '').toUpperCase();

    if (url.pathname.endsWith('/exists')) {
      const vivant = this.s.seats.length > 0 && Date.now() - this.lastActivity() < IDLE_MS;
      return Response.json({ exists: vivant, code: this.s.code });
    }
    if (url.pathname.endsWith('/claim')) {
      const libre = this.s.seats.length === 0 || Date.now() - this.lastActivity() > IDLE_MS;
      if (!libre) return Response.json({ ok: false });
      this.s = {
        code,
        createdAt: Date.now(),
        hostId: null,
        seats: [],
        config: { undercovers: 1, mrWhite: true, lang: 'fr', pro: false },
        game: null,
        turn: 0,
        votes: {},
        voteUntil: 0,
        guessUntil: 0,
        lastElimination: null,
        whiteGuess: null,
      };
      await this.save();
      await this.planAlarm();
      return Response.json({ ok: true });
    }
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('attendu : websocket', { status: 426 });
    /*
     * Un salon n'existe que s'il a été RÉSERVÉ par « Créer un salon ». Sans cette garde, se
     * connecter à une adresse au hasard suffisait à en faire naître un : la liste des codes
     * grossiers devenait contournable, et un script pouvait en créer des centaines de milliers,
     * tous facturés au propriétaire.
     */
    if (!this.s.code) return new Response('salon inconnu', { status: 404 });

    /*
     * `acceptWebSocket` confie la connexion au runtime : le salon peut alors S'ENDORMIR entre deux
     * messages, connexions ouvertes, sans être facturé pendant ce temps.
     */
    const pair = new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  /** Le salon se réveille ici, avec son état relu depuis le stockage. */
  async webSocketMessage(ws: WebSocket, data: string | ArrayBuffer) {
    let msg: ClientMsg;
    try {
      msg = JSON.parse(typeof data === 'string' ? data : new TextDecoder().decode(data));
    } catch {
      return;
    }
    try {
      await this.onMessage(ws, msg);
    } catch (e) {
      this.send(ws, { t: 'error', code: 'bad-move', message: String((e as Error)?.message || e) });
    }
  }

  async webSocketClose(ws: WebSocket) {
    await this.onBye(ws);
  }

  async webSocketError(ws: WebSocket) {
    await this.onBye(ws);
  }

  /**
   * Une connexion tombe. On note l'absence, et RIEN d'autre : pas de siège supprimé, pas de tour
   * sauté, pas de vote dépouillé. Sans quoi passer sur WhatsApp pour partager le code suffirait à
   * effacer le salon qu'on vient de créer.
   */
  /**
   * On ne quitte l'écran du mot que lorsque TOUT LE MONDE l'a vu : personne ne joue sans le sien.
   * À vérifier aussi quand quelqu'un s'en va — sinon la table attend éternellement le mot d'un
   * joueur qui n'est plus là, et plus rien n'a de raison d'être émis.
   */
  private verifierRevelation() {
    const assis = this.s.seats.filter((p) => !p.gone);
    if (this.s.game?.phase === 'reveal' && assis.length > 0 && assis.every((p) => p.seen)) this.startDiscussion();
  }

  private async onBye(ws: WebSocket) {
    const seatId = this.seatOf(ws);
    if (!seatId) return;
    // Une connexion fantôme qui se ferme APRÈS le retour du joueur ne doit rien marquer.
    const vivante = this.ctx
      .getWebSockets()
      .some((o) => o !== ws && this.seatOf(o) === seatId && o.readyState === WebSocket.READY_STATE_OPEN);
    if (vivante) return;
    const seat = this.s.seats.find((p) => p.id === seatId);
    if (!seat) return;
    seat.connected = false;
    seat.lastSeen = Date.now();
    this.passHostIfNeeded();
    await this.save();
    // Ce départ peut ouvrir un droit vingt secondes plus tard : il faut programmer ce réveil-là.
    await this.planAlarm();
    this.broadcast();
  }

  /** À qui appartient cette connexion ? L'étiquette survit au sommeil du salon. */
  private seatOf(ws: WebSocket): string {
    const att = ws.deserializeAttachment() as { seatId?: string } | null;
    return att?.seatId ?? '';
  }

  /** La connexion VIVANTE de ce siège (jamais une socket fantôme : le mot secret y serait perdu). */
  private socketOf(seatId: string): WebSocket | undefined {
    const toutes = this.ctx.getWebSockets().filter((ws) => this.seatOf(ws) === seatId);
    return toutes.find((ws) => ws.readyState === WebSocket.READY_STATE_OPEN) ?? toutes[0];
  }

  async alarm() {
    const now = Date.now();
    /*
     * Le capitanat se vérifie ICI. À l'instant où le capitaine se déconnecte, son absence dure
     * zéro seconde : le délai de grâce ne peut donc jamais expirer pendant sa déconnexion. Sans ce
     * réveil, un capitaine qui éteint son téléphone laissait le salon sans chef, et plus personne
     * ne pouvait lancer le vote ni rejouer.
     */
    this.passHostIfNeeded();
    // Échéance du vote : on dépouille avec ce qu'on a plutôt que d'attendre un absent.
    if (this.s.voteUntil && now >= this.s.voteUntil && this.s.game?.phase === 'vote') {
      this.resolveVotes(true);
      await this.save();
      this.broadcast();
    }
    /*
     * Échéance de la dernière chance. Sans elle, un carton blanc qui ne revient jamais fige la
     * partie POUR TOUJOURS : lui seul peut proposer un mot, et personne ne peut juger une
     * proposition qui n'existe pas. Passé le délai, la manche reprend sans lui.
     */
    if (this.s.guessUntil && now >= this.s.guessUntil && this.s.game?.phase === 'whiteGuess') {
      this.applyGuess(this.s.whiteGuess?.guess ?? '', false);
      await this.save();
      this.broadcast();
    }
    // Rien n'a peut-être changé côté règles, mais l'écran attend peut-être une nouvelle vue.
    if (this.s.game?.phase === 'whiteGuess' || this.s.game?.phase === 'discuss') this.broadcast();
    if (now - this.lastActivity() > IDLE_MS) {
      // On prévient les téléphones encore ouverts : sinon ils affichent « connecté » dans le vide.
      for (const w of this.ctx.getWebSockets()) {
        try {
          w.close(4002, 'salon expiré');
        } catch {
          /* déjà fermée */
        }
      }
      await this.ctx.storage.deleteAll();
      this.s = {
        ...this.s,
        code: '',
        seats: [],
        game: null,
        hostId: null,
        votes: {},
        turn: 0,
        voteUntil: 0,
        guessUntil: 0,
        lastElimination: null,
        whiteGuess: null,
      };
      return;
    }
    await this.planAlarm();
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
    for (const ws of this.ctx.getWebSockets()) {
      const id = this.seatOf(ws);
      if (id) this.send(ws, { t: 'room', room: view, you: id });
    }
  }

  private sendPrivate(id: string) {
    const ws = this.socketOf(id);
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

  /** Le capitanat ne bouge qu'après une vraie absence : verrouiller son écran ne le fait pas perdre. */
  private passHostIfNeeded() {
    const h = this.host();
    if (h && !h.gone && (h.connected || Date.now() - h.lastSeen < HOST_GRACE_MS)) return;
    const next = this.s.seats.find((p) => p.connected && !p.gone) ?? this.s.seats.find((p) => !p.gone);
    this.s.hostId = next ? next.id : null;
  }

  private async onMessage(ws: WebSocket, msg: ClientMsg) {
    if (msg.t === 'ping') {
      this.send(ws, { t: 'pong' });
      return;
    }

    if (msg.t === 'hello') {
      const name = cleanName(msg.name) || 'Joueur';
      if (name.length < 2 || badWord(name)) {
        this.send(ws, { t: 'error', code: 'bad-name', message: 'Ce pseudo ne passe pas. Choisis-en un autre.' });
        return;
      }
      let seat = this.s.seats.find((p) => p.id === msg.seatId);
      if (seat) {
        // Un siège existant ne se reprend qu'avec son secret : sinon n'importe qui lirait ce mot.
        if (!msg.token || msg.token !== seat.token) {
          this.send(ws, { t: 'error', code: 'taken', message: 'Ce siège appartient à un autre joueur.' });
          return;
        }
        seat.name = name;
        seat.connected = true;
        seat.gone = false;
        seat.lastSeen = Date.now();
      } else {
        if (this.s.game) {
          this.send(ws, { t: 'error', code: 'started', message: 'La partie a déjà commencé.' });
          return;
        }
        if (this.s.seats.filter((p) => !p.gone).length >= MAX_PLAYERS) {
          this.send(ws, { t: 'error', code: 'full', message: 'Le salon est complet.' });
          return;
        }
        seat = {
          id: msg.seatId,
          token: newToken(),
          name,
          color: COLORS[this.s.seats.length % COLORS.length],
          connected: true,
          seen: false,
          points: 0,
          lastSeen: Date.now(),
          gone: false,
        };
        this.s.seats.push(seat);
      }
      // Le code vient de la réservation, jamais du téléphone.
      if (!this.s.hostId) this.s.hostId = seat.id;

      // On étiquette la NOUVELLE connexion d'abord : le mot secret ne doit jamais partir sur l'ancienne.
      ws.serializeAttachment({ seatId: seat.id });
      for (const autre of this.ctx.getWebSockets()) {
        if (autre !== ws && this.seatOf(autre) === seat.id) {
          try {
            autre.close(4000, 'remplacé');
          } catch {
            /* déjà fermée */
          }
        }
      }
      this.send(ws, { t: 'welcome', seatId: seat.id, token: seat.token });
      await this.save();
      await this.planAlarm();
      this.broadcast();
      this.sendPrivate(seat.id);
      return;
    }

    const seatId = this.seatOf(ws);
    if (!seatId) return;
    const me = this.s.seats.find((p) => p.id === seatId);
    if (!me) return;
    me.lastSeen = Date.now();
    me.connected = true;
    const isHost = this.s.hostId === seatId;

    switch (msg.t) {
      case 'config': {
        if (!isHost || this.s.game) return this.deny(ws, isHost);
        const cfg = { ...this.s.config };
        if (typeof msg.undercovers === 'number') cfg.undercovers = msg.undercovers;
        if (typeof msg.mrWhite === 'boolean') cfg.mrWhite = msg.mrWhite;
        // Une langue inconnue faisait échouer toute distribution, et le réglage restait sur disque.
        if (msg.lang === 'fr' || msg.lang === 'en') cfg.lang = msg.lang;
        if (typeof msg.pro === 'boolean') cfg.pro = msg.pro;
        /*
         * On garde L'INTENTION du capitaine telle quelle. La ramener à ce que permet la table
         * ACTUELLE effacerait ses réglages à chaque message reçu pendant que le salon est encore
         * vide : à un seul joueur, aucune table n'accepte d'imposteur, et le carton blanc
         * disparaissait en silence de toutes les parties. Les bornes sont appliquées au moment
         * qui compte, quand la partie démarre et que la table est enfin connue.
         */
        cfg.undercovers = Math.min(3, Math.max(0, Math.floor(cfg.undercovers)));
        this.s.config = cfg;
        break;
      }
      case 'start': {
        if (!isHost || this.s.game) return this.deny(ws, isHost);
        if (this.s.seats.filter((p) => !p.gone).length < MIN_PLAYERS) {
          this.send(ws, { t: 'error', code: 'bad-move', message: `Il faut au moins ${MIN_PLAYERS} joueurs.` });
          return;
        }
        this.newGame();
        break;
      }
      case 'seen': {
        me.seen = true;
        this.verifierRevelation();
        break;
      }
      case 'ready': {
        // Le capitaine passe outre quand quelqu'un ne revient pas : la soirée ne s'arrête pas pour lui.
        if (!isHost) return this.deny(ws, isHost);
        if (this.s.game?.phase === 'reveal') this.startDiscussion();
        break;
      }
      case 'spoke': {
        const g = this.s.game;
        if (!g || g.phase !== 'discuss') return;
        if (g.speakingOrder[this.s.turn] !== seatId) return;
        this.s.turn += 1;
        this.avancerSiPartis();
        break;
      }
      case 'skip': {
        const g = this.s.game;
        if (!g || g.phase !== 'discuss') return;
        if (!isHost && !this.orateurAbsent()) return this.deny(ws, isHost);
        if (this.s.turn < g.speakingOrder.length) this.s.turn += 1;
        this.avancerSiPartis();
        break;
      }
      case 'toVote': {
        if (!isHost) return this.deny(ws, isHost);
        if (!this.s.game || this.s.game.phase !== 'discuss') return;
        this.s.game = goToVote(this.s.game);
        this.s.votes = {};
        this.s.turn = 0;
        this.s.voteUntil = Date.now() + VOTE_MS;
        await this.planAlarm();
        break;
      }
      case 'vote': {
        const g = this.s.game;
        if (!g || g.phase !== 'vote') return;
        const voter = g.players.find((p) => p.id === seatId);
        const target = g.players.find((p) => p.id === msg.target);
        if (!voter?.alive || !target?.alive) return;
        this.s.votes[seatId] = msg.target;
        this.resolveVotes(false);
        break;
      }
      case 'guess': {
        const g = this.s.game;
        if (!g || g.phase !== 'whiteGuess' || g.pendingWhiteId !== seatId) return;
        const text = String(msg.text || '').slice(0, 40);
        const white = g.players.find((p) => p.id === seatId);
        // UNE SEULE proposition, comme à table. Sinon on énumère la liste des mots jusqu'à gagner.
        if (this.s.whiteGuess?.guess) return;
        this.s.whiteGuess = { id: seatId, name: white?.name ?? '', guess: text };
        if (acceptsGuessAlone(text, g.civilWord)) this.applyGuess(text, true);
        break;
      }
      case 'judge': {
        const g = this.s.game;
        if (!g || g.phase !== 'whiteGuess') return;
        // Sans proposition, on ne tranche que si le carton blanc a vraiment quitté la table.
        if (!this.s.whiteGuess?.guess && !this.blancParti()) return;
        /*
         * N'importe quel joueur présent tranche, SAUF le carton blanc lui-même. Le capitaine n'a
         * aucun privilège ici : s'il était le seul juge et qu'il tirait le carton blanc, la partie
         * se figerait pour toujours.
         */
        if (seatId === g.pendingWhiteId) return;
        if (me.gone) return; // Un joueur parti ne tranche pas la partie des autres.
        this.applyGuess(this.s.whiteGuess?.guess ?? '', msg.correct);
        break;
      }
      case 'again': {
        /*
         * Seulement une fois la partie finie. Sans cette garde, le capitaine pouvait retirer les
         * rôles en boucle jusqu'à tomber sur celui qui rapporte le plus — il voyait le sien à
         * chaque tirage — et annuler d'un seul geste une partie mal engagée.
         */
        if (!isHost) return this.deny(ws, isHost);
        if (this.s.game && this.s.game.phase !== 'over') return;
        this.newGame();
        break;
      }
      case 'toLobby': {
        // Revenir au salon d'attente : c'est le seul moment où de nouveaux amis peuvent entrer.
        if (!isHost) return this.deny(ws, isHost);
        // Depuis N'IMPORTE QUELLE phase : c'est la porte de secours d'une table qui tourne en rond.
        this.s.game = null;
        this.s.votes = {};
        this.s.turn = 0;
        this.s.voteUntil = 0;
        this.s.guessUntil = 0;
        this.s.lastElimination = null;
        this.s.whiteGuess = null;
        for (const p of this.s.seats) p.seen = false;
        for (const w of this.ctx.getWebSockets()) this.send(w, { t: 'private', priv: null });
        break;
      }
      case 'kick': {
        if (!isHost || this.s.game) return this.deny(ws, isHost);
        this.s.seats = this.s.seats.filter((p) => p.id !== msg.target);
        const ws2 = this.socketOf(msg.target);
        if (ws2) {
          this.send(ws2, { t: 'error', code: 'kicked', message: 'Tu as été retiré du salon.' });
          try {
            ws2.close(4001, 'expulsé');
          } catch {
            /* déjà fermée */
          }
        }
        break;
      }
      case 'leave': {
        // Départ explicite : là, oui, le siège est libéré.
        me.gone = true;
        me.connected = false;
        if (!this.s.game) this.s.seats = this.s.seats.filter((p) => p.id !== seatId);
        this.passHostIfNeeded();
        this.verifierRevelation();
        this.avancerSiPartis();
        break;
      }
      case 'report': {
        /*
         * Signalement : le salon n'a pas de base de données, mais la trace part dans le journal
         * Cloudflare, consultable par Arsène. C'est le minimum exigé dès qu'un joueur voit le
         * pseudo d'un autre (règle 1.2 d'Apple). Le blocage durable viendra avec les comptes.
         */
        const vise = this.s.seats.find((p) => p.id === msg.target);
        console.log(
          JSON.stringify({
            signalement: true,
            salon: this.s.code,
            par: me.name,
            vise: vise?.name ?? msg.target,
            quand: new Date().toISOString(),
          }),
        );
        this.send(ws, { t: 'reported' });
        return;
      }
    }
    await this.save();
    this.broadcast();
  }

  private deny(ws: WebSocket, isHost: boolean) {
    if (!isHost) this.send(ws, { t: 'error', code: 'not-host', message: 'Seul le capitaine peut faire ça.' });
  }

  private startDiscussion() {
    const g = this.s.game;
    if (!g) return;
    this.s.game = { ...g, phase: 'discuss', revealIndex: g.players.length };
    this.s.turn = 0;
    this.avancerSiPartis();
  }

  private newGame() {
    const assis = this.s.seats.filter((p) => !p.gone);
    const seats: Seat[] = assis.map((p) => ({ id: p.id, name: p.name, avatar: '⚽', color: p.color, photo: null }));
    const cfg = clampConfig(seats.length, { undercovers: this.s.config.undercovers, mrWhite: this.s.config.mrWhite });
    this.s.game = createGame(seats, cfg, groupsFor(this.s.config.pro), { lang: this.s.config.lang });
    this.s.votes = {};
    this.s.turn = 0;
    this.s.voteUntil = 0;
    this.s.guessUntil = 0;
    this.s.lastElimination = null;
    this.s.whiteGuess = null;
    for (const p of this.s.seats) p.seen = false;
    for (const ws of this.ctx.getWebSockets()) {
      const id = this.seatOf(ws);
      if (id) this.send(ws, { t: 'private', priv: this.privateOf(id) });
    }
  }

  /**
   * Dépouillement. Deux chemins :
   *   - tout le monde a voté, c'est le cas normal ;
   *   - l'échéance est tombée (`force`), et alors il faut un quorum : au moins la moitié des
   *     joueurs en vie. Sans ce garde-fou, un seul joueur réveillé déciderait de l'élimination.
   */
  private resolveVotes(force: boolean) {
    const g = this.s.game;
    if (!g || g.phase !== 'vote') return;
    const alive = g.players.filter((p) => p.alive);
    const exprimes = alive.filter((p) => this.s.votes[p.id]).length;
    /*
     * Le quorum se compte sur les joueurs JOIGNABLES, pas sur l'effectif théorique. Compté sur
     * l'effectif, une table dont la moitié a éteint son téléphone n'atteignait jamais le quorum :
     * le dépouillement repartait en discussion, le capitaine relançait, et la soirée tournait en
     * rond sans fin. Deux voix restent le minimum pour éliminer quelqu'un.
     */
    const joignables = alive.filter((p) => {
      const seat = this.s.seats.find((x) => x.id === p.id);
      return !!seat && !seat.gone && (seat.connected || Date.now() - seat.lastSeen < JOIGNABLE_MS);
    });
    const quorum = Math.min(alive.length, Math.max(2, Math.ceil(joignables.length / 2)));
    if (!force) {
      /*
       * On dépouille dès que TOUS LES PRÉSENTS ont voté, à condition qu'ils soient assez nombreux.
       * Les deux moitiés de la règle comptent : sans la première, trois joueurs attendraient
       * 90 secondes un copain parti se coucher ; sans la seconde, un seul joueur réveillé
       * éliminerait qui il veut pendant que les autres sont sur Discord.
       */
      const presents = alive.filter((p) => this.s.seats.find((x) => x.id === p.id)?.connected);
      const tousOntVote = presents.length > 0 && presents.every((p) => this.s.votes[p.id]);
      if (!tousOntVote || exprimes < quorum) return;
    }
    if (force && exprimes < quorum) {
      // Pas assez de monde : personne n'est éliminé, le groupe se retrouve et revote.
      this.s.votes = {};
      this.s.voteUntil = 0;
      this.s.game = { ...g, phase: 'discuss' };
      this.s.turn = 0;
      this.s.lastElimination = null;
      return;
    }

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
    this.s.voteUntil = 0;
    if (best.length !== 1) {
      // Égalité : personne n'est éliminé, la manche repart.
      this.s.game = { ...g, phase: 'discuss', speakingOrder: nextRoundOrder(g), round: g.round + 1 };
      this.s.lastElimination = null;
      this.s.turn = 0;
      return;
    }
    const outId = best[0];
    const out = g.players.find((p) => p.id === outId)!;
    const after = eliminate(g, outId);
    this.s.lastElimination = { id: out.id, name: out.name, role: out.role };
    this.s.game = after;
    this.s.turn = 0;
    if (after.phase === 'whiteGuess') {
      this.s.whiteGuess = { id: outId, name: out.name, guess: null };
      this.s.guessUntil = Date.now() + GUESS_MS;
      void this.planAlarm();
    }
    if (after.phase === 'over') this.awardPoints(after);
  }

  /**
   * Le carton blanc a-t-il quitté la table ? Une coupure de quelques secondes n'en est pas une :
   * verrouiller son écran pour aller écrire dans WhatsApp arrive à chaque manche. Au-delà, le
   * groupe peut reprendre sans lui. Cette règle sert AUSSI à afficher le bouton, pour qu'il
   * n'apparaisse jamais avant que le salon ne l'accepte.
   */
  /**
   * L'orateur en cours s'est-il absenté assez longtemps pour qu'on passe au suivant sans lui ?
   * Cette règle sert au salon ET à l'écran : sans ça, le bouton apparaissait quinze secondes trop
   * tôt et le joueur qui appuyait recevait « seul le capitaine peut faire ça » en rouge.
   */
  private orateurAbsent(): boolean {
    const g = this.s.game;
    if (!g || g.phase !== 'discuss') return false;
    const orateur = this.s.seats.find((p) => p.id === g.speakingOrder[this.s.turn]);
    if (!orateur) return false;
    // Un joueur qui a claqué la porte ne revient pas : inutile de lui laisser quinze secondes.
    if (orateur.gone) return true;
    return !orateur.connected && Date.now() - orateur.lastSeen > TOUR_ABSENT_MS;
  }

  /**
   * Le tour de parole saute tout seul ceux qui ont quitté la table. Sans ça, la manche attendait
   * la parole de quelqu'un qui a fermé l'application pour de bon, et il fallait que quelqu'un
   * pense à appuyer sur « Passer au suivant » pour chacun d'eux.
   */
  private avancerSiPartis() {
    const g = this.s.game;
    if (!g || g.phase !== 'discuss') return;
    while (this.s.turn < g.speakingOrder.length) {
      const seat = this.s.seats.find((p) => p.id === g.speakingOrder[this.s.turn]);
      if (seat && !seat.gone) break;
      this.s.turn += 1;
    }
  }

  private blancParti(): boolean {
    const id = this.s.game?.pendingWhiteId;
    const blanc = this.s.seats.find((p) => p.id === id);
    return !!blanc && !blanc.connected && Date.now() - blanc.lastSeen > GONE_MS;
  }

  private applyGuess(text: string, correct: boolean) {
    const g = this.s.game;
    if (!g) return;
    this.s.guessUntil = 0;
    const after = resolveWhiteGuess(g, text, correct);
    this.s.game = after;
    this.s.whiteGuess = { ...(this.s.whiteGuess ?? { id: '', name: '' }), guess: text } as RoomView['whiteGuess'];
    this.s.turn = 0;
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
    /*
     * Un joueur parti EN COURS DE PARTIE reste affiché. Le cacher était la panne la plus grave du
     * mode en ligne : son nom restait dans l'ordre de parole alors qu'il avait disparu de la
     * liste, et l'écran des autres plantait. Le cacher le rendait aussi INÉLIMINABLE — son camp
     * gagnait par forfait. Il reste donc à table, marqué absent, jusqu'à la fin de la manche.
     */
    const assis = this.s.seats.filter((p) => !p.gone || g?.players.some((x) => x.id === p.id));
    const players: RoomPlayer[] = assis.map((seat) => {
      const gp = g?.players.find((p) => p.id === seat.id);
      return {
        id: seat.id,
        name: seat.name,
        color: seat.color,
        host: seat.id === this.s.hostId,
        connected: seat.connected,
        gone: seat.gone,
        alive: gp ? gp.alive : true,
        seen: seat.seen,
        voted: !!this.s.votes[seat.id],
        role: gp ? revealed(gp) : null,
        points: seat.points,
      };
    });
    const phase: RoomView['phase'] = !g ? 'lobby' : (g.phase as RoomView['phase']);
    const n = assis.filter((p) => !p.gone).length;
    const blocked = n < MIN_PLAYERS ? `Il faut au moins ${MIN_PLAYERS} joueurs (vous êtes ${n}).` : null;
    return {
      code: this.s.code,
      phase,
      round: g?.round ?? 0,
      players,
      // On n'annonce jamais un orateur absent de la liste : l'écran ne doit rien avoir à deviner.
      speakingOrder: g?.phase === 'discuss' ? g.speakingOrder.filter((id) => players.some((p) => p.id === id)) : [],
      turnId: g?.phase === 'discuss' ? (g.speakingOrder[this.s.turn] ?? null) : null,
      config: { undercovers: this.s.config.undercovers, mrWhite: this.s.config.mrWhite, lang: this.s.config.lang },
      category: g ? g.pair.cat : null,
      voteEndsIn: this.s.voteUntil ? Math.max(0, Math.round((this.s.voteUntil - Date.now()) / 1000)) : null,
      guessEndsIn: this.s.guessUntil ? Math.max(0, Math.round((this.s.guessUntil - Date.now()) / 1000)) : null,
      canSkipWhite: this.s.game?.phase === 'whiteGuess' && !this.s.whiteGuess?.guess && this.blancParti(),
      canSkipTurn: this.orateurAbsent(),
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
