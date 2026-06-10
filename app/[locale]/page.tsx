import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/client';
import { ALL_PRODUCTS_QUERY } from '@/sanity/lib/queries';
import type { Product } from '@/types';
import HeroSection from '@/components/home/HeroSection';
import BenefitsBar from '@/components/home/BenefitsBar';
import CatalogSection from '@/components/products/CatalogSection';

// Copy the hero image to public/ for serving
const HERO_IMAGE_URL = '/images/hero.jpg';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: `iShyne — ${t('tagline')}`,
    description: t('subtitle'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  let products: Product[] = [];
  try {
    products = await sanityFetch<Product[]>({
      query: ALL_PRODUCTS_QUERY,
      tags: ['product'],
    });
  } catch {
    products = [];
  }

  // Settings for WhatsApp number (passed via layout, use fallback here)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK ?? '51999999999';

  return (
    <>
      <HeroSection
        locale={locale}
        whatsappNumber={whatsappNumber}
        heroImageUrl={HERO_IMAGE_URL}
      />
      <BenefitsBar />
      <CatalogSection products={products} locale={locale} />
    </>
  );
}
