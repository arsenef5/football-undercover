import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number | undefined, p: P) => ({
  width: size ?? 22,
  height: size ?? 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

/** Silhouette de l'espion (chapeau, tête, col relevé). Remplie, pas de contour. */
export function SpyIcon({ size, ...p }: P) {
  return (
    <svg width={size ?? 24} height={size ?? 24} viewBox="0 0 64 64" fill="currentColor" aria-hidden {...p}>
      <path d="M32 3c-8 0-13 3.5-14 9.5L17 21h-5c-4 0-6.5 1.6-6.5 3.2S8 27.5 12 27.5h40c4 0 6.5-1.7 6.5-3.3S56 21 52 21h-5l-1-8.5C45 6.5 40 3 32 3z" />
      <path d="M32 29c-5.5 0-9.5 3.5-9.5 8.5 0 4.5 3.5 8.5 9.5 8.5s9.5-4 9.5-8.5C41.5 32.5 37.5 29 32 29z" />
      <path d="M5 62c0-11 8.5-17 15-19.5L32 52l12-9.5C50.5 45 59 51 59 62H5z" />
    </svg>
  );
}

/** Maillot : le titulaire. */
export function JerseyIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M8 3h3l1 2h0a1 1 0 0 0 0 0c.6 1 1.6 1.5 3 1.5S17.4 6 18 5h0l1-2h3l-2 5-2 1v12H8V9L6 8 3 6z" transform="translate(-1 0)" />
    </svg>
  );
}

/** Lunettes noires : l'undercover. */
export function GlassesIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M2 10h20" />
      <path d="M3 10l1-4h16l1 4" />
      <circle cx="7" cy="14" r="3.5" />
      <circle cx="17" cy="14" r="3.5" />
      <path d="M10.5 13.5c.5-.7 2.5-.7 3 0" />
    </svg>
  );
}

/** Carton (blanc) : le joueur sans mot. */
export function CardIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <rect x="6" y="3" width="12" height="18" rx="2" transform="rotate(-8 12 12)" />
    </svg>
  );
}

export function BackIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ChevronIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function PlusIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)} strokeWidth={3}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function CloseIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function TrashIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}

export function PencilIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17z" />
      <path d="M13 8l3 3" />
    </svg>
  );
}

export function PlayIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)} fill="currentColor" stroke="none">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />
    </svg>
  );
}

export function UsersIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.5 3.5 6" />
    </svg>
  );
}

export function ShieldIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9.5C7.2 20 4 16.5 4 12V6z" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export function PodiumIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 20h18" />
      <rect x="9" y="8" width="6" height="12" />
      <rect x="3" y="12" width="6" height="8" />
      <rect x="15" y="14" width="6" height="6" />
      <path d="M12 3l1 2 2 .3-1.5 1.4.4 2.1L12 7.8 10.1 8.8l.4-2.1L9 5.3l2-.3z" />
    </svg>
  );
}

export function DotsIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)} fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

export function TrophyIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" />
      <path d="M12 13v3M9 20h6M10 16h4v4h-4z" />
    </svg>
  );
}

export function TimerIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 2h6" />
    </svg>
  );
}

export function GearIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

export function CrownIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
    </svg>
  );
}

export function SparkIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)} fill="currentColor" stroke="none">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />
    </svg>
  );
}

export function InfoIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function BallIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l4 3-1.5 4.5h-5L8 10z" />
      <path d="M12 3v4M16 10l4-1M14.5 14.5l2.5 3.5M9.5 14.5L7 18M8 10L4 9" />
    </svg>
  );
}

export function RefreshIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 4v5h-5" />
    </svg>
  );
}

/** Drapeaux dessinés en SVG : les emoji drapeaux ne s'affichent pas sur Windows. */
export function FlagFR({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 30 20" aria-hidden style={{ borderRadius: 3 }}>
      <rect width="10" height="20" fill="#0055a4" />
      <rect x="10" width="10" height="20" fill="#f5f5f5" />
      <rect x="20" width="10" height="20" fill="#ef4135" />
    </svg>
  );
}

export function FlagGB({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 30 20" aria-hidden style={{ borderRadius: 3 }}>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.6" />
      <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4" />
    </svg>
  );
}

export function EyeIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function HomeIcon({ size, ...p }: P) {
  return (
    <svg {...base(size, p)}>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}
