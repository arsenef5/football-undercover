import { useEffect, useState } from 'react';
import { PlayIcon, ShareIcon, TrashIcon, VideoIcon } from '../components/Icons';
import { Button, Confirm, EmptyState, Screen, Sheet, useToast } from '../components/ui';
import { deleteVideo, formatBytes, formatDuration, listVideos, shareVideo, videoUrl, type VideoEntry } from '../creator/library';
import { T } from '../i18n';
import { isNative } from '../native';
import { useNav } from '../nav';

function dateLabel(ts: number): string {
  return new Date(ts).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/** Mes vidéos : les parties filmées, gardées dans l'app jusqu'à suppression. */
export function Videos() {
  const nav = useNav();
  const [items, setItems] = useState<VideoEntry[]>(() => listVideos());
  const [askDelete, setAskDelete] = useState<VideoEntry | null>(null);
  const [playing, setPlaying] = useState<{ entry: VideoEntry; url: string } | null>(null);
  const [toast, showToast] = useToast();

  useEffect(() => {
    if (!playing || isNative) return;
    const url = playing.url;
    return () => URL.revokeObjectURL(url);
  }, [playing]);

  const play = async (entry: VideoEntry) => {
    const url = await videoUrl(entry.id);
    if (!url) {
      showToast(T.videos.missing);
      return;
    }
    setPlaying({ entry, url });
  };

  const share = async (entry: VideoEntry) => {
    const ok = await shareVideo(entry.id);
    if (!ok) showToast(T.creator.saveFailed);
  };

  const remove = async () => {
    if (!askDelete) return;
    await deleteVideo(askDelete.id);
    setAskDelete(null);
    setItems(listVideos());
  };

  const total = items.reduce((s, v) => s + v.bytes, 0);

  return (
    <>
      <Screen title={T.videos.title} onBack={() => nav.back()}>
        {items.length === 0 ? (
          <EmptyState icon={<VideoIcon size={40} />} title={T.videos.empty} hint={T.videos.emptyHint} />
        ) : (
          <>
            <p className="muted" style={{ fontSize: 12 }}>
              {T.videos.total(items.length, formatBytes(total))}
              {isNative ? ` ${T.videos.shareHint}` : ''}
            </p>
            <div className="videos">
              {items.map((v) => (
                <div key={v.id} className="video-row">
                  <button type="button" className="thumb" onClick={() => void play(v)} aria-label={T.videos.play}>
                    {v.thumb ? <img src={v.thumb} alt="" /> : <VideoIcon />}
                    <span className="play">
                      <PlayIcon size={18} />
                    </span>
                  </button>
                  <div className="grow">
                    <div className="name">{dateLabel(v.createdAt)}</div>
                    <div className="sub">
                      {formatDuration(v.durationMs)} · {formatBytes(v.bytes)} · {v.ext.toUpperCase()}
                    </div>
                    <div className="acts">
                      <Button small inline onClick={() => void share(v)}>
                        <ShareIcon size={14} />
                        {T.videos.share}
                      </Button>
                      <Button small inline variant="ghost" onClick={() => setAskDelete(v)} aria-label={T.videos.delete}>
                        <TrashIcon size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Screen>

      <Sheet open={playing !== null} onClose={() => setPlaying(null)} title={playing ? dateLabel(playing.entry.createdAt) : ''}>
        {playing ? (
          <video className="video-player" src={playing.url} controls autoPlay playsInline />
        ) : null}
      </Sheet>

      <Confirm
        open={askDelete !== null}
        title={T.videos.delete}
        text={T.videos.deleteConfirm}
        confirmLabel={T.videos.delete}
        danger
        onCancel={() => setAskDelete(null)}
        onConfirm={() => void remove()}
      />
      {toast}
    </>
  );
}
