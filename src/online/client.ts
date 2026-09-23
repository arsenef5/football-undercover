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

const BASE: string =
  (import.meta.env.VITE_ONLINE_URL as string | undefined) ??
  (import.meta.env.DEV ? 'http://127.0.0.1:8787' : 'https://salons.football-undercover.workers.dev');

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
  return localStorage.getItem(ROOM_KEY);
}

export function forgetRoom() {
  localStorage.removeItem(ROOM_KEY);
}

export function newSeatId(): string {
  const k = 'fu.seat.v1';
  let id = localStorage.getItem(k);
  if (!id) {
    id = `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
    localStorage.setItem(k, id);
  }
  return id;
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
    // On note le salon : si l'app est tuée (iOS le fait sans prévenir), on saura où revenir.
    localStorage.setItem(ROOM_KEY, code);
    this.closed = false;
    this.open();
    // Retour au premier plan : iOS a coupé la connexion, on la refait immédiatement.
    document.addEventListener('visibilitychange', this.onVisible);
  }

  private onVisible = () => {
    if (document.visibilityState === 'visible' && !this.closed && this.ws?.readyState !== WebSocket.OPEN) {
      this.retry = 0;
      this.open();
    }
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
      if (m.t === 'room') this.emit({ room: m.room, me: m.you, status: 'live', error: null });
      else if (m.t === 'private') this.emit({ priv: m.priv });
      else if (m.t === 'welcome') rememberToken(this.identity?.code ?? '', m.token);
      else if (m.t === 'reported') this.emit({ error: null });
      else if (m.t === 'error') {
        this.emit({ error: m.message });
        // Refusé à l'entrée : se reconnecter en boucle ne ferait que répéter le refus.
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
      if (ev.code === 4000 || ev.code === 4001) {
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

  send(m: ClientMsg) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(m));
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
