'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { CloseIcon, CartIcon, TrashIcon } from '@/components/icons';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

interface CartDrawerProps {
  locale: string;
  whatsappNumber: string;
}

export default function CartDrawer({ locale, whatsappNumber }: CartDrawerProps) {
  const t = useTranslations('cart');
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    },
    [isOpen, closeCart]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-all duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col bg-onyx-light border-l border-onyx-border shadow-2xl transform transition-transform duration-400 ease-out-expo ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-onyx-border">
          <div className="flex items-center gap-3">
            <CartIcon className="text-champagne" size={20} />
            <h2 className="font-playfair text-xl text-cream">{t('title')}</h2>
            {items.length > 0 && (
              <span className="text-xs bg-champagne text-black font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.cantidad, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-cream/40 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10"
                aria-label={t('clear_cart')}
                title={t('clear_cart')}
              >
                <TrashIcon size={16} />
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-cream/50 hover:text-cream hover:bg-rose-gold/10 transition-all"
              aria-label="Cerrar carrito"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 rounded-full bg-onyx border border-onyx-border flex items-center justify-center">
              <CartIcon className="text-champagne/30" size={32} />
            </div>
            <div className="text-center">
              <p className="font-playfair text-xl text-cream/60">{t('empty')}</p>
              <p className="text-sm text-cream/30 mt-1">{t('empty_sub')}</p>
            </div>
            <button
              onClick={closeCart}
              className="mt-2 bg-champagne/10 border border-champagne/30 text-champagne px-6 py-2.5 rounded-full text-sm font-medium hover:bg-champagne/20 transition-all"
            >
              Explorar colección →
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              {items.map((item) => (
                <CartItem key={`${item.product._id}-${item.talla}`} item={item} />
              ))}
            </div>

            {/* Summary */}
            <CartSummary locale={locale} whatsappNumber={whatsappNumber} />
          </>
        )}
      </aside>
    </>
  );
}
