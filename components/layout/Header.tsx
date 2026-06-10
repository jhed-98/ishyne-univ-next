'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { CartIcon, SunIcon, MoonIcon, MenuIcon, CloseIcon } from '@/components/icons';

interface HeaderProps {
  whatsappNumber: string;
  locale: string;
}

const localeLabels: Record<string, string> = { es: 'ES', en: 'EN', pt: 'PT' };
const locales = ['es', 'en', 'pt'];

export default function Header({ whatsappNumber, locale }: HeaderProps) {
  const t = useTranslations('nav');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const itemCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}#catalogo`, label: t('catalog') },
    { href: `/${locale}/nosotros`, label: t('about') },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-onyx/95 backdrop-blur-md border-b border-onyx-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex flex-col leading-none group"
            aria-label="iShyne — Ir al inicio"
          >
            <span className="font-playfair text-xl md:text-2xl font-bold gradient-text group-hover:opacity-90 transition-opacity">
              iShyne
            </span>
            <span className="text-[9px] tracking-[0.3em] text-rose-gold/80 uppercase font-poppins">
              Brilla siempre
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-poppins font-medium text-cream/80 hover:text-champagne transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Locale Switcher */}
            <div className="hidden md:flex items-center gap-1">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}`}
                  className={`text-xs px-2 py-1 rounded transition-all ${
                    locale === loc
                      ? 'text-champagne font-semibold'
                      : 'text-cream/50 hover:text-cream/80'
                  }`}
                >
                  {localeLabels[loc]}
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-cream/70 hover:text-champagne hover:bg-rose-gold/10 transition-all"
                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </button>
            )}

            {/* Cart */}
            <button
              id="cart-toggle-btn"
              onClick={toggleCart}
              className="relative p-2 rounded-full text-cream/70 hover:text-champagne hover:bg-rose-gold/10 transition-all"
              aria-label={`${t('cart')} (${itemCount} artículos)`}
            >
              <CartIcon size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-champagne text-onyx text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce-subtle">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-cream/70 hover:text-champagne transition-all"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-onyx/98 backdrop-blur-md border-t border-onyx-border animate-fade-in">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-playfair text-cream/90 hover:text-champagne transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4 border-t border-onyx-border">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}`}
                  className={`text-sm font-semibold ${
                    locale === loc ? 'text-champagne' : 'text-cream/50'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {localeLabels[loc]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
