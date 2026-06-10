'use client';

import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { WhatsAppIcon } from '@/components/icons';
import { trackEvent } from '@/components/Analytics';
import type { Locale } from '@/types';

interface CartSummaryProps {
  locale: string;
  whatsappNumber: string;
}

function buildWhatsAppMessage(
  items: ReturnType<typeof useCartStore.getState>['items'],
  locale: string
): string {
  const greetings: Record<string, string> = {
    es: 'Hola, me interesa hacer el siguiente pedido en iShyne:',
    en: "Hello, I'd like to place the following order at iShyne:",
    pt: 'Olá, gostaria de fazer o seguinte pedido na iShyne:',
  };

  const closings: Record<string, string> = {
    es: '¡Gracias!',
    en: 'Thank you!',
    pt: 'Obrigada!',
  };

  const greeting = greetings[locale] ?? greetings.es;
  const closing = closings[locale] ?? closings.es;

  const lines = items.map(
    (item) =>
      `• ${item.product.nombre} (Talla: ${item.talla}) x${item.cantidad} — S/ ${(item.precioFinal * item.cantidad).toFixed(2)}`
  );

  const total = items.reduce((s, i) => s + i.precioFinal * i.cantidad, 0);
  const totalLine = `TOTAL: S/ ${total.toFixed(2)}`;

  return [greeting, '', ...lines, '', totalLine, '', closing].join('\n');
}

export default function CartSummary({ locale, whatsappNumber }: CartSummaryProps) {
  const t = useTranslations('cart');
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotalSavings = useCartStore((s) => s.getTotalSavings);
  const closeCart = useCartStore((s) => s.closeCart);

  const subtotal = getSubtotal();
  const savings = getTotalSavings();

  const handleCheckout = () => {
    const message = buildWhatsAppMessage(items, locale as Locale);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    trackEvent('begin_checkout', {
      currency: 'PEN',
      value: subtotal,
      items: items.map((i) => ({
        item_id: i.product._id,
        item_name: i.product.nombre,
        quantity: i.cantidad,
        price: i.precioFinal,
      })),
    });

    trackEvent('whatsapp_click', { source: 'cart_checkout' });

    closeCart();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border-t border-onyx-border px-6 py-5 space-y-4 bg-onyx/50">
      {/* Price breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-cream/50">{t('subtotal')}</span>
          <span className="text-cream/80">S/ {subtotal.toFixed(2)}</span>
        </div>
        {savings > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400/80">{t('savings')}</span>
            <span className="text-green-400 font-medium">-S/ {savings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-onyx-border">
          <span className="font-playfair text-lg text-cream">{t('total')}</span>
          <span className="font-bold text-xl text-champagne">
            S/ {(subtotal - savings).toFixed(2)}
          </span>
        </div>
      </div>

      {/* WhatsApp Checkout Button */}
      <button
        id="checkout-whatsapp-btn"
        onClick={handleCheckout}
        className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        <WhatsAppIcon size={20} />
        {t('checkout_whatsapp')}
      </button>

      <p className="text-center text-xs text-cream/25">
        Serás redirigido a WhatsApp con tu pedido listo
      </p>
    </div>
  );
}
