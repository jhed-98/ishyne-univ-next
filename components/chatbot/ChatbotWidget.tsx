'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useCampaignStore } from '@/store/campaignStore';
import { ChatIcon, CloseIcon, SendIcon, SparkleIcon } from '@/components/icons';
import type { Locale } from '@/types';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: number;
  isTyping?: boolean;
  options?: string[];
  products?: Array<{ nombre: string; slug: string }>;
}

interface ChatbotWidgetProps {
  locale: string;
}

const SESSION_KEY = 'ishyne-chatbot-history';

const KEYWORD_MAP: Record<string, string[]> = {
  catalog: ['catálogo', 'catalogo', 'productos', 'ropa', 'prendas', 'catalog', 'products', 'catalogo', 'catálog'],
  sizes: ['talla', 'tallas', 'medida', 'medidas', 'size', 'sizes', 'tamaño', 'tamanho'],
  shipping: ['envío', 'envio', 'delivery', 'entrega', 'pago', 'payment', 'precio', 'costo', 'shipping'],
  contact: ['hablar', 'asesor', 'asesora', 'contacto', 'contact', 'person', 'humana', 'human'],
  hello: ['hola', 'hello', 'oi', 'olá', 'buenas', 'hey', 'hi'],
  price: ['precio', 'cuánto', 'cuanto', 'costo', 'vale', 'price', 'cost', 'preço'],
  discount: ['descuento', 'oferta', 'promo', 'sale', 'discount', 'dscto', 'rebaja', 'desconto'],
  featured: ['destacado', 'favorito', 'popular', 'featured', 'destaque'],
};

function detectIntent(text: string): string {
  const lower = text.toLowerCase();
  for (const [intent, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => lower.includes(kw))) return intent;
  }
  return 'default';
}

let msgIdCounter = 0;
function newId() { return `msg-${++msgIdCounter}`; }

export default function ChatbotWidget({ locale }: ChatbotWidgetProps) {
  const t = useTranslations('chatbot');
  const getBannerCampaign = useCampaignStore((s) => s.getBannerCampaign);

  const [isOpen, setIsOpen] = useState(false);
  const [isProactiveBubble, setIsProactiveBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        setMessages(parsed.filter((m) => !m.isTyping));
      } else {
        // Initial greeting
        const greeting: Message = {
          id: newId(),
          text: t('greeting'),
          sender: 'bot',
          timestamp: Date.now(),
          options: [
            t('options.catalog'),
            t('options.sizes'),
            t('options.shipping'),
            t('options.featured'),
          ],
        };
        setMessages([greeting]);
      }
    } catch {
      // sessionStorage unavailable (SSR/private mode)
    }
  }, [t]);

  // Persist to session
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.filter((m) => !m.isTyping)));
    } catch {
      // ignore
    }
  }, [messages]);

  // Proactive bubble after 8s
  useEffect(() => {
    proactiveTimerRef.current = setTimeout(() => {
      if (!isOpen) setIsProactiveBubble(true);
    }, 8000);
    return () => clearTimeout(proactiveTimerRef.current);
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = useCallback(
    (text: string, extra?: { options?: string[]; products?: Message['products'] }) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            text,
            sender: 'bot',
            timestamp: Date.now(),
            ...extra,
          },
        ]);
      }, 1000 + Math.random() * 600);
    },
    []
  );

  const handleIntent = useCallback(
    (intent: string) => {
      const responses = t.raw('responses') as Record<string, string>;

      if (intent === 'contact') {
        addBotMessage(responses.contact);
        return;
      }
      if (intent === 'featured') {
        addBotMessage(responses.featured);
        return;
      }
      if (intent === 'discount') {
        const campaign = getBannerCampaign();
        const discountText = campaign
          ? `${responses.discount} ¡Actualmente hay un ${campaign.descuento}% de descuento activo! 🎉`
          : responses.discount;
        addBotMessage(discountText);
        return;
      }

      const response = responses[intent] ?? responses.default;
      addBotMessage(response);
    },
    [addBotMessage, getBannerCampaign, t]
  );

  const handleOptionClick = (option: string) => {
    const userMsg: Message = {
      id: newId(),
      text: option,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const intent = detectIntent(option);
    handleIntent(intent);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: newId(),
      text: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const intent = detectIntent(input);
    handleIntent(intent);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsProactiveBubble(false);
    clearTimeout(proactiveTimerRef.current);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Proactive bubble */}
      {isProactiveBubble && !isOpen && (
        <div
          className="fixed bottom-24 left-24 z-40 max-w-[220px] bg-onyx-light border border-champagne/30 text-cream/80 text-sm px-4 py-3 rounded-2xl rounded-bl-none shadow-xl animate-slide-up cursor-pointer"
          onClick={handleOpen}
        >
          {t('proactive')}
          <div className="absolute -bottom-2 left-4 w-3 h-3 bg-onyx-light border-r border-b border-champagne/30 rotate-45" />
        </div>
      )}

      {/* Toggle Button */}
      <button
        id="chatbot-toggle-btn"
        onClick={isOpen ? handleClose : handleOpen}
        className="fixed bottom-6 left-[calc(1.5rem+56px+1rem)] z-40 w-12 h-12 rounded-full bg-onyx-light border border-champagne/40 text-champagne flex items-center justify-center hover:scale-110 hover:bg-champagne/10 transition-all duration-300 shadow-lg"
        aria-label={isOpen ? t('close') : 'Abrir chatbot'}
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseIcon size={18} /> : <ChatIcon size={18} />}
      </button>

      {/* Chat Window */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Asistente virtual de iShyne"
        className={`fixed bottom-40 left-6 z-40 w-80 sm:w-96 flex flex-col bg-onyx-light border border-onyx-border rounded-3xl shadow-2xl overflow-hidden transition-all duration-400 ease-out-expo origin-bottom-left ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* Chat Header */}
        <div className="bg-onyx border-b border-onyx-border px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center">
            <SparkleIcon size={16} className="text-champagne" />
          </div>
          <div>
            <p className="font-playfair text-sm text-cream/95 font-medium">iShyne Asistente</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-cream/40">En línea</span>
            </div>
          </div>
          <button onClick={handleClose} className="ml-auto text-cream/40 hover:text-cream/80 transition-colors" aria-label="Cerrar chat">
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-champagne text-black rounded-br-none font-medium'
                      : 'bg-onyx border border-onyx-border text-cream/85 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {/* Quick options */}
                {msg.options && msg.sender === 'bot' && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        className="text-xs px-3 py-1.5 bg-onyx border border-champagne/30 text-champagne/80 rounded-full hover:bg-champagne/10 hover:border-champagne/60 transition-all"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-onyx border border-onyx-border px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-champagne/60" style={{ animation: 'typing 1.2s ease-in-out infinite 0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-champagne/60" style={{ animation: 'typing 1.2s ease-in-out infinite 200ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-champagne/60" style={{ animation: 'typing 1.2s ease-in-out infinite 400ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-onyx-border p-3 flex gap-2 bg-onyx/50">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t('placeholder')}
            className="flex-1 bg-onyx border border-onyx-border rounded-xl px-4 py-2.5 text-sm text-cream/90 placeholder:text-cream/25 focus:outline-none focus:border-champagne/40 transition-colors"
            aria-label="Mensaje al chatbot"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-champagne/20 border border-champagne/30 text-champagne flex items-center justify-center hover:bg-champagne/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            aria-label={t('send')}
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
