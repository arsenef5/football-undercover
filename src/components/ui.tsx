import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Role } from '../game/types';
import { T } from '../i18n';
import { releaseBanner, suppressBanner } from '../monetization/ads';
import { tap } from '../native';
import { BackIcon, CardIcon, CheckIcon, GlassesIcon, JerseyIcon, MinusIcon, PlusIcon, SpyIcon } from './Icons';

/* ------------------------------------------------------------------ */
/* Boutons                                                             */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  small?: boolean;
  inline?: boolean;
  disabled?: boolean;
  sub?: string;
  className?: string;
  type?: 'button' | 'submit';
  haptic?: boolean;
  /** Boutons à icône seule : libellé pour les lecteurs d'écran. */
  'aria-label'?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  small,
  inline,
  disabled,
  sub,
  className = '',
  type = 'button',
  haptic = true,
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`btn btn-${variant} ${small ? 'btn-sm' : ''} ${inline ? 'btn-inline' : ''} ${className}`}
      onClick={() => {
        if (haptic) void tap();
        onClick?.();
      }}
    >
      {sub ? (
        <span className="col">
          <span>{children}</span>
          <span className="btn-sub">{sub}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  label,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={`icon-btn ${danger ? 'danger' : ''}`}
      aria-label={label}
      onClick={() => {
        void tap();
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Avatars et rôles                                                    */
/* ------------------------------------------------------------------ */

/** Initiales d'un nom : « Kylian » → « K », « Jean Pierre » → « JP », « Ebz » → « E ». */
export function initials(name: string): string {
  const parts = name
    .trim()
    .split(/[\s\-_.]+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Empêche un mot seul en fin de ligne : la dernière espace devient insécable. */
export function nb(s: string): string {
  return s.replace(/ (\S+)$/, String.fromCharCode(160) + '$1');
}

export function Avatar({
  name,
  color,
  photo,
  size = 'md',
  dead,
}: {
  name: string;
  color: string;
  photo?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dead?: boolean;
}) {
  return (
    <span className={`avatar ${size} ${dead ? 'dead' : ''} ${photo ? 'has-photo' : ''}`} style={{ ['--c' as string]: color }} aria-hidden>
      {photo ? <img src={photo} alt="" draggable={false} /> : initials(name)}
    </span>
  );
}

export function RoleIcon({ role, size = 22 }: { role: Role; size?: number }) {
  if (role === 'civil') return <JerseyIcon size={size} />;
  if (role === 'undercover') return <GlassesIcon size={size} />;
  return <CardIcon size={size} />;
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`badge ${role}`}>
      <RoleIcon role={role} size={14} />
      {T.roles[role]}
    </span>
  );
}

export { SpyIcon };

/* ------------------------------------------------------------------ */
/* Contrôles                                                           */
/* ------------------------------------------------------------------ */

export function Chip({
  on,
  onClick,
  children,
  tone,
}: {
  on?: boolean;
  onClick?: () => void;
  children: ReactNode;
  tone?: 'gold';
}) {
  return (
    <button
      type="button"
      className={`chip ${on ? 'is-on' : ''} ${tone ?? ''}`}
      onClick={() => {
        void tap();
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`toggle ${on ? 'is-on' : ''}`}
      onClick={() => {
        void tap();
        onChange(!on);
      }}
    />
  );
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        aria-label={`${label} : moins`}
        disabled={value <= min}
        onClick={() => {
          void tap();
          onChange(Math.max(min, value - 1));
        }}
      >
        <MinusIcon size={18} />
      </button>
      <span className="val">{value}</span>
      <button
        type="button"
        aria-label={`${label} : plus`}
        disabled={value >= max}
        onClick={() => {
          void tap();
          onChange(Math.min(max, value + 1));
        }}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  );
}

export function Segmented<V extends string | number>({
  value,
  options,
  onChange,
  full,
}: {
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
  full?: boolean;
}) {
  return (
    <div className={`seg ${full ? 'full' : ''}`}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className={o.value === value ? 'is-on' : ''}
          onClick={() => {
            void tap();
            onChange(o.value);
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CheckMark({ on }: { on: boolean }) {
  return (
    <span className={`check ${on ? 'is-on' : ''}`} aria-hidden>
      <CheckIcon size={16} />
    </span>
  );
}

export function Setting({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="setting">
      <div className="grow">
        <div className="label">{label}</div>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  color,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label: string;
  color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className="slider"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      style={{ ['--pct' as string]: `${pct}%`, ['--c' as string]: color ?? 'var(--red)' }}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

/**
 * Texte qui rétrécit jusqu'à tenir dans son conteneur, sans jamais couper un mot
 * (« CHAMPIONNAT BRÉSILIEN » passe sur deux lignes entières, jamais « CHAMPIONNA-T »).
 */
export function FitText({
  text,
  className = '',
  max,
  min = 16,
}: {
  text: string;
  className?: string;
  max: number;
  min?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let size = max;
    el.style.fontSize = `${size}px`;
    // Un mot plus large que la carte déborde horizontalement : on descend d'un cran jusqu'à ce que ça tienne.
    while (size > min && el.scrollWidth > el.clientWidth + 1) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }, [text, max, min]);
  return (
    <div ref={ref} className={className} style={{ fontSize: max, overflowWrap: 'normal', wordBreak: 'keep-all', hyphens: 'none', width: '100%' }}>
      {text}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feuilles / dialogues                                                */
/* ------------------------------------------------------------------ */

export function Sheet({
  open,
  onClose,
  title,
  children,
  actions,
  dialog,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  dialog?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Bannière publicitaire native masquée tant que la feuille est ouverte (sinon elle cache le bas).
  useEffect(() => {
    if (!open) return;
    suppressBanner();
    return () => releaseBanner();
  }, [open]);

  if (!open) return null;
  // Portail dans la coquille #app : la feuille passe au-dessus de la barre d'onglets et des écrans,
  // quel que soit le contexte d'empilement de l'écran qui l'ouvre.
  const host = typeof document !== 'undefined' ? (document.getElementById('app') ?? document.body) : null;
  const node = (
    <div
      className={`sheet-backdrop ${dialog ? 'center' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`sheet ${dialog ? 'dialog' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        {!dialog ? <div className="grabber" /> : null}
        {title ? <div className="sheet-title display">{title}</div> : null}
        <div className="sheet-body">{children}</div>
        {actions ? <div className="sheet-actions">{actions}</div> : null}
      </div>
    </div>
  );
  return host ? createPortal(node, host) : node;
}

export function Confirm({
  open,
  title,
  text,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  text?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Sheet
      open={open}
      onClose={onCancel}
      dialog
      title={title}
      actions={
        <>
          <Button variant="secondary" onClick={onCancel}>
            {T.common.cancel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel ?? T.common.confirm}
          </Button>
        </>
      }
    >
      {text ? <p className="text-2">{text}</p> : null}
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* Écran                                                               */
/* ------------------------------------------------------------------ */

export function Screen({
  title,
  onBack,
  right,
  footer,
  children,
  withTabbar,
  bodyClass = '',
  headerless,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  withTabbar?: boolean;
  bodyClass?: string;
  headerless?: boolean;
}) {
  return (
    <div className="screen">
      {!headerless ? (
        <header className="screen-header">
          {onBack ? (
            <IconButton label={T.common.back} onClick={onBack}>
              <BackIcon />
            </IconButton>
          ) : (
            <span className="spacer" />
          )}
          <div className="title">{title}</div>
          {right ?? <span className="spacer" />}
        </header>
      ) : null}
      <div className={`screen-body ${withTabbar ? 'with-tabbar' : ''} ${bodyClass}`}>{children}</div>
      {footer ? <div className={`screen-footer ${withTabbar ? 'with-tabbar' : ''}`}>{footer}</div> : null}
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: ReactNode; title: string; hint?: string }) {
  return (
    <div className="empty">
      <div className="big">{icon}</div>
      <div className="t">{title}</div>
      {hint ? <div>{hint}</div> : null}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="section">
      <span className="eyebrow">{children}</span>
      {right}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

export function useToast(): [ReactNode, (msg: string) => void] {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const show = (m: string) => {
    setMsg(m);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 2200);
  };
  const node = msg ? (
    <div className="toast" role="status">
      {msg}
    </div>
  ) : null;
  return [node, show];
}

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

/** Lockup texte : FOOTBALL (blanc) / UNDERCOVER (rouge), l'espion logé dans le second O. */
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`logo ${size}`} role="img" aria-label={T.app.name}>
      <div className="logo-top">
        F<span>O</span>
        <span className="logo-o">
          O
          <SpyIcon />
        </span>
        TBALL
      </div>
      <div className="logo-bottom">UNDERCOVER</div>
    </div>
  );
}
