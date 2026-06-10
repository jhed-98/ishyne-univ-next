'use client';

import { useState } from 'react';
import { CloseIcon } from '@/components/icons';
import type { Campaign, Locale } from '@/types';

interface CampaignBannerProps {
  banner: Campaign;
  locale: Locale;
}

export default function CampaignBanner({ banner, locale }: CampaignBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const text =
    banner.banner_textos[locale] ??
    banner.banner_textos.es ??
    `${banner.nombre} — ${banner.descuento}% de descuento`;

  const bgColor = banner.color_hex ?? '#D4AF37';

  return (
    <div
      className="relative z-50 py-2.5 px-4 text-center text-sm font-medium transition-all"
      style={{ backgroundColor: bgColor }}
      role="banner"
      aria-label="Campaña activa"
    >
      <p className="text-black font-poppins pr-8">{text}</p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black transition-colors"
        aria-label="Cerrar banner"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
