import { useEffect, useRef, useState } from 'react';
import { CameraIcon, VideoIcon } from '../components/Icons';
import { QuitGame } from '../components/QuitGame';
import { Avatar, Button, Screen, SectionTitle, Segmented, Slider, useToast } from '../components/ui';
import { useCreator } from '../creator/CreatorContext';
import type { DeviceInfo, Fit } from '../creator/recorder';
import { fileToPhoto } from '../data/photo';
import { useGame } from '../game/useGame';
import { T } from '../i18n';
import { thump } from '../native';
import { useNav } from '../nav';
import { useStore } from '../store/store';

/** Libellé court d'une caméra à partir du nom donné par le système. */
function cameraLabel(d: DeviceInfo, index: number): string {
  const l = d.label.toLowerCase();
  const wide = /ultra|wide|grand/.test(l) ? ' · 0,5×' : /tele|télé/.test(l) ? ' · 2×' : '';
  if (/front|avant|user|face/.test(l)) return `${T.creator.front}${wide}`;
  if (/back|arri|rear|environment/.test(l)) return `${T.creator.back}${wide}`;
  return d.label || `${T.creator.camera} ${index + 1}`;
}

/**
 * Réalisation : aperçu plein cadre de ce qui sera filmé (sans aucun mot), choix de la caméra,
 * du micro, du cadrage et du zoom, photos des joueurs, puis REC. Comme un vrai tournage.
 */
export function CreatorSetup() {
  const creator = useCreator();
  const { game, setPhoto } = useGame();
  const { dispatch } = useStore();
  const nav = useNav();
  const host = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [toast, showToast] = useToast();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [videoId, setVideoId] = useState<string>('');
  const [audioId, setAudioId] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [photoFor, setPhotoFor] = useState<string | null>(null);
  const [, tick] = useState(0);

  // Ouverture de la caméra à l'arrivée, fermeture si on quitte sans filmer.
  useEffect(() => {
    let alive = true;
    void creator.openCamera({ facing: 'user' }).then(async () => {
      if (!alive) return;
      const list = await creator.listDevices();
      if (alive) setDevices(list);
    });
    const id = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Le canvas composé sert d'aperçu : à ce stade il ne contient que la caméra et le logo.
  useEffect(() => {
    const el = host.current;
    const canvas = creator.canvas;
    if (!el || !canvas) return;
    el.appendChild(canvas);
    return () => {
      if (canvas.parentNode === el) el.removeChild(canvas);
    };
  }, [creator.canvas]);

  if (!game) return null;

  const cams = devices.filter((d) => d.kind === 'videoinput');
  const mics = devices.filter((d) => d.kind === 'audioinput');
  const info = creator.info();
  const mirrored = info?.facing !== 'environment';

  const pickCamera = async (id: string) => {
    setVideoId(id);
    setBusy(true);
    await creator.openCamera({ videoDeviceId: id || undefined, facing: id ? undefined : 'user' });
    setBusy(false);
  };
  const pickMic = async (id: string) => {
    setAudioId(id);
    setBusy(true);
    await creator.openCamera({ audioDeviceId: id || undefined });
    setBusy(false);
  };

  const rec = async () => {
    if (busy) return;
    setBusy(true);
    const ok = await creator.beginRecording();
    setBusy(false);
    if (!ok) {
      showToast(T.creator.unsupported);
      return;
    }
    void thump();
    nav.replace({ name: 'reveal' });
  };

  const skip = () => {
    creator.skipForGame(game.id);
    creator.closeCamera();
    nav.replace({ name: 'reveal' });
  };

  const onPhoto = async (file: File | undefined) => {
    const id = photoFor;
    setPhotoFor(null);
    if (!file || !id) return;
    try {
      const photo = await fileToPhoto(file);
      setPhoto(id, photo);
      dispatch({ type: 'player/update', id, patch: { photo } });
    } catch {
      showToast(T.players.photoFailed);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <>
      <Screen
        title={T.creator.setupTitle}
        right={<QuitGame />}
        footer={
          <>
            <button type="button" className="rec-btn" onClick={() => void rec()} disabled={busy} aria-label={T.creator.recHint}>
              <span className="dot" />
              <span className="display">{T.creator.rec}</span>
              <span className="sub">{T.creator.recHint}</span>
            </button>
            <Button variant="ghost" small onClick={skip}>
              {T.creator.noRec}
            </Button>
          </>
        }
      >
        <div className={`cam-preview ${mirrored ? 'mirror' : ''} ${creator.hasCamera ? '' : 'no-cam'}`}>
          <div ref={host} className="cam-canvas" />
          {!creator.hasCamera ? <div className="cam-off">{T.creator.cameraOff}</div> : null}
          {info && info.width > 0 ? (
            <span className="cam-info">{T.creator.info(info.width, info.height, info.frameRate)}</span>
          ) : null}
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
          {T.creator.setupHint}
        </p>

        {cams.length > 1 ? (
          <>
            <SectionTitle>{T.creator.camera}</SectionTitle>
            <div className="chips scroll">
              {cams.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  className={`chip ${videoId === d.id || (!videoId && i === 0 && info?.facing === 'user') ? 'is-on' : ''}`}
                  onClick={() => void pickCamera(d.id)}
                >
                  <CameraIcon size={14} />
                  {cameraLabel(d, i)}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <SectionTitle>{T.creator.framing}</SectionTitle>
        <Segmented<Fit>
          full
          value={creator.fit}
          options={[
            { value: 'cover', label: T.creator.fitCover },
            { value: 'contain', label: T.creator.fitContain },
          ]}
          onChange={(v) => creator.setFit(v)}
        />

        {info?.zoom ? (
          <div className="wrow" style={{ marginTop: 12 }}>
            <div className="lbl">
              <span>{T.creator.zoom}</span>
              <span className="pct">{info.zoom.value.toFixed(1)}×</span>
            </div>
            <Slider
              value={info.zoom.value}
              min={info.zoom.min}
              max={info.zoom.max}
              step={info.zoom.step}
              label={T.creator.zoom}
              onChange={(v) => void creator.setZoom(v)}
            />
          </div>
        ) : null}

        {mics.length > 1 ? (
          <>
            <SectionTitle>{T.creator.mic}</SectionTitle>
            <div className="chips scroll">
              <button type="button" className={`chip ${!audioId ? 'is-on' : ''}`} onClick={() => void pickMic('')}>
                {T.creator.defaultMic}
              </button>
              {mics.map((d, i) => (
                <button key={d.id} type="button" className={`chip ${audioId === d.id ? 'is-on' : ''}`} onClick={() => void pickMic(d.id)}>
                  {d.label || `${T.creator.mic} ${i + 1}`}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <SectionTitle>{T.creator.casting}</SectionTitle>
        <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>
          {T.creator.castingHint}
        </p>
        <div className="list">
          {game.players.map((p) => (
            <div key={p.id} className="row compact">
              <Avatar name={p.name} color={p.color} photo={p.photo} size="sm" />
              <span className="grow name">{p.name}</span>
              <Button
                small
                inline
                variant={p.photo ? 'ghost' : 'secondary'}
                onClick={() => {
                  setPhotoFor(p.id);
                  window.setTimeout(() => fileRef.current?.click(), 0);
                }}
              >
                <CameraIcon size={14} />
                {p.photo ? T.players.photoChange : T.players.photoAdd}
              </Button>
            </div>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="user" hidden aria-hidden tabIndex={-1} onChange={(e) => void onPhoto(e.target.files?.[0])} />

        <div className="center muted" style={{ fontSize: 12, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <VideoIcon size={14} />
          {T.creator.hint}
        </div>
      </Screen>
      {toast}
    </>
  );
}
