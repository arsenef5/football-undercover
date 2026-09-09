import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { useStore } from '../store/store';
import { Recorder, type Popup, type RecorderStatus, type Scene } from './recorder';

/**
 * MODE CRÉATEUR 🎥 : un seul enregistreur pour toute l'app. Les écrans de partie lui envoient
 * une « scène » (ce qui doit rester incrusté) et des « popups » (événements d'une seconde ou deux).
 */
interface CreatorValue {
  /** Réglage activé dans la préparation de partie. */
  enabled: boolean;
  status: RecorderStatus;
  recording: boolean;
  hasCamera: boolean;
  hasVideo: boolean;
  error: string | null;
  start: () => Promise<boolean>;
  stop: () => Promise<void>;
  discard: () => void;
  save: () => Promise<boolean>;
  setScene: (scene: Scene) => void;
  popup: (p: Popup) => void;
  /** Aperçu (le canvas composé lui-même). */
  canvas: HTMLCanvasElement | null;
  elapsedMs: number;
  fileName: () => string;
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
  if (rec.current === null && typeof document !== 'undefined') rec.current = makeRecorder();
  const [, force] = useState(0);
  const [elapsedMs, setElapsed] = useState(0);
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

  // Partie abandonnée pendant l'enregistrement : on jette la vidéo.
  useEffect(() => {
    if (!game && rec.current?.status === 'recording') rec.current.discard();
  }, [game]);

  const value = useMemo<CreatorValue>(() => {
    const r = rec.current;
    return {
      enabled,
      status,
      recording: status === 'recording',
      hasCamera: r?.hasCamera ?? false,
      hasVideo: !!r?.lastBlob,
      error: r?.error ?? null,
      start: () => (r ? r.start() : Promise.resolve(false)),
      stop: async () => {
        await r?.stop();
      },
      discard: () => r?.discard(),
      save: () => (r ? r.save() : Promise.resolve(false)),
      setScene: (scene) => r?.setScene(scene),
      popup: (p) => r?.popup(p),
      canvas: r?.canvas ?? null,
      elapsedMs,
      fileName: () => r?.fileName() ?? 'football-undercover.webm',
    };
  }, [enabled, status, elapsedMs]);

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

/** Petit retour caméra flottant (appuie pour l'agrandir) : rassure sur ce qui est filmé. */
export function CreatorPip() {
  const c = useCreator();
  const host = useRef<HTMLDivElement>(null);
  const [big, setBig] = useState(false);

  useEffect(() => {
    const el = host.current;
    const canvas = c.canvas;
    if (!el || !canvas || !c.recording) return;
    el.appendChild(canvas);
    return () => {
      if (canvas.parentNode === el) el.removeChild(canvas);
    };
  }, [c.canvas, c.recording]);

  if (!c.recording) return null;
  return (
    <button
      type="button"
      className={`rec-pip ${big ? 'big' : ''}`}
      aria-label={T.creator.title}
      onClick={() => setBig((v) => !v)}
    >
      <div ref={host} className="rec-canvas" />
      <span className="rec-tag">
        <i />
        {fmt(c.elapsedMs)}
      </span>
      {!c.hasCamera ? <span className="rec-nocam">{T.creator.noCameraShort}</span> : null}
    </button>
  );
}
