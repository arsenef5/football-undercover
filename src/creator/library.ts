/**
 * Bibliothèque des vidéos du mode créateur : les enregistrements sont GARDÉS dans l'app
 * (dossier privé de l'app sur téléphone, IndexedDB sur le web) jusqu'à ce qu'on les supprime.
 * L'index (nom, date, durée, poids, vignette) est en localStorage ; les fichiers à côté.
 */
import { Capacitor } from '@capacitor/core';

export interface VideoEntry {
  id: string;
  name: string;
  createdAt: number;
  durationMs: number;
  bytes: number;
  mime: string;
  ext: 'mp4' | 'webm';
  /** Vignette JPEG (data URL), ~20 Ko. */
  thumb?: string;
}

const INDEX_KEY = 'fu.videos.v1';
const DIR = 'videos';
const isNative = Capacitor.isNativePlatform();

export function listVideos(): VideoEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]') as VideoEntry[];
    return Array.isArray(raw) ? raw.sort((a, b) => b.createdAt - a.createdAt) : [];
  } catch {
    return [];
  }
}

function writeIndex(entries: VideoEntry[]) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(entries));
  } catch {
    /* stockage plein : l'index n'est pas mis à jour */
  }
}

/* ---------- Web : IndexedDB ---------- */

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('fu-videos', 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains('files')) req.result.createObjectStore('files');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(id: string, blob: Blob): Promise<void> {
  return idb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').put(blob, id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      }),
  );
}

function idbGet(id: string): Promise<Blob | null> {
  return idb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const req = db.transaction('files', 'readonly').objectStore('files').get(id);
        req.onsuccess = () => resolve((req.result as Blob) ?? null);
        req.onerror = () => reject(req.error);
      }),
  );
}

function idbDelete(id: string): Promise<void> {
  return idb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      }),
  );
}

/* ---------- Natif : Filesystem (dossier privé de l'app) ---------- */

const toBase64 = (part: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(part);
  });

async function nativeWrite(path: string, blob: Blob): Promise<void> {
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  // Tranches multiples de 3 octets : chaque morceau base64 se concatène proprement.
  const CHUNK = 6 * 1024 * 1024;
  for (let offset = 0; offset < blob.size; offset += CHUNK) {
    const data = await toBase64(blob.slice(offset, Math.min(blob.size, offset + CHUNK)));
    if (offset === 0) await Filesystem.writeFile({ path, data, directory: Directory.Data, recursive: true });
    else await Filesystem.appendFile({ path, data, directory: Directory.Data });
  }
}

async function nativeUri(path: string): Promise<string> {
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const { uri } = await Filesystem.getUri({ path, directory: Directory.Data });
  return uri;
}

/* ---------- API ---------- */

function uid(): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  return `${stamp}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Enregistre une vidéo dans la bibliothèque et renvoie sa fiche. */
export async function saveVideo(blob: Blob, meta: { durationMs: number; thumb?: string }): Promise<VideoEntry> {
  const ext: VideoEntry['ext'] = blob.type.includes('mp4') ? 'mp4' : 'webm';
  const id = uid();
  const entry: VideoEntry = {
    id,
    name: `football-undercover-${id}.${ext}`,
    createdAt: Date.now(),
    durationMs: meta.durationMs,
    bytes: blob.size,
    mime: blob.type || (ext === 'mp4' ? 'video/mp4' : 'video/webm'),
    ext,
    thumb: meta.thumb,
  };
  if (isNative) await nativeWrite(`${DIR}/${entry.name}`, blob);
  else await idbPut(id, blob);
  writeIndex([entry, ...listVideos().filter((v) => v.id !== id)]);
  return entry;
}

export async function deleteVideo(id: string): Promise<void> {
  const entry = listVideos().find((v) => v.id === id);
  writeIndex(listVideos().filter((v) => v.id !== id));
  if (!entry) return;
  try {
    if (isNative) {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      await Filesystem.deleteFile({ path: `${DIR}/${entry.name}`, directory: Directory.Data });
    } else {
      await idbDelete(id);
    }
  } catch {
    /* fichier déjà absent */
  }
}

/** URL lisible par un <video> (aperçu). Sur le web, à révoquer après usage. */
export async function videoUrl(id: string): Promise<string | null> {
  const entry = listVideos().find((v) => v.id === id);
  if (!entry) return null;
  if (isNative) return Capacitor.convertFileSrc(await nativeUri(`${DIR}/${entry.name}`));
  const blob = await idbGet(id);
  return blob ? URL.createObjectURL(blob) : null;
}

/** Feuille de partage (Photos, TikTok, AirDrop…) sur téléphone ; téléchargement sur le web. */
export async function shareVideo(id: string): Promise<boolean> {
  const entry = listVideos().find((v) => v.id === id);
  if (!entry) return false;
  try {
    if (isNative) {
      const { Share } = await import('@capacitor/share');
      await Share.share({ title: 'Football Undercover', url: await nativeUri(`${DIR}/${entry.name}`) });
      return true;
    }
    const blob = await idbGet(id);
    if (!blob) return false;
    return shareBlob(blob, entry.name);
  } catch {
    return false;
  }
}

/** Partage d'un blob : feuille native si possible, sinon téléchargement. */
export async function shareBlob(blob: Blob, name: string): Promise<boolean> {
  if (isNative) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');
      await nativeWrite(`share/${name}`, blob);
      const { uri } = await Filesystem.getUri({ path: `share/${name}`, directory: Directory.Data });
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
      /* annulé : on propose le téléchargement */
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

export function formatBytes(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} Go`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} Mo`;
  return `${Math.max(1, Math.round(n / 1e3))} Ko`;
}

export function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
