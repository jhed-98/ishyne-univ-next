import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from '@/components/icons';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings | null;
  locale: string;
}

export default function Footer({ settings, locale }: FooterProps) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const instagram = settings?.redes_sociales?.instagram;
  const tiktok = settings?.redes_sociales?.tiktok;
  const whatsapp = settings?.whatsapp_numero ?? process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK;

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}`, label: tNav('home') },
    { href: `/${locale}#catalogo`, label: tNav('catalog') },
    { href: `/${locale}/nosotros`, label: tNav('about') },
  ];

  return (
    <footer className="bg-onyx border-t border-onyx-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h2 className="font-playfair text-2xl font-bold gradient-text">iShyne</h2>
              <p className="text-sm text-rose-gold/70 tracking-widest uppercase mt-1">
                {t('slogan')}
              </p>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed">
              Moda femenina de lujo en Lima, Perú. Piezas únicas para mujeres que brillan.
            </p>
            <p className="text-cream/30 text-xs flex items-center gap-1">
              <span>📍</span>
              {t('location')}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg text-cream/90 font-medium">
              {t('links_title')}
            </h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-cream/60 hover:text-champagne transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-cream/60 hover:text-champagne transition-colors duration-200"
                >
                  WhatsApp
                </a>
              )}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg text-cream/90 font-medium">
              {t('social_title')}
            </h3>
            <div className="flex gap-4">
              {whatsapp && (
                <a
                  id="footer-whatsapp-link"
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-full border border-onyx-border flex items-center justify-center text-cream/50 hover:text-[#25D366] hover:border-[#25D366] transition-all duration-300"
                >
                  <WhatsAppIcon size={18} />
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-onyx-border flex items-center justify-center text-cream/50 hover:text-rose-gold hover:border-rose-gold transition-all duration-300"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {tiktok && (
                <a
                  href={`https://tiktok.com/${tiktok.replace('@', '@')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full border border-onyx-border flex items-center justify-center text-cream/50 hover:text-cream hover:border-cream transition-all duration-300"
                >
                  <TikTokIcon size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-onyx-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">
            © {currentYear} iShyne. {t('rights')}
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-champagne/60 animate-pulse" />
            <span className="text-xs text-cream/20">Made in Lima 🇵🇪</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
