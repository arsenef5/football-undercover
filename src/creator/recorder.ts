/**
 * MODE CRÉATEUR 🎥 — moteur de composition vidéo.
 *
 * La caméra frontale est dessinée dans un canvas 1080×1920 (9:16) à 30 images/s, et les
 * incrustations (nom + mot à la révélation, ordre de parole en bandeau, votes, élimination,
 * résultat) sont peintes par-dessus en temps réel. Le canvas + le micro alimentent un
 * MediaRecorder : la vidéo obtenue est « montée » à la sortie, sans logiciel.
 *
 * Sans caméra (refus, navigateur de bureau), on enregistre quand même les incrustations sur
 * un fond stade : le mode ne bloque jamais la partie.
 */
import { Capacitor } from '@capacitor/core';
import type { Role } from '../game/types';

export type Scene =
  | { type: 'idle' }
  | { type: 'reveal'; name: string; color: string; word: string | null; category: string; whiteLabel: string; wordLabel: string }
  | { type: 'discuss'; round: number; title: string; orderLabel: string; order: { name: string; word: string | null; role: Role; color: string }[]; whiteLabel: string }
  | { type: 'guess'; name: string; label: string }
  | { type: 'result'; title: string; sub: string; civilWord: string; undercoverWord: string; civilLabel: string; undercoverLabel: string };

export type Popup =
  | { kind: 'vote'; from: string; to: string; verb: string }
  | { kind: 'elim'; name: string; color: string; role: Role; roleLabel: string; outLabel: string }
  | { kind: 'guess'; name: string; correct: boolean; guess: string; label: string };

interface LivePopup {
  popup: Popup;
  at: number;
  duration: number;
}

export type RecorderStatus = 'idle' | 'starting' | 'recording' | 'stopped';

const W = 1080;
const H = 1920;
const FPS = 30;
const RED = '#ff2b2b';
const BG = '#0a0a0a';

const DISPLAY = '"Archivo Variable", Archivo, system-ui, sans-serif';
const LOGO = 'Anton, Impact, sans-serif';

type Listener = () => void;

function easeOut(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = Math.max(0, Math.min(1, t));
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

/** Police d'affichage (large et grasse), avec repli sur les navigateurs sans axe de largeur. */
function displayFont(ctx: CanvasRenderingContext2D, size: number, weight = 900) {
  ctx.font = `${weight} ${size}px ${DISPLAY}`;
  (ctx as unknown as { fontStretch?: string }).fontStretch = 'expanded';
}

function fitSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, max: number, min: number, weight = 900): number {
  let size = max;
  displayFont(ctx, size, weight);
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    displayFont(ctx, size, weight);
  }
  return size;
}

function initials(name: string): string {
  const parts = name.trim().split(/[\s\-_.]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function roleColor(role: Role): string {
  return role === 'undercover' ? RED : role === 'white' ? '#ffffff' : '#dcdcdc';
}

export class Recorder {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement | null = null;
  private camera: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private raf = 0;
  private scene: Scene = { type: 'idle' };
  private sceneAt = 0;
  private popups: LivePopup[] = [];
  private listeners = new Set<Listener>();
  private stopResolve: ((b: Blob | null) => void) | null = null;
  private brand = 'FOOTBALL UNDERCOVER';

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

  setBrand(text: string) {
    this.brand = text;
  }

  setScene(scene: Scene) {
    this.scene = scene;
    this.sceneAt = performance.now();
  }

  popup(p: Popup, duration = p.kind === 'elim' ? 3200 : p.kind === 'guess' ? 3000 : 2400) {
    this.popups.push({ popup: p, at: performance.now(), duration });
  }

  /** Démarre caméra + micro + enregistrement. Renvoie faux si l'enregistrement est impossible. */
  async start(): Promise<boolean> {
    if (this.status === 'recording' || this.status === 'starting') return true;
    this.status = 'starting';
    this.error = null;
    this.emit();
    try {
      try {
        this.camera = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 }, frameRate: { ideal: 30 } },
          audio: true,
        });
      } catch {
        // Caméra refusée ou absente : on tente le micro seul, sinon vidéo muette.
        this.camera = null;
        try {
          this.camera = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          this.camera = null;
        }
      }
      this.hasCamera = !!this.camera && this.camera.getVideoTracks().length > 0;
      if (this.hasCamera && this.camera) {
        const v = document.createElement('video');
        v.muted = true;
        v.playsInline = true;
        v.srcObject = this.camera;
        await v.play().catch(() => undefined);
        this.video = v;
      }

      if (typeof MediaRecorder === 'undefined' || typeof this.canvas.captureStream !== 'function') {
        throw new Error('MediaRecorder indisponible');
      }
      const out = this.canvas.captureStream(FPS);
      this.camera?.getAudioTracks().forEach((t) => out.addTrack(t));
      const candidates = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      this.mimeType = candidates.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
      this.recorder = new MediaRecorder(out, this.mimeType ? { mimeType: this.mimeType, videoBitsPerSecond: 5_000_000 } : undefined);
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
      this.recorder.start(1000);
      this.startedAt = Date.now();
      this.status = 'recording';
      this.loop();
      this.emit();
      return true;
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
      this.status = 'idle';
      this.releaseCamera();
      this.emit();
      return false;
    }
  }

  /** Arrête l'enregistrement et renvoie la vidéo. */
  stop(): Promise<Blob | null> {
    if (!this.recorder || this.status !== 'recording') return Promise.resolve(this.lastBlob);
    return new Promise((resolve) => {
      this.stopResolve = resolve;
      cancelAnimationFrame(this.raf);
      try {
        this.recorder?.stop();
      } catch {
        resolve(null);
      }
      this.releaseCamera();
    });
  }

  discard() {
    cancelAnimationFrame(this.raf);
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
    const name = this.fileName();
    if (Capacitor.isNativePlatform()) {
      try {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const { Share } = await import('@capacitor/share');
        const toBase64 = (part: Blob) =>
          new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
            r.onerror = () => reject(r.error);
            r.readAsDataURL(part);
          });
        // Tranches multiples de 3 octets : chaque morceau base64 se concatène proprement.
        const CHUNK = 6 * 1024 * 1024;
        let uri = '';
        for (let offset = 0; offset < blob.size; offset += CHUNK) {
          const data = await toBase64(blob.slice(offset, Math.min(blob.size, offset + CHUNK)));
          if (offset === 0) {
            const written = await Filesystem.writeFile({ path: name, data, directory: Directory.Cache });
            uri = written.uri;
          } else {
            await Filesystem.appendFile({ path: name, data, directory: Directory.Cache });
          }
        }
        await Share.share({ title: 'Football Undercover', url: uri });
        return true;
      } catch {
        return false;
      }
    }
    const file = new File([blob], name, { type: blob.type });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare && nav.canShare({ files: [file] }) && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ files: [file], title: 'Football Undercover' });
        return true;
      } catch {
        /* l'utilisateur a annulé : on propose le téléchargement */
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Rendu                                                               */
  /* ------------------------------------------------------------------ */

  private loop = () => {
    this.draw(performance.now());
    this.raf = requestAnimationFrame(this.loop);
  };

  private draw(now: number) {
    const ctx = this.ctx;
    // Fond : caméra en « cover », sinon ambiance stade.
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    const v = this.video;
    if (v && v.videoWidth > 0) {
      const scale = Math.max(W / v.videoWidth, H / v.videoHeight);
      const dw = v.videoWidth * scale;
      const dh = v.videoHeight * scale;
      ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } else {
      const g = ctx.createRadialGradient(W * 0.85, 0, 50, W * 0.85, 0, W);
      g.addColorStop(0, 'rgba(255,43,43,0.55)');
      g.addColorStop(1, 'rgba(255,43,43,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    // Voile bas pour la lisibilité des incrustations.
    const shade = ctx.createLinearGradient(0, H * 0.5, 0, H);
    shade.addColorStop(0, 'rgba(10,10,10,0)');
    shade.addColorStop(1, 'rgba(10,10,10,0.85)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, H * 0.5, W, H * 0.5);

    this.drawBrand(now);
    const t = (now - this.sceneAt) / 1000;
    switch (this.scene.type) {
      case 'reveal':
        this.drawReveal(this.scene, t);
        break;
      case 'discuss':
        this.drawDiscuss(this.scene, t);
        break;
      case 'guess':
        this.drawGuess(this.scene, t);
        break;
      case 'result':
        this.drawResult(this.scene, t);
        break;
      default:
        break;
    }
    this.popups = this.popups.filter((p) => now - p.at < p.duration);
    for (const p of this.popups) this.drawPopup(p, now);
  }

  private drawBrand(now: number) {
    const ctx = this.ctx;
    ctx.save();
    roundRect(ctx, 40, 60, 560, 84, 42);
    ctx.fillStyle = 'rgba(10,10,10,0.72)';
    ctx.fill();
    // point rouge qui clignote
    const blink = 0.5 + 0.5 * Math.sin(now / 350);
    ctx.fillStyle = `rgba(255,43,43,${0.45 + 0.55 * blink})`;
    ctx.beginPath();
    ctx.arc(90, 102, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f5f5f5';
    ctx.font = `400 44px ${LOGO}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(this.brand, 124, 104);
    ctx.restore();
  }

  /** Carte « nom + mot » qui surgit en bas : la tête du joueur au-dessus, son mot dessous. */
  private drawReveal(s: Extract<Scene, { type: 'reveal' }>, t: number) {
    const ctx = this.ctx;
    const k = easeOutBack(t / 0.45);
    const cardW = 880;
    const cardH = 520;
    const x = (W - cardW) / 2;
    const y = H - cardH - 140;
    ctx.save();
    ctx.globalAlpha = Math.min(1, t / 0.25);
    ctx.translate(W / 2, y + cardH / 2);
    ctx.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k);
    ctx.translate(-W / 2, -(y + cardH / 2));
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 24;
    roundRect(ctx, x, y, cardW, cardH, 44);
    const g = ctx.createLinearGradient(0, y, 0, y + cardH);
    g.addColorStop(0, '#242424');
    g.addColorStop(1, '#101010');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 3;
    ctx.strokeStyle = s.color;
    ctx.stroke();

    // Pastille couleur + nom
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(W / 2, y + 96, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0a0a';
    displayFont(ctx, 40);
    ctx.fillText(initials(s.name), W / 2, y + 98);
    ctx.fillStyle = '#f5f5f5';
    const nameSize = fitSize(ctx, s.name.toUpperCase(), cardW - 120, 96, 48);
    displayFont(ctx, nameSize);
    ctx.fillText(s.name.toUpperCase(), W / 2, y + 200);

    if (s.word === null) {
      // Carton blanc : un vrai carton, sans couleur qui trahit.
      ctx.save();
      ctx.translate(W / 2, y + 340);
      ctx.rotate(-0.15);
      roundRect(ctx, -36, -52, 72, 104, 10);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255,255,255,0.5)';
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#ffffff';
      displayFont(ctx, 54);
      ctx.fillText(s.whiteLabel.toUpperCase(), W / 2, y + 450);
    } else {
      ctx.fillStyle = '#8e8e8e';
      displayFont(ctx, 30, 700);
      ctx.fillText(`${s.wordLabel.toUpperCase()} · ${s.category.toUpperCase()}`, W / 2, y + 290);
      ctx.fillStyle = RED;
      const wordSize = fitSize(ctx, s.word.toUpperCase(), cardW - 100, 110, 44);
      displayFont(ctx, wordSize);
      ctx.shadowColor = 'rgba(255,43,43,0.55)';
      ctx.shadowBlur = 40;
      ctx.fillText(s.word.toUpperCase(), W / 2, y + 390);
    }
    ctx.restore();
  }

  /** Bandeau « ordre de parole » : chaque nom avec son mot (rouge pour l'undercover). */
  private drawDiscuss(s: Extract<Scene, { type: 'discuss' }>, t: number) {
    const ctx = this.ctx;
    const rowH = 92;
    const n = s.order.length;
    const barH = 120 + n * rowH + 40;
    const y = H - barH - 90;
    ctx.save();
    ctx.globalAlpha = Math.min(1, t / 0.3);
    roundRect(ctx, 40, y, W - 80, barH, 40);
    ctx.fillStyle = 'rgba(10,10,10,0.78)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.stroke();
    // titre rouge
    roundRect(ctx, 40, y, W - 80, 110, 40);
    ctx.save();
    ctx.clip();
    ctx.fillStyle = RED;
    ctx.fillRect(40, y, W - 80, 110);
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    displayFont(ctx, 46);
    ctx.fillText(s.title.toUpperCase(), 90, y + 56);
    ctx.textAlign = 'right';
    displayFont(ctx, 30, 700);
    ctx.fillText(s.orderLabel.toUpperCase(), W - 90, y + 56);

    s.order.forEach((p, i) => {
      const k = easeOut((t - i * 0.12) / 0.35);
      if (k <= 0) return;
      const ry = y + 140 + i * rowH;
      ctx.save();
      ctx.globalAlpha = k;
      ctx.translate((1 - k) * 60, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(110, ry + 40, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0a0a';
      ctx.textAlign = 'center';
      displayFont(ctx, 28);
      ctx.fillText(String(i + 1), 110, ry + 42);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f5f5f5';
      displayFont(ctx, 44);
      ctx.fillText(p.name.toUpperCase(), 170, ry + 42);
      ctx.textAlign = 'right';
      ctx.fillStyle = roleColor(p.role);
      const w = p.word === null ? s.whiteLabel : p.word;
      const size = fitSize(ctx, w.toUpperCase(), 520, 40, 22, 800);
      displayFont(ctx, size, 800);
      ctx.fillText(w.toUpperCase(), W - 90, ry + 42);
      ctx.restore();
    });
    ctx.restore();
  }

  private drawGuess(s: Extract<Scene, { type: 'guess' }>, t: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.min(1, t / 0.3);
    roundRect(ctx, 60, H - 330, W - 120, 200, 40);
    ctx.fillStyle = 'rgba(10,10,10,0.8)';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    displayFont(ctx, 60);
    ctx.fillText(s.name.toUpperCase(), W / 2, H - 270);
    ctx.fillStyle = '#c9c9c9';
    displayFont(ctx, 34, 700);
    ctx.fillText(s.label.toUpperCase(), W / 2, H - 190);
    ctx.restore();
  }

  private drawResult(s: Extract<Scene, { type: 'result' }>, t: number) {
    const ctx = this.ctx;
    const k = easeOutBack(t / 0.6);
    ctx.save();
    ctx.globalAlpha = Math.min(1, t / 0.3);
    ctx.translate(W / 2, H / 2);
    ctx.scale(0.8 + 0.2 * k, 0.8 + 0.2 * k);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255,43,43,0.6)';
    ctx.shadowBlur = 60;
    const size = fitSize(ctx, s.title.toUpperCase(), W - 140, 120, 60);
    displayFont(ctx, size);
    ctx.fillText(s.title.toUpperCase(), 0, -160);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#c9c9c9';
    displayFont(ctx, 38, 700);
    ctx.fillText(s.sub, 0, -50);
    // Les deux mots révélés
    roundRect(ctx, -440, 40, 880, 220, 36);
    ctx.fillStyle = 'rgba(10,10,10,0.75)';
    ctx.fill();
    ctx.fillStyle = '#8e8e8e';
    displayFont(ctx, 28, 700);
    ctx.fillText(s.civilLabel.toUpperCase(), -220, 90);
    ctx.fillText(s.undercoverLabel.toUpperCase(), 220, 90);
    ctx.fillStyle = '#ffffff';
    displayFont(ctx, fitSize(ctx, s.civilWord, 400, 52, 26));
    ctx.fillText(s.civilWord, -220, 180);
    ctx.fillStyle = RED;
    displayFont(ctx, fitSize(ctx, s.undercoverWord, 400, 52, 26));
    ctx.fillText(s.undercoverWord, 220, 180);
    ctx.restore();
  }

  private drawPopup(p: LivePopup, now: number) {
    const ctx = this.ctx;
    const t = (now - p.at) / 1000;
    const remaining = (p.duration - (now - p.at)) / 1000;
    const alpha = Math.min(1, t / 0.2, remaining / 0.3);
    if (p.popup.kind === 'vote') {
      const k = easeOutBack(t / 0.4);
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(W / 2, H * 0.3);
      ctx.scale(0.8 + 0.2 * k, 0.8 + 0.2 * k);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      displayFont(ctx, 44);
      const line = `${p.popup.from.toUpperCase()}  ${p.popup.verb.toUpperCase()}  ${p.popup.to.toUpperCase()}`;
      const size = fitSize(ctx, line, W - 200, 48, 28);
      displayFont(ctx, size);
      const tw = ctx.measureText(line).width + 100;
      roundRect(ctx, -tw / 2, -60, tw, 120, 60);
      ctx.fillStyle = 'rgba(10,10,10,0.85)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = RED;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, 0, 2);
      ctx.restore();
      return;
    }
    if (p.popup.kind === 'guess') {
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(W / 2, H * 0.22);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      roundRect(ctx, -460, -150, 920, 300, 44);
      ctx.fillStyle = 'rgba(10,10,10,0.85)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = p.popup.correct ? '#37d67a' : RED;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      displayFont(ctx, fitSize(ctx, `« ${p.popup.guess} »`, 820, 64, 30));
      ctx.fillText(`« ${p.popup.guess} »`, 0, -40);
      ctx.fillStyle = p.popup.correct ? '#37d67a' : RED;
      displayFont(ctx, 44);
      ctx.fillText(p.popup.label.toUpperCase(), 0, 60);
      ctx.restore();
      return;
    }
    // Élimination : flash rouge puis grande carte qui claque (1 s), maintenue ensuite.
    const flash = Math.max(0, 0.55 - t * 2.2);
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,43,43,${flash})`;
      ctx.fillRect(0, 0, W, H);
    }
    const k = easeOutBack(t / 0.9);
    const cw = 760;
    const ch = 620;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(W / 2, H * 0.45);
    ctx.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k);
    ctx.rotate((1 - k) * -0.08);
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 80;
    ctx.shadowOffsetY = 30;
    roundRect(ctx, -cw / 2, -ch / 2, cw, ch, 48);
    const g = ctx.createLinearGradient(0, -ch / 2, 0, ch / 2);
    g.addColorStop(0, '#262626');
    g.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 4;
    ctx.strokeStyle = roleColor(p.popup.role);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.popup.color;
    ctx.beginPath();
    ctx.arc(0, -205, 66, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0a0a';
    displayFont(ctx, 56);
    ctx.fillText(initials(p.popup.name), 0, -201);
    ctx.fillStyle = '#ffffff';
    displayFont(ctx, fitSize(ctx, p.popup.name.toUpperCase(), cw - 100, 84, 40));
    ctx.fillText(p.popup.name.toUpperCase(), 0, -70);
    ctx.fillStyle = '#8e8e8e';
    displayFont(ctx, 30, 700);
    ctx.fillText(p.popup.outLabel.toUpperCase(), 0, 20);
    ctx.fillStyle = roleColor(p.popup.role);
    ctx.shadowColor = p.popup.role === 'undercover' ? 'rgba(255,43,43,0.7)' : 'rgba(255,255,255,0.4)';
    ctx.shadowBlur = 50;
    displayFont(ctx, fitSize(ctx, p.popup.roleLabel.toUpperCase(), cw - 100, 96, 44));
    ctx.fillText(p.popup.roleLabel.toUpperCase(), 0, 130);
    ctx.restore();
  }
}

