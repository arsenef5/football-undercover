/**
 * MODE EN LIGNE 🌐 — le téléphone parle au salon.
 *
 * Deux principes qui viennent de la réalité du terrain :
 *
 * 1. SUR IPHONE, LA CONNEXION TOMBE TOUT LE TEMPS. Dès que l'app passe en arrière-plan (écran
 *    verrouillé, message reçu, appel), iOS arrête d'exécuter le JavaScript et la connexion meurt.
 *    Ce n'est pas un bug : c'est le fonctionnement normal. La reconnexion n'est donc pas un filet
 *    de sécurité, c'est le cas COURANT — d'où la reconnexion automatique dès le retour à l'écran.
 * 2. LE TÉLÉPHONE NE GARDE RIEN. Il ne connaît que ce que le salon lui envoie : la vue publique,
 *    et sa propre part privée. Au retour, il redemande tout.
 */
import type { ClientMsg, PrivateView, RoomView, ServerMsg } from './protocol';

/*
 * ADRESSE DU SERVEUR DE SALONS.
 *
 * En développement, le salon tourne sur cette machine (`npm run salon`).
 * En production, l'adresse dépend du compte Cloudflare : `wrangler deploy` l'affiche à la fin, et
 * elle doit être mise dans VITE_ONLINE_URL au moment de la compilation. Elle ne peut pas être
 * devinée ici — une adresse inventée donnerait un bouton qui tourne dans le vide sur le téléphone
 * de tout le monde. Tant qu'elle manque, le mode en ligne s'annonce comme pas encore ouvert.
 */
const BASE: string =
  (import.meta.env.VITE_ONLINE_URL as string | undefined) ?? (import.meta.env.DEV ? 'http://127.0.0.1:8787' : '');

/** Le serveur de salons est-il joignable dans cette version de l'app ? */
export const ONLINE_OUVERT = BASE !== '';

export interface OnlineState {
  status: 'idle' | 'connecting' | 'live' | 'lost';
  room: RoomView | null;
  me: string | null;
  priv: PrivateView | null;
  error: string | null;
}

type Listener = (s: OnlineState) => void;

/** Dernier salon rejoint, pour proposer de reprendre la partie au retour. */
export const ROOM_KEY = 'fu.online.room';
/** Secret remis par le salon : c'est lui qui prouve que ce siège est le nôtre. */
const TOKEN_KEY = 'fu.online.token';

function tokenFor(code: string): string | undefined {
  try {
    const all = JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') as Record<string, string>;
    return all[code];
  } catch {
    return undefined;
  }
}

function rememberToken(code: string, token: string) {
  try {
    const all = JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}') as Record<string, string>;
    all[code] = token;
    localStorage.setItem(TOKEN_KEY, JSON.stringify(all));
  } catch {
    /* stockage plein ou bloqué : on jouera sans reprise possible */
  }
}

export function lastRoom(): string | null {
  try {
    return localStorage.getItem(ROOM_KEY);
  } catch {
    return null;
  }
}

export function forgetRoom() {
  try {
    localStorage.removeItem(ROOM_KEY);
  } catch {
    /* rien à effacer */
  }
}

const SEAT_KEY = 'fu.seat.v1';
let siegeEnMemoire = '';

export function newSeatId(): string {
  try {
    const id = localStorage.getItem(SEAT_KEY);
    if (id) return id;
  } catch {
    /* stockage bloqué : on retombe sur la mémoire vive */
  }
  if (!siegeEnMemoire) siegeEnMemoire = `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  try {
    localStorage.setItem(SEAT_KEY, siegeEnMemoire);
  } catch {
    /* on jouera quand même, simplement sans reprise après fermeture de l'app */
  }
  return siegeEnMemoire;
}

/** Repartir avec un siège neuf : le seul recours quand le secret de l'ancien s'est perdu. */
export function oublierSiege() {
  siegeEnMemoire = '';
  try {
    localStorage.removeItem(SEAT_KEY);
  } catch {
    /* rien à effacer */
  }
}

export async function createRoom(): Promise<string> {
  const res = await fetch(`${BASE}/api/rooms`, { method: 'POST' });
  if (!res.ok) throw new Error('serveur indisponible');
  const { code } = (await res.json()) as { code: string };
  return code;
}

export async function roomExists(code: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/rooms/${code}`);
    const { exists } = (await res.json()) as { exists: boolean };
    return exists;
  } catch {
    return false;
  }
}

export class OnlineClient {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private retry = 0;
  private timer = 0;
  private closed = false;
  private identity: { code: string; name: string; color: string } | null = null;

  state: OnlineState = { status: 'idle', room: null, me: null, priv: null, error: null };

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private emit(patch: Partial<OnlineState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l(this.state));
  }

  connect(code: string, name: string, color: string) {
    this.identity = { code, name, color };
    /*
     * Une nouvelle connexion annule tout geste resté en attente, à commencer par un départ. Sans
     * ça, un « je quitte » émis hors ligne puis suivi d'un retour dans le salon vidait le siège
     * juste après l'avoir repris.
     */
    this.enAttente = null;
    this.siegeRefait = false;
    // On note le salon : si l'app est tuée (iOS le fait sans prévenir), on saura où revenir.
    try {
      localStorage.setItem(ROOM_KEY, code);
    } catch {
      /* navigation privée ou stockage plein : on joue, on ne pourra juste pas proposer de reprendre */
    }
    this.closed = false;
    this.open();
    // Retour au premier plan : iOS a coupé la connexion, on la refait immédiatement.
    document.addEventListener('visibilitychange', this.onVisible);
  }

  /** Dernier signe de vie reçu du salon : sert à démasquer une connexion morte restée « ouverte ». */
  private dernierSigne = 0;
  /** On ne reprend un siège neuf qu'une fois : sinon un vrai refus tournerait en boucle. */
  private siegeRefait = false;

  private onVisible = () => {
    if (document.visibilityState !== 'visible' || this.closed) return;
    if (this.ws?.readyState !== WebSocket.OPEN) {
      this.retry = 0;
      this.open();
      return;
    }
    /*
     * La connexion se DIT ouverte — ça ne prouve rien. Quand le téléphone passe du Wi-Fi à la 4G,
     * l'ancienne prise reste « ouverte » pour toujours : aucune fermeture n'arrive, rien n'est
     * livré, et le joueur paraît présent aux autres tout en bloquant chaque manche. On demande donc
     * un signe de vie, et sans réponse on refait la connexion.
     */
    this.send({ t: 'ping' });
    const avant = this.dernierSigne;
    window.setTimeout(() => {
      if (this.closed || this.dernierSigne !== avant) return;
      this.retry = 0;
      this.open();
    }, 4000);
  };

  private open() {
    if (!this.identity) return;
    window.clearTimeout(this.timer);
    // Une ancienne connexion encore debout relancerait la boucle de reconnexion à sa fermeture.
    const vieille = this.ws;
    if (vieille) {
      vieille.onclose = null;
      vieille.onerror = null;
      vieille.onmessage = null;
      try {
        vieille.close();
      } catch {
        /* déjà fermée */
      }
    }
    this.emit({ status: this.state.room ? 'lost' : 'connecting', error: null });
    const url = `${BASE.replace(/^http/, 'ws')}/ws?code=${this.identity.code}`;
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      this.scheduleRetry();
      return;
    }
    this.ws = ws;
    ws.onopen = () => {
      this.retry = 0;
      const { code, name, color } = this.identity!;
      this.send({ t: 'hello', code, seatId: newSeatId(), name, color, token: tokenFor(code) });
      this.emit({ status: 'live' });
    };
    ws.onmessage = (ev) => {
      let m: ServerMsg;
      try {
        m = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      this.dernierSigne = Date.now();
      if (m.t === 'room') {
        this.emit({ room: m.room, me: m.you, status: 'live', error: null });
        this.rejouerSiValide(m.room);
      }
      else if (m.t === 'private') this.emit({ priv: m.priv });
      else if (m.t === 'welcome') rememberToken(this.identity?.code ?? '', m.token);
      else if (m.t === 'reported') this.emit({ error: null });
      else if (m.t === 'error') {
        this.emit({ error: m.message });
        // Refusé à l'entrée : se reconnecter en boucle ne ferait que répéter le refus.
        /*
         * « Ce siège appartient à un autre joueur » alors que c'est le nôtre : le secret du siège
         * s'est perdu (l'app a été suspendue avant de le ranger). On revient une fois en nouvel
         * arrivant plutôt que d'être banni de sa propre soirée.
         */
        if (m.code === 'taken' && !this.siegeRefait) {
          this.siegeRefait = true;
          oublierSiege();
          this.retry = 0;
          this.open();
          return;
        }
        if (m.code === 'kicked' || m.code === 'taken' || m.code === 'full' || m.code === 'started' || m.code === 'bad-name') {
          this.closed = true;
          try {
            this.ws?.close();
          } catch {
            /* déjà fermée */
          }
          this.emit({ status: 'idle', room: null });
        }
      }
    };
    ws.onclose = (ev) => {
      // 4000 = une autre fenêtre a pris le siège, 4001 = expulsé. Dans les deux cas on ne revient pas.
      // 4002 = le salon a expiré au bout de deux heures sans personne.
      if (ev.code === 4000 || ev.code === 4001 || ev.code === 4002) {
        this.closed = true;
        this.emit({ status: 'idle', room: null });
        return;
      }
      if (!this.closed) this.scheduleRetry();
    };
    ws.onerror = () => {
      /* onclose suit toujours */
    };
  }

  private scheduleRetry() {
    this.emit({ status: 'lost' });
    const wait = Math.min(8000, 400 * 2 ** this.retry++);
    this.timer = window.setTimeout(() => this.open(), wait);
  }

  /**
   * Un appui pendant une coupure ne doit pas disparaître en silence : on garde la dernière
   * intention de jeu et on la renvoie quand la connexion revient. C'est fréquent, le réseau mobile
   * lâche pile au moment où l'on vote.
   *
   * Mais on la DATE. Un vote tapé à la manche 1 et livré trois minutes plus tard tomberait sur la
   * manche 3, contre quelqu'un d'autre, sans que le joueur ait retouché son téléphone. On note donc
   * la manche et la phase du geste, et on le jette s'il ne correspond plus à ce qu'on retrouve.
   */
  private enAttente: { msg: ClientMsg; round: number; phase: string } | null = null;

  send(m: ClientMsg) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(m));
      return;
    }
    // `leave` en fait partie : sans lui, le siège reste occupé par un fantôme pendant deux heures.
    const differable = m.t === 'vote' || m.t === 'spoke' || m.t === 'guess' || m.t === 'seen' || m.t === 'judge' || m.t === 'leave';
    // On ne diffère rien tant qu'on n'est dans aucun salon : il n'y aurait rien à y appliquer.
    if (differable && this.state.room) {
      this.enAttente = { msg: m, round: this.state.room.round, phase: this.state.room.phase };
    }
  }

  /** Le geste mis de côté vaut-il encore ? On ne le rejoue que dans la manche où il a été fait. */
  private rejouerSiValide(room: OnlineState['room']) {
    const attente = this.enAttente;
    if (!attente || !room) return;
    this.enAttente = null;
    if (attente.msg.t === 'leave' || (attente.round === room.round && attente.phase === room.phase)) {
      this.send(attente.msg);
    }
  }

  leave() {
    // Départ explicite : le salon libère le siège au lieu de nous croire simplement absents.
    this.send({ t: 'leave' });
    this.closed = true;
    forgetRoom();
    document.removeEventListener('visibilitychange', this.onVisible);
    window.clearTimeout(this.timer);
    try {
      this.ws?.close();
    } catch {
      /* déjà fermée */
    }
    this.ws = null;
    this.emit({ status: 'idle', room: null, me: null, priv: null, error: null });
  }
}
