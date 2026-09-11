import { PRO_COMBOS_CLAIM } from '../monetization/config';
import { useEffect, useState } from 'react';
import { T } from '../i18n';
import { releaseBanner, suppressBanner } from '../monetization/ads';
import { PRO_PRICE_LABEL } from '../monetization/config';
import { markPromoShown } from '../monetization/promo';
import { thump } from '../native';
import { useNav } from '../nav';
import { CloseIcon } from './Icons';
import { Button, FitText } from './ui';

/**
 * Fenêtre promotionnelle plein écran, dans la DA du logo : le visuel (public/promo-pro.jpg)
 * en fond, un voile noir en bas, le message et le bouton. Sans visuel, le fond reste sombre.
 */
export function ProPromo({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNav();
  const [hasImage, setHasImage] = useState(true);

  useEffect(() => {
    if (!open) return;
    markPromoShown();
    void thump();
    suppressBanner();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      releaseBanner();
    };
  }, [open, onClose]);

  if (!open) return null;

  // « +1 000 mots nouveaux » : le nombre (tout ce qui précède la première lettre) en rouge, insécable.
  const title = T.promo.title(PRO_COMBOS_CLAIM);
  const firstLetter = title.search(/[A-Za-zÀ-ÿ]/);
  const amount = firstLetter > 0 ? title.slice(0, firstLetter).trim() : '';
  const rest = firstLetter > 0 ? title.slice(firstLetter) : title;

  return (
    <div className="promo" role="dialog" aria-modal="true" aria-label={title}>
      {hasImage ? (
        <img className="promo-img" src={`${import.meta.env.BASE_URL}promo-pro.jpg`} alt="" onError={() => setHasImage(false)} />
      ) : null}
      <div className="promo-shade" aria-hidden />
      <button type="button" className="icon-btn promo-close" aria-label={T.common.close} onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="promo-content">
        <span className="eyebrow gold">{T.pro.title}</span>
        <div className="display promo-title">
          {amount ? <span className="red promo-amount">{amount}</span> : null}
          {/* « combinaisons » est un seul mot très large : il rétrécit jusqu'à tenir, jamais coupé (iPhone Pro Max compris). */}
          <FitText className="promo-word" text={rest} max={46} min={22} />
        </div>
        <p className="promo-sub">{T.promo.sub}</p>
        <Button
          variant="gold"
          onClick={() => {
            onClose();
            nav.go({ name: 'pro' });
          }}
        >
          {T.promo.cta(PRO_PRICE_LABEL)}
        </Button>
        <Button variant="ghost" small onClick={onClose}>
          {T.promo.later}
        </Button>
      </div>
    </div>
  );
}
