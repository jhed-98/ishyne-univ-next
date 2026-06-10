import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { sanityFetch } from '@/sanity/lib/client';
import { ACTIVE_CAMPAIGNS_QUERY, SETTINGS_QUERY } from '@/sanity/lib/queries';
import type { Campaign, SiteSettings } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CampaignBanner from '@/components/layout/CampaignBanner';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppFAB from '@/components/whatsapp/WhatsAppFAB';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
import Analytics from '@/components/Analytics';
import CampaignInitializer from '@/components/CampaignInitializer';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: `iShyne — ${t('tagline')}`,
    description: t('subtitle'),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en' | 'pt')) {
    notFound();
  }

  const messages = await getMessages();

  // Fetch server data
  let campaigns: Campaign[] = [];
  let settings: SiteSettings | null = null;
  try {
    [campaigns, settings] = await Promise.all([
      sanityFetch<Campaign[]>({ query: ACTIVE_CAMPAIGNS_QUERY, tags: ['campaign'] }),
      sanityFetch<SiteSettings>({ query: SETTINGS_QUERY, tags: ['settings'] }),
    ]);
  } catch {
    // Graceful fallback if Sanity is not configured
    campaigns = [];
    settings = null;
  }

  const activeBanner = campaigns.find((c) => {
    if (!c.activa) return false;
    const now = Date.now();
    return now >= new Date(c.fecha_inicio).getTime() && now <= new Date(c.fecha_fin).getTime();
  });

  const whatsappNumber =
    settings?.whatsapp_numero ?? process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK ?? '51999999999';

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Initialize campaign store on client */}
      <CampaignInitializer campaigns={campaigns} />

      {/* Analytics */}
      {settings?.ga4_id && <Analytics gaId={settings.ga4_id} />}

      {/* Campaign banner */}
      {activeBanner && (
        <CampaignBanner
          banner={activeBanner}
          locale={locale as 'es' | 'en' | 'pt'}
        />
      )}

      <Header whatsappNumber={whatsappNumber} locale={locale} />

      <main id="main-content" className="min-h-screen">
        {children}
      </main>

      <Footer settings={settings} locale={locale} />

      {/* Cart Drawer */}
      <CartDrawer locale={locale} whatsappNumber={whatsappNumber} />

      {/* WhatsApp FAB */}
      <WhatsAppFAB whatsappNumber={whatsappNumber} locale={locale} />

      {/* Chatbot */}
      <ChatbotWidget locale={locale} />
    </NextIntlClientProvider>
  );
}
