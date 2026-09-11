/**
 * MODE CRÉATEUR 🎥 — moteur de composition vidéo.
 *
 * La caméra frontale est dessinée dans un canvas 1080×1920 (9:16) à 30 images/s, et les
 * incrustations (nom + mot à la révélation, ordre de parole, votes, élimination, résultat)
 * sont peintes par-dessus en temps réel. Le canvas + le micro alimentent un MediaRecorder :
 * la vidéo obtenue est « montée » à la sortie, sans logiciel.
 *
 * Direction artistique = celle de l'app : noir #0A0A0A, rouge #FF2B2B, blanc, typo large et
 * grasse. Aucune couleur de pastille : le rouge est le seul accent.
 *
 * Zones sûres TikTok / Reels : le bas (légende, compte, musique) et la colonne de droite
 * (boutons) sont couverts par l'interface des applis, le haut par la barre d'état. Toutes les
 * incrustations restent dans le rectangle SAFE_* ci-dessous.
 *
 * Sans caméra (refus, navigateur de bureau), on enregistre quand même les incrustations sur
 * un fond stade : le mode ne bloque jamais la partie.
 */
import archivoUrl from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url';
import type { Role } from '../game/types';
import { shareBlob } from './library';

export interface Face {
  name: string;
  photo?: string | null;
}

export type Scene =
  | { type: 'idle' }
  | { type: 'reveal'; face: Face; word: string | null; category: string; whiteLabel: string; wordLabel: string }
  | { type: 'discuss'; title: string; order: { face: Face; word: string | null; role: Role }[]; whiteLabel: string }
  | { type: 'guess'; face: Face; label: string }
  | { type: 'result'; title: string; sub: string; civilWord: string; undercoverWord: string; civilLabel: string; undercoverLabel: string };

export type Popup =
  | { kind: 'vote'; to: Face; label: string }
  | { kind: 'elim'; face: Face; role: Role; roleLabel: string; outLabel: string }
  | { kind: 'guess'; face: Face; correct: boolean; guess: string; label: string };

interface LivePopup {
  popup: Popup;
  at: number;
  duration: number;
}

export type RecorderStatus = 'idle' | 'preview' | 'recording' | 'stopped';

const W = 1080;
const H = 1920;
const FPS = 30;

/* Zones sûres (voir en-tête). */
const SAFE_TOP = 230;
const SAFE_BOTTOM = 1500;
const SAFE_LEFT = 60;
const SAFE_RIGHT = 900;
const SAFE_W = SAFE_RIGHT - SAFE_LEFT;
const SAFE_CX = (SAFE_LEFT + SAFE_RIGHT) / 2;

const RED = '#ff2b2b';
const BG = '#0a0a0a';
const TEXT = '#f5f5f5';
const MUTED = '#8e8e8e';
const PANEL = 'rgba(10,10,10,0.82)';
const LINE = 'rgba(255,255,255,0.10)';
const GREEN = '#37d67a';

const DISPLAY = '"FU Display", "Archivo Variable", Archivo, system-ui, sans-serif';

let fontsReady: Promise<void> | null = null;

/**
 * Le canvas n'utilise pas les @font-face CSS tant qu'elles ne sont pas chargées pour lui, et
 * retombe alors sur Arial sans jamais se corriger. On enregistre donc la police d'affichage de l'app
 * sous un nom dédié, chargée explicitement AVANT le premier dessin.
 */
export function ensureCanvasFonts(): Promise<void> {
  if (!fontsReady) {
    fontsReady = (async () => {
      if (typeof FontFace === 'undefined' || typeof document === 'undefined') return;
      try {
        const faces = [
          new FontFace('FU Display', `url(${archivoUrl})`, { weight: '100 900', stretch: '62% 125%' }),
        ];
        await Promise.all(
          faces.map(async (f) => {
            await f.load();
            document.fonts.add(f);
          }),
        );
      } catch {
        /* police de secours du système */
      }
    })();
  }
  return fontsReady;
}

type Listener = () => void;

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = clamp01(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Police d'affichage (large et grasse), comme les titres de l'app. */
function displayFont(ctx: CanvasRenderingContext2D, size: number, weight = 900) {
  // Largeur 125 % (axe wdth) : mot-clé dans le raccourci ET propriété, selon ce que le moteur accepte.
  ctx.font = `${weight} ${size}px ${DISPLAY}`;
  ctx.font = `${weight} expanded ${size}px ${DISPLAY}`;
  (ctx as unknown as { fontStretch?: string }).fontStretch = 'expanded';
}

function fitSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, max: number, min: number, weight = 900): number {
  let size = max;
  displayFont(ctx, size, weight);
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    displayFont(ctx, size, weight);
  }
  return size;
}

/** Découpe en lignes de mots entiers ; au-delà de maxLines, la dernière est tronquée avec « … ». */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (!line || ctx.measureText(test).width <= maxWidth) line = test;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    kept[maxLines - 1] = `${last}…`;
    return kept;
  }
  return lines;
}

/** Plus grande taille (max → min) où le texte tient en maxLines lignes au plus. La police reste réglée. */
function fitLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  max: number,
  min: number,
  maxLines: number,
  weight = 900,
): { size: number; lines: string[] } {
  for (let size = max; size >= min; size -= 2) {
    displayFont(ctx, size, weight);
    const lines = wrapText(ctx, text, maxWidth, maxLines + 1);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) return { size, lines };
  }
  displayFont(ctx, min, weight);
  return { size: min, lines: wrapText(ctx, text, maxWidth, maxLines) };
}

function initials(name: string): string {
  const parts = name.trim().split(/[\s\-_.]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function wordColor(role: Role): string {
  return role === 'undercover' ? RED : TEXT;
}

/** Panneau noir translucide, liseré fin, comme les cartes de l'app. */
function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 26, accent = false) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = PANEL;
  ctx.fill();
  ctx.restore();
  roundRect(ctx, x, y, w, h, r);
  ctx.lineWidth = 2;
  ctx.strokeStyle = LINE;
  ctx.stroke();
  if (accent) {
    // Barre rouge à gauche, lueur discrète.
    ctx.save();
    roundRect(ctx, x, y, w, h, r);
    ctx.clip();
    ctx.fillStyle = RED;
    ctx.shadowColor = 'rgba(255,43,43,0.8)';
    ctx.shadowBlur = 24;
    ctx.fillRect(x, y, 8, h);
    ctx.restore();
  }
}

export type Facing = 'user' | 'environment';
export type Fit = 'cover' | 'contain';

export interface CameraOptions {
  /** Appareil précis (id de `listDevices`), sinon la caméra avant ou arrière. */
  videoDeviceId?: string;
  facing?: Facing;
  audioDeviceId?: string;
}

export interface DeviceInfo {
  id: string;
  label: string;
  kind: 'videoinput' | 'audioinput';
}

export interface CameraInfo {
  width: number;
  height: number;
  frameRate: number;
  facing: Facing | null;
  label: string;
  zoom: { min: number; max: number; step: number; value: number } | null;
}

export class Recorder {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement | null = null;
  private camera: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private raf = 0;
  /** Numéro de la dernière ouverture caméra demandée : une ouverture dépassée jette son flux. */
  private openGen = 0;
  private scene: Scene = { type: 'idle' };
  private sceneAt = 0;
  private popups: LivePopup[] = [];
  private listeners = new Set<Listener>();
  private stopResolve: ((b: Blob | null) => void) | null = null;
  private images = new Map<string, HTMLImageElement>();
  private lastDraw = 0;
  private watchdog = 0;
  private logo: HTMLImageElement | null = null;
  private cameraOptions: CameraOptions = { facing: 'user' };

  /** Image de fond à la place de la caméra (tests et aperçus du montage). */
  backdrop: HTMLImageElement | null = null;
  /** Cadrage de la caméra dans le 9:16 : recadrée plein cadre, ou entière avec des bandes. */
  fit: Fit = 'cover';

  status: RecorderStatus = 'idle';
  hasCamera = false;
  startedAt = 0;
  mimeType = '';
  lastBlob: Blob | null = null;
  error: string | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('canvas 2d indisponible');
    this.ctx = ctx;
    this.logo = new Image();
    this.logo.src = `${import.meta.env.BASE_URL}icons/icon-512.png`;
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  get elapsedMs(): number {
    return this.status === 'recording' ? Date.now() - this.startedAt : 0;
  }

  /** Flux caméra brut (pour l'aperçu sur le téléphone : jamais les incrustations, sinon on triche). */
  get stream(): MediaStream | null {
    return this.hasCamera ? this.camera : null;
  }

  get facing(): Facing | null {
    return this.info()?.facing ?? null;
  }

  setScene(scene: Scene) {
    this.scene = scene;
    this.sceneAt = performance.now();
  }

  popup(p: Popup, duration = p.kind === 'elim' ? 3200 : p.kind === 'guess' ? 3000 : 2400) {
    this.popups.push({ popup: p, at: performance.now(), duration });
  }

  /** Caméras et micros disponibles (les noms n'apparaissent qu'après une première autorisation). */
  async listDevices(): Promise<DeviceInfo[]> {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      return all
        .filter((d) => d.kind === 'videoinput' || d.kind === 'audioinput')
        .map((d) => ({ id: d.deviceId, label: d.label, kind: d.kind as DeviceInfo['kind'] }));
    } catch {
      return [];
    }
  }

  /** Réglages réels de la caméra ouverte. */
  info(): CameraInfo | null {
    const track = this.camera?.getVideoTracks()[0];
    if (!track) return null;
    const s = track.getSettings();
    const caps = (typeof track.getCapabilities === 'function' ? track.getCapabilities() : {}) as MediaTrackCapabilities & {
      zoom?: { min: number; max: number; step?: number };
    };
    const zoom = caps.zoom && typeof caps.zoom.min === 'number' && typeof caps.zoom.max === 'number' && caps.zoom.max > caps.zoom.min
      ? { min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step ?? 0.1, value: Number((s as MediaTrackSettings & { zoom?: number }).zoom ?? caps.zoom.min) }
      : null;
    const facing = s.facingMode === 'environment' ? 'environment' : s.facingMode === 'user' ? 'user' : null;
    return {
      width: this.video?.videoWidth || s.width || 0,
      height: this.video?.videoHeight || s.height || 0,
      frameRate: Math.round(s.frameRate ?? 0),
      facing,
      label: track.label,
      zoom,
    };
  }

  async setZoom(value: number): Promise<void> {
    const track = this.camera?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ zoom: value } as MediaTrackConstraintSet] });
    } catch {
      /* zoom non pris en charge : on ignore */
    }
    this.emit();
  }

  /**
   * Ouvre la caméra (et le micro) en aperçu, sans enregistrer. Réappelable pour changer d'appareil.
   * On demande un mode 4:3 (le capteur entier, champ le plus large) : le recadrage 9:16 se fait ici.
   */
  async openCamera(opts: CameraOptions = this.cameraOptions): Promise<boolean> {
    this.cameraOptions = { ...this.cameraOptions, ...opts };
    await ensureCanvasFonts();
    const wasRecording = this.status === 'recording';
    const previous = this.camera;
    const video: MediaTrackConstraints = {
      width: { ideal: 1920 },
      height: { ideal: 1440 },
      frameRate: { ideal: 30 },
    };
    if (this.cameraOptions.videoDeviceId) video.deviceId = { exact: this.cameraOptions.videoDeviceId };
    else video.facingMode = this.cameraOptions.facing ?? 'user';
    const audio: MediaTrackConstraints | boolean = this.cameraOptions.audioDeviceId
      ? { deviceId: { exact: this.cameraOptions.audioDeviceId } }
      : true;
    const gen = ++this.openGen;
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    } catch {
      try {
        // Caméra refusée ou absente : le micro seul, sinon rien.
        stream = await navigator.mediaDevices.getUserMedia({ audio });
      } catch {
        stream = null;
      }
    }
    if (gen !== this.openGen) {
      // Une ouverture plus récente a pris le relais (deux appuis rapides) : ce flux est de trop.
      stream?.getTracks().forEach((t) => t.stop());
      return this.hasCamera;
    }
    // Pendant un enregistrement on garde l'ancien son (le MediaRecorder y est branché).
    if (!wasRecording) previous?.getTracks().forEach((t) => t.stop());
    else previous?.getVideoTracks().forEach((t) => t.stop());
    this.camera = stream;
    this.hasCamera = !!stream && stream.getVideoTracks().length > 0;
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    if (this.hasCamera && stream) {
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.srcObject = stream;
      await v.play().catch(() => undefined);
      this.video = v;
    }
    if (this.status === 'idle' || this.status === 'stopped') {
      this.status = 'preview';
      this.loop();
      window.clearInterval(this.watchdog);
      this.watchdog = window.setInterval(() => {
        if ((this.status === 'recording' || this.status === 'preview') && performance.now() - this.lastDraw > 120) this.safeDraw();
      }, 66);
    }
    this.emit();
    return this.hasCamera;
  }

  /** Ferme la caméra de l'aperçu sans rien enregistrer. */
  closeCamera() {
    if (this.status !== 'preview') return;
    cancelAnimationFrame(this.raf);
    window.clearInterval(this.watchdog);
    this.releaseCamera();
    this.status = 'idle';
    this.scene = { type: 'idle' };
    this.emit();
  }

  /** Démarre l'enregistrement sur la caméra ouverte (l'ouvre si besoin). */
  async beginRecording(): Promise<boolean> {
    if (this.status === 'recording') return true;
    this.error = null;
    try {
      if (this.status !== 'preview') await this.openCamera();
      if (typeof MediaRecorder === 'undefined' || typeof this.canvas.captureStream !== 'function') {
        throw new Error('MediaRecorder indisponible');
      }
      const out = this.canvas.captureStream(FPS);
      this.camera?.getAudioTracks().forEach((t) => out.addTrack(t));
      const candidates = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      this.mimeType = candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      this.recorder = new MediaRecorder(out, this.mimeType ? { mimeType: this.mimeType, videoBitsPerSecond: 3_000_000 } : undefined);
      this.chunks = [];
      this.lastBlob = null;
      this.recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.chunks.push(e.data);
      };
      this.recorder.onstop = () => {
        const blob = this.chunks.length ? new Blob(this.chunks, { type: this.recorder?.mimeType || this.mimeType || 'video/webm' }) : null;
        this.lastBlob = blob;
        this.status = 'stopped';
        this.emit();
        this.stopResolve?.(blob);
        this.stopResolve = null;
      };
      // Capture coupée par le système (verrouillage, appel) : on finalise avec ce qu'on a.
      this.recorder.onerror = () => {
        this.error = 'MediaRecorder';
        try {
          if (this.recorder?.state !== 'inactive') this.recorder?.stop();
          else this.recorder.onstop?.(new Event('stop'));
        } catch {
          this.recorder?.onstop?.(new Event('stop'));
        }
      };
      this.recorder.start(1000);
      this.startedAt = Date.now();
      this.status = 'recording';
      this.emit();
      return true;
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
      this.closeCamera();
      this.status = 'idle';
      this.emit();
      return false;
    }
  }

  /** Raccourci : caméra + enregistrement d'un coup (reprise après rechargement). */
  async start(): Promise<boolean> {
    if (this.status === 'recording') return true;
    await this.openCamera();
    return this.beginRecording();
  }

  /** Arrête l'enregistrement et renvoie la vidéo. */
  stop(): Promise<Blob | null> {
    if (!this.recorder || this.status !== 'recording') return Promise.resolve(this.lastBlob);
    return new Promise((resolve) => {
      this.stopResolve = resolve;
      cancelAnimationFrame(this.raf);
      window.clearInterval(this.watchdog);
      try {
        if (this.recorder?.state === 'inactive') throw new Error('inactive');
        this.recorder?.stop();
      } catch {
        // Enregistreur déjà mort : on rend ce qui a été capturé, jamais un statut « recording » figé.
        const blob = this.chunks.length ? new Blob(this.chunks, { type: this.recorder?.mimeType || this.mimeType || 'video/webm' }) : null;
        this.lastBlob = blob;
        this.status = 'stopped';
        this.stopResolve = null;
        this.emit();
        resolve(blob);
      }
      this.releaseCamera();
    });
  }

  /** Vignette de la composition (pour la bibliothèque). */
  thumbnail(width = 270): string {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = Math.round((width * H) / W);
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(this.canvas, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.7);
  }

  discard() {
    cancelAnimationFrame(this.raf);
    window.clearInterval(this.watchdog);
    try {
      if (this.recorder && this.recorder.state !== 'inactive') this.recorder.stop();
    } catch {
      /* ignore */
    }
    this.recorder = null;
    this.chunks = [];
    this.lastBlob = null;
    this.status = 'idle';
    this.scene = { type: 'idle' };
    this.popups = [];
    this.releaseCamera();
    this.emit();
  }

  private releaseCamera() {
    this.camera?.getTracks().forEach((t) => t.stop());
    this.camera = null;
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    this.hasCamera = false;
  }

  /** Nom de fichier avec la bonne extension. */
  fileName(): string {
    const ext = (this.lastBlob?.type || this.mimeType).includes('mp4') ? 'mp4' : 'webm';
    const d = new Date();
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
    return `football-undercover-${stamp}.${ext}`;
  }

  /** Web : téléchargement. Natif : fichier temporaire + feuille de partage (Photos, TikTok…). */
  async save(): Promise<boolean> {
    const blob = this.lastBlob;
    if (!blob) return false;
    return shareBlob(blob, this.fileName());
  }

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */

  private loop = () => {
    this.safeDraw();
    this.raf = requestAnimationFrame(this.loop);
  };

  private safeDraw() {
    try {
      this.draw(performance.now());
    } catch (e) {
      console.error('[creator] image non dessinée', e);
    }
    this.lastDraw = performance.now();
  }

  private image(src: string): HTMLImageElement | null {
    let img = this.images.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      this.images.set(src, img);
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
  }

  /** Photo du joueur (ronde, liseré rouge), sinon ses initiales sur fond sombre. */
  private drawFace(face: Face, cx: number, cy: number, size: number) {
    const ctx = this.ctx;
    const r = size / 2;
    const img = face.photo ? this.image(face.photo) : null;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    if (img) {
      ctx.save();
      ctx.clip();
      const s = Math.max(size / img.naturalWidth, size / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
      ctx.restore();
    } else {
      ctx.fillStyle = '#1f1f1f';
      ctx.fill();
      ctx.fillStyle = TEXT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      displayFont(ctx, size * 0.4);
      ctx.fillText(initials(face.name), cx, cy + size * 0.02);
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(3, size * 0.035);
    ctx.strokeStyle = RED;
    ctx.shadowColor = 'rgba(255,43,43,0.6)';
    ctx.shadowBlur = size * 0.18;
    ctx.stroke();
    ctx.restore();
  }

  private draw(now: number) {
    const ctx = this.ctx;
    // Fond : caméra en « cover », sinon ambiance stade.
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    const v = this.video;
    if (v && v.videoWidth > 0) {
      const scale = (this.fit === 'contain' ? Math.min : Math.max)(W / v.videoWidth, H / v.videoHeight);
      const dw = v.videoWidth * scale;
      const dh = v.videoHeight * scale;
      ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } else if (this.backdrop && this.backdrop.naturalWidth > 0) {
      const b = this.backdrop;
      const scale = Math.max(W / b.naturalWidth, H / b.naturalHeight);
      const dw = b.naturalWidth * scale;
      const dh = b.naturalHeight * scale;
      ctx.drawImage(b, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } else {
      const g = ctx.createRadialGradient(W * 0.85, 0, 50, W * 0.85, 0, W);
      g.addColorStop(0, 'rgba(255,43,43,0.55)');
      g.addColorStop(1, 'rgba(255,43,43,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    this.drawLogo();
    this.popups = this.popups.filter((p) => now - p.at < p.duration);
    const elimActive = this.popups.some((p) => p.popup.kind === 'elim');
    const t = (now - this.sceneAt) / 1000;
    switch (this.scene.type) {
      case 'reveal':
        this.drawReveal(this.scene, t);
        break;
      case 'discuss':
        if (!elimActive) this.drawDiscuss(this.scene, t);
        break;
      case 'guess':
        if (!elimActive) this.drawGuess(this.scene, t);
        break;
      case 'result':
        // Le résultat attend la fin de la carte d'élimination, puis fait son entrée.
        if (elimActive) this.sceneAt = now;
        else this.drawResult(this.scene, t);
        break;
      default:
        break;
    }
    for (const p of this.popups) this.drawPopup(p, now);
  }

  /** Logo de l'app, petit, en haut à gauche. */
  private drawLogo() {
    const img = this.logo;
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const ctx = this.ctx;
    // Deux fois plus grand qu'au premier essai, plus haut, avec une marge (pas collé dans le coin).
    const size = 168;
    const x = SAFE_LEFT;
    const y = 120;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, x, y, size, size, 38);
    ctx.fillStyle = BG;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.clip();
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
  }

  /** Révélation : photo en grand à gauche, prénom et mot à droite. Compact, en bas de la zone sûre. */
  private drawReveal(s: Extract<Scene, { type: 'reveal' }>, t: number) {
    const ctx = this.ctx;
    const k = easeOutBack(t / 0.4);
    const w = 800;
    const x = SAFE_LEFT;
    const tx = x + 212;
    const tw = w - 250;
    const name = s.face.name.toUpperCase();
    const nameSize = fitSize(ctx, name, tw, 50, 30);
    const word = s.word === null ? null : fitLines(ctx, s.word.toUpperCase(), tw, 50, 26, 2);
    const wordH = word ? word.lines.length * word.size * 1.12 : 50;
    const h = Math.max(210, 26 + nameSize + 10 + 20 + 16 + wordH + 26);
    const y = SAFE_BOTTOM - h;
    ctx.save();
    ctx.globalAlpha = clamp01(t / 0.2);
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(0.92 + 0.08 * k, 0.92 + 0.08 * k);
    ctx.translate(-(x + w / 2), -(y + h / 2));
    panel(ctx, x, y, w, h, 30, true);
    this.drawFace(s.face, x + 112, y + h / 2, 150);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = TEXT;
    displayFont(ctx, nameSize);
    let cy = y + 26 + nameSize / 2;
    ctx.fillText(name, tx, cy);
    cy += nameSize / 2 + 10 + 10;
    ctx.fillStyle = MUTED;
    displayFont(ctx, 20, 700);
    ctx.fillText(`${s.wordLabel.toUpperCase()} · ${s.category.toUpperCase()}`, tx, cy);
    cy += 10 + 16;
    if (!word) {
      // Carton blanc : un petit carton blanc, puis le nom du rôle.
      const wy = cy + 25;
      ctx.save();
      ctx.translate(tx + 18, wy);
      ctx.rotate(-0.12);
      roundRect(ctx, -14, -22, 28, 44, 5);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255,255,255,0.6)';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = TEXT;
      displayFont(ctx, fitSize(ctx, s.whiteLabel.toUpperCase(), tw - 60, 46, 26));
      ctx.fillText(s.whiteLabel.toUpperCase(), tx + 52, wy);
    } else {
      ctx.fillStyle = RED;
      displayFont(ctx, word.size);
      ctx.shadowColor = 'rgba(255,43,43,0.45)';
      ctx.shadowBlur = 20;
      word.lines.forEach((line, i) => ctx.fillText(line, tx, cy + word.size / 2 + i * word.size * 1.12));
    }
    ctx.restore();
  }

  /** Ordre de parole : photos et mots seulement, en bas à gauche. Le mot de l'undercover est en rouge. */
  private drawDiscuss(s: Extract<Scene, { type: 'discuss' }>, t: number) {
    const ctx = this.ctx;
    const headH = 58;
    const textX = 132;
    const maxTextW = SAFE_W - textX - 28;
    // Mesures : chaque mot tient sur une ligne (28 → 20 px), sinon sur deux.
    const rows = s.order.map((p) => {
      const word = (p.word === null ? s.whiteLabel : p.word).toUpperCase();
      const fit = fitLines(ctx, word, maxTextW, 28, 20, 2, 850);
      const width = Math.max(...fit.lines.map((l) => ctx.measureText(l).width));
      const rowH = fit.lines.length === 1 ? 66 : 66 + fit.size * 1.1;
      return { ...p, fit, width, rowH };
    });
    const w = Math.min(SAFE_W, Math.max(420, textX + Math.max(...rows.map((r) => r.width)) + 28));
    const h = headH + rows.reduce((sum, r) => sum + r.rowH, 0) + 16;
    const x = SAFE_LEFT;
    const y = SAFE_BOTTOM - h;
    ctx.save();
    ctx.globalAlpha = clamp01(t / 0.25);
    panel(ctx, x, y, w, h, 26, true);
    // En-tête : point rouge + « Tour 1 »
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(x + 40, y + headH / 2 + 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = TEXT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    displayFont(ctx, 24);
    ctx.fillText(s.title.toUpperCase(), x + 62, y + headH / 2 + 2);

    let ry = y + headH;
    rows.forEach((p, i) => {
      const k = easeOut((t - i * 0.08) / 0.3);
      const cy = ry + p.rowH / 2;
      ry += p.rowH;
      if (k <= 0) return;
      ctx.save();
      ctx.globalAlpha = k;
      ctx.translate((1 - k) * 40, 0);
      ctx.fillStyle = MUTED;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      displayFont(ctx, 18, 800);
      ctx.fillText(String(i + 1), x + 40, cy + 1);
      this.drawFace(p.face, x + 92, cy, 48);
      ctx.textAlign = 'left';
      ctx.fillStyle = p.word === null ? MUTED : wordColor(p.role);
      displayFont(ctx, p.fit.size, 850);
      const lineH = p.fit.size * 1.1;
      const top = cy - ((p.fit.lines.length - 1) * lineH) / 2;
      p.fit.lines.forEach((line, j) => ctx.fillText(line, x + textX, top + j * lineH + 1));
      ctx.restore();
    });
    ctx.restore();
  }

  private drawGuess(s: Extract<Scene, { type: 'guess' }>, t: number) {
    const ctx = this.ctx;
    const w = 780;
    const h = 130;
    const x = SAFE_LEFT;
    const y = SAFE_BOTTOM - h;
    ctx.save();
    ctx.globalAlpha = clamp01(t / 0.25);
    panel(ctx, x, y, w, h, 26, true);
    this.drawFace(s.face, x + 78, y + h / 2, 84);
    ctx.fillStyle = TEXT;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    displayFont(ctx, fitSize(ctx, s.label, w - 180, 28, 16, 800), 800);
    ctx.fillText(s.label, x + 140, y + h / 2 + 1);
    ctx.restore();
  }

  private drawResult(s: Extract<Scene, { type: 'result' }>, t: number) {
    const ctx = this.ctx;
    const k = easeOutBack(t / 0.6);
    const w = SAFE_W;
    const x = SAFE_LEFT;
    const pad = 36;
    const inner = w - pad * 2;
    const title = fitLines(ctx, s.title.toUpperCase(), inner, 62, 34, 2);
    const sub = fitLines(ctx, s.sub, inner, 24, 16, 2, 700);
    const civ = fitLines(ctx, s.civilWord.toUpperCase(), inner, 32, 18, 2, 850);
    const und = fitLines(ctx, s.undercoverWord.toUpperCase(), inner, 32, 18, 2, 850);
    const titleH = title.lines.length * title.size * 1.08;
    const subH = sub.lines.length * sub.size * 1.2;
    const rowH = (l: { size: number; lines: string[] }) => 20 + 10 + l.lines.length * l.size * 1.15 + 16;
    const h = pad + titleH + 10 + subH + 22 + rowH(civ) + rowH(und) + pad - 10;
    const y = SAFE_BOTTOM - h;
    ctx.save();
    ctx.globalAlpha = clamp01(t / 0.3);
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
    ctx.translate(-(x + w / 2), -(y + h / 2));
    panel(ctx, x, y, w, h, 30, true);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let cy = y + pad;
    ctx.fillStyle = TEXT;
    ctx.shadowColor = 'rgba(255,43,43,0.55)';
    ctx.shadowBlur = 30;
    displayFont(ctx, title.size);
    title.lines.forEach((line, i) => ctx.fillText(line, x + w / 2, cy + title.size / 2 + i * title.size * 1.08));
    ctx.shadowColor = 'transparent';
    cy += titleH + 10;
    ctx.fillStyle = MUTED;
    displayFont(ctx, sub.size, 700);
    sub.lines.forEach((line, i) => ctx.fillText(line, x + w / 2, cy + sub.size / 2 + i * sub.size * 1.2));
    cy += subH + 22;
    ctx.textAlign = 'left';
    const row = (label: string, l: { size: number; lines: string[] }, color: string) => {
      ctx.fillStyle = LINE;
      ctx.fillRect(x + pad, cy, inner, 2);
      cy += 20;
      ctx.fillStyle = MUTED;
      displayFont(ctx, 20, 700);
      ctx.fillText(label.toUpperCase(), x + pad, cy);
      cy += 10 + 10;
      ctx.fillStyle = color;
      displayFont(ctx, l.size, 850);
      l.lines.forEach((line, i) => ctx.fillText(line, x + pad, cy + l.size / 2 + i * l.size * 1.15));
      cy += l.lines.length * l.size * 1.15 + 16 - 10;
    };
    row(s.civilLabel, civ, TEXT);
    row(s.undercoverLabel, und, RED);
    ctx.restore();
  }

  private drawPopup(p: LivePopup, now: number) {
    const ctx = this.ctx;
    const t = (now - p.at) / 1000;
    const remaining = (p.duration - (now - p.at)) / 1000;
    const alpha = Math.max(0, Math.min(1, t / 0.2, remaining / 0.3));

    if (p.popup.kind === 'vote') {
      // « Le groupe vote X » : pilule compacte dans le haut de la zone sûre, photo de la cible à droite.
      const k = easeOutBack(t / 0.4);
      const h = 88;
      const y = SAFE_TOP + 120;
      ctx.save();
      ctx.globalAlpha = alpha;
      const line = `${p.popup.label.toUpperCase()}  ${p.popup.to.name.toUpperCase()}`;
      displayFont(ctx, fitSize(ctx, line, SAFE_W - 150, 30, 16, 850), 850);
      const tw = ctx.measureText(line).width;
      const w = Math.min(SAFE_W, tw + 140);
      const x = SAFE_LEFT;
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale(0.9 + 0.1 * k, 0.9 + 0.1 * k);
      ctx.translate(-(x + w / 2), -(y + h / 2));
      panel(ctx, x, y, w, h, h / 2);
      this.drawFace(p.popup.to, x + w - 48, y + h / 2, 60);
      ctx.fillStyle = TEXT;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(line, x + 36, y + h / 2 + 1);
      ctx.restore();
      return;
    }

    if (p.popup.kind === 'guess') {
      const w = 780;
      const h = 150;
      const x = SAFE_LEFT;
      const y = SAFE_TOP + 110;
      ctx.save();
      ctx.globalAlpha = alpha;
      panel(ctx, x, y, w, h, 26);
      roundRect(ctx, x, y, w, h, 26);
      ctx.lineWidth = 3;
      ctx.strokeStyle = p.popup.correct ? GREEN : RED;
      ctx.stroke();
      this.drawFace(p.popup.face, x + 78, y + h / 2, 84);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = TEXT;
      displayFont(ctx, fitSize(ctx, `« ${p.popup.guess} »`, w - 180, 34, 18));
      ctx.fillText(`« ${p.popup.guess} »`, x + 140, y + 52);
      ctx.fillStyle = p.popup.correct ? GREEN : RED;
      displayFont(ctx, 28);
      ctx.fillText(p.popup.label.toUpperCase(), x + 140, y + 104);
      ctx.restore();
      return;
    }

    // Élimination : flash rouge puis carte qui claque (1 s), maintenue ensuite, en bas de la zone sûre.
    const flash = Math.max(0, 0.45 - t * 1.8);
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,43,43,${flash})`;
      ctx.fillRect(0, 0, W, H);
    }
    const k = easeOutBack(t / 0.9);
    const cw = 640;
    const ch = 400;
    const cy = SAFE_BOTTOM - ch / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(SAFE_CX, cy);
    ctx.scale(0.55 + 0.45 * k, 0.55 + 0.45 * k);
    ctx.rotate((1 - k) * -0.06);
    panel(ctx, -cw / 2, -ch / 2, cw, ch, 36);
    roundRect(ctx, -cw / 2, -ch / 2, cw, ch, 36);
    ctx.lineWidth = 3;
    ctx.strokeStyle = p.popup.role === 'undercover' ? RED : 'rgba(255,255,255,0.35)';
    ctx.stroke();
    this.drawFace(p.popup.face, 0, -ch / 2 + 100, 130);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = TEXT;
    displayFont(ctx, fitSize(ctx, p.popup.face.name.toUpperCase(), cw - 80, 46, 24));
    ctx.fillText(p.popup.face.name.toUpperCase(), 0, 20);
    ctx.fillStyle = MUTED;
    displayFont(ctx, 20, 700);
    ctx.fillText(p.popup.outLabel.toUpperCase(), 0, 66);
    ctx.fillStyle = p.popup.role === 'undercover' ? RED : TEXT;
    ctx.shadowColor = p.popup.role === 'undercover' ? 'rgba(255,43,43,0.7)' : 'rgba(255,255,255,0.35)';
    ctx.shadowBlur = 30;
    displayFont(ctx, fitSize(ctx, p.popup.roleLabel.toUpperCase(), cw - 80, 56, 28));
    ctx.fillText(p.popup.roleLabel.toUpperCase(), 0, 128);
    ctx.restore();
  }
}
