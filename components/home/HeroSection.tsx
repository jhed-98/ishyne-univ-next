'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { WhatsAppIcon, ArrowRightIcon } from '@/components/icons';
import { trackEvent } from '@/components/Analytics';

interface HeroSectionProps {
  locale: string;
  whatsappNumber: string;
  heroImageUrl?: string;
}

export default function HeroSection({ locale, whatsappNumber, heroImageUrl }: HeroSectionProps) {
  const t = useTranslations('hero');

  const handleWhatsApp = () => {
    trackEvent('whatsapp_click', { source: 'hero' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-onyx">
      {/* Background image */}
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
          alt="iShyne — moda femenina de lujo"
          fill
          priority
          className="object-cover object-top opacity-40"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-onyx via-onyx-light to-onyx" />
      )}

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-onyx via-transparent to-onyx" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-onyx to-transparent" />

      {/* Decorative gold line */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-champagne/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-champagne/80" />
        <div className="w-px h-24 bg-gradient-to-b from-champagne/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl">
          {/* Pre-headline */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="h-px w-12 bg-champagne/60" />
            <span className="text-rose-gold text-xs tracking-[0.4em] uppercase font-medium">
              Nueva Colección
            </span>
          </div>

          {/* Main tagline */}
          <h1
            className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-cream leading-tight animate-slide-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          >
            {t('tagline').split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'gradient-text block' : 'block'}>
                {word}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="mt-6 text-lg text-cream/60 font-light leading-relaxed max-w-lg animate-slide-up"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up"
            style={{ animationDelay: '350ms', animationFillMode: 'both' }}
          >
            <Link
              href={`/${locale}#catalogo`}
              id="hero-catalog-cta"
              className="group inline-flex items-center gap-2 bg-champagne text-black px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-rose-gold hover:text-black transition-all duration-300 shadow-xl shadow-champagne/10 hover:shadow-rose-gold/20"
            >
              {t('cta')}
              <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              id="hero-whatsapp-cta"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 border border-cream/20 text-cream/80 px-8 py-4 rounded-full font-medium text-sm hover:bg-champagne/5 hover:border-champagne/50 hover:text-champagne transition-all duration-300"
            >
              <WhatsAppIcon size={16} />
              {t('whatsapp_cta')}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <div className="w-px h-8 bg-gradient-to-b from-champagne/60 to-transparent" />
        <div className="w-1 h-1 rounded-full bg-champagne/60" />
      </div>
    </section>
  );
}
