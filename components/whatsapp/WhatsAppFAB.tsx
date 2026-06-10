'use client';

import { trackEvent } from '@/components/Analytics';
import { WhatsAppIcon } from '@/components/icons';

interface WhatsAppFABProps {
  whatsappNumber: string;
  locale: string;
}

const messages: Record<string, string> = {
  es: 'Hola, me gustaría saber más sobre los productos de iShyne.',
  en: 'Hello, I would like to know more about iShyne products.',
  pt: 'Olá, gostaria de saber mais sobre os produtos da iShyne.',
};

export default function WhatsAppFAB({ whatsappNumber, locale }: WhatsAppFABProps) {
  const msg = messages[locale] ?? messages.es;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;

  const handleClick = () => {
    trackEvent('whatsapp_click', { source: 'floating_button' });
  };

  return (
    <a
      id="whatsapp-fab"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 animate-pulse-gold"
      style={{ animationName: 'pulseGold' }}
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
