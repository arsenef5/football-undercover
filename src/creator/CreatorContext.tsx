import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { useStore } from '../store/store';
import { saveVideo, type VideoEntry } from './library';
import { Recorder, type CameraInfo, type CameraOptions, type DeviceInfo, type Fit, type Popup, type RecorderStatus, type Scene } from './recorder';

/**
 * MODE CRÉATEUR 🎥 : un seul enregistreur pour toute l'app. L'écran « Réalisation » ouvre la caméra
 * en aperçu, puis les écrans de partie envoient une « scène » (ce qui reste incrusté) et des
 * « popups » (événements d'une seconde ou deux). À l'arrêt, la vidéo est rangée dans Mes vidéos.
 */
interface CreatorValue {
  /** Réglage activé dans la préparation de partie. */
  enabled: boolean;
  status: RecorderStatus;
  recording: boolean;
  previewing: boolean;
  hasCamera: boolean;
  hasVideo: boolean;
  error: string | null;
  /** Le canvas composé : à afficher UNIQUEMENT avant la partie (aucun mot dessus). */
  canvas: HTMLCanvasElement | null;
  openCamera: (opts?: CameraOptions) => Promise<boolean>;
  closeCamera: () => void;
  beginRecording: () => Promise<boolean>;
  start: () => Promise<boolean>;
  stop: () => Promise<VideoEntry | null>;
  discard: () => void;
  save: () => Promise<boolean>;
  setScene: (scene: Scene) => void;
  popup: (p: Popup) => void;
  listDevices: () => Promise<DeviceInfo[]>;
  info: () => CameraInfo | null;
  setZoom: (value: number) => Promise<void>;
  fit: Fit;
  setFit: (fit: Fit) => void;
  /** Flux caméra brut pour l'aperçu pendant la partie (jamais les incrustations). */
  stream: MediaStream | null;
  elapsedMs: number;
  /** Dernière vidéo rangée dans la bibliothèque. */
  lastSaved: VideoEntry | null;
  /** Partie pour laquelle le joueur a choisi de ne pas filmer. */
  skippedGameId: string | null;
  skipForGame: (gameId: string) => void;
}

const CreatorContext = createContext<CreatorValue | null>(null);

function makeRecorder(): Recorder | null {
  try {
    return new Recorder();
  } catch {
    return null;
  }
}

export function CreatorProvider({ children }: { children: ReactNode }) {
  const { state } = useStore();
  const { game } = useGame();
  const rec = useRef<Recorder | null>(null);
  if (rec.current === null && typeof document !== 'undefined') {
    rec.current = makeRecorder();
    // Aperçu du montage en développement (console : window.__fuRecorder.canvas).
    if (import.meta.env.DEV) (window as unknown as { __fuRecorder?: Recorder | null }).__fuRecorder = rec.current;
  }
  const [, force] = useState(0);
  const [elapsedMs, setElapsed] = useState(0);
  const [fit, setFitState] = useState<Fit>('cover');
  const [lastSaved, setLastSaved] = useState<VideoEntry | null>(null);
  const [skippedGameId, setSkipped] = useState<string | null>(null);
  const enabled = state.settings.creatorMode;

  useEffect(() => {
    const r = rec.current;
    if (!r) return;
    return r.subscribe(() => force((n) => n + 1));
  }, []);

  const status = rec.current?.status ?? 'idle';

  // Chrono d'enregistrement pour l'aperçu.
  useEffect(() => {
    if (status !== 'recording') {
      setElapsed(0);
      return;
    }
    const id = window.setInterval(() => setElapsed(rec.current?.elapsedMs ?? 0), 500);
    return () => window.clearInterval(id);
  }, [status]);

  // Partie abandonnée pendant l'enregistrement ou l'aperçu : on jette la vidéo, on libère la caméra.
  useEffect(() => {
    if (game) return;
    if (rec.current?.status === 'recording') rec.current.discard();
    else if (rec.current?.status === 'preview') rec.current.closeCamera();
  }, [game]);

  const value = useMemo<CreatorValue>(() => {
    const r = rec.current;
    return {
      enabled,
      status,
      recording: status === 'recording',
      previewing: status === 'preview',
      hasCamera: r?.hasCamera ?? false,
      hasVideo: !!r?.lastBlob,
      error: r?.error ?? null,
      canvas: r?.canvas ?? null,
      openCamera: (opts) => (r ? r.openCamera(opts) : Promise.resolve(false)),
      closeCamera: () => r?.closeCamera(),
      beginRecording: () => (r ? r.beginRecording() : Promise.resolve(false)),
      start: () => (r ? r.start() : Promise.resolve(false)),
      stop: async () => {
        if (!r) return null;
        const durationMs = r.elapsedMs;
        const thumb = r.thumbnail();
        const blob = await r.stop();
        if (!blob) return null;
        try {
          const entry = await saveVideo(blob, { durationMs, thumb });
          setLastSaved(entry);
          return entry;
        } catch {
          return null;
        }
      },
      discard: () => r?.discard(),
      save: () => (r ? r.save() : Promise.resolve(false)),
      setScene: (scene) => r?.setScene(scene),
      popup: (p) => r?.popup(p),
      listDevices: () => (r ? r.listDevices() : Promise.resolve([])),
      info: () => r?.info() ?? null,
      setZoom: (v) => (r ? r.setZoom(v) : Promise.resolve()),
      fit,
      setFit: (f) => {
        if (r) r.fit = f;
        setFitState(f);
      },
      stream: r?.stream ?? null,
      elapsedMs,
      lastSaved,
      skippedGameId,
      skipForGame: (id) => setSkipped(id),
    };
  }, [enabled, status, elapsedMs, fit, lastSaved, skippedGameId]);

  return <CreatorContext.Provider value={value}>{children}</CreatorContext.Provider>;
}

export function useCreator(): CreatorValue {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator doit être utilisé sous CreatorProvider');
  return ctx;
}

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Petit retour caméra flottant pendant la partie (appuie pour l'agrandir). Il montre la caméra
 * BRUTE, sans les incrustations : les mots des autres n'apparaissent jamais sur le téléphone.
 */
export function CreatorPip() {
  const c = useCreator();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [big, setBig] = useState(false);
  const mirrored = c.info()?.facing !== 'environment';

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.srcObject = c.stream;
    if (c.stream) void v.play().catch(() => undefined);
    return () => {
      v.srcObject = null;
    };
  }, [c.stream, c.recording]);

  if (!c.recording) return null;
  return (
    <button
      type="button"
      className={`rec-pip ${big ? 'big' : ''} ${c.stream ? '' : 'no-cam'} ${mirrored ? 'mirror' : ''} fit-${c.fit}`}
      aria-label={T.creator.title}
      onClick={() => setBig((v) => !v)}
    >
      <video ref={videoRef} muted playsInline autoPlay />
      <span className="rec-tag">
        <i />
        {fmt(c.elapsedMs)}
      </span>
      {!c.stream ? <span className="rec-nocam">{T.creator.noCameraShort}</span> : null}
    </button>
  );
}
