import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/client';
import {
  PRODUCT_BY_SLUG_QUERY,
  ALL_PRODUCT_SLUGS_QUERY,
  SETTINGS_QUERY,
} from '@/sanity/lib/queries';
import type { Product, SiteSettings } from '@/types';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import { ChevronRightIcon } from '@/components/icons';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>({
      query: ALL_PRODUCT_SLUGS_QUERY,
      tags: ['product'],
    });
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  try {
    const product = await sanityFetch<Product>({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
      tags: ['product'],
    });
    if (!product) return {};
    return {
      title: `${product.nombre} | iShyne`,
      description: product.descripcion ?? `${product.nombre} — moda femenina de lujo en Lima, Perú.`,
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'product' });

  let product: Product | null = null;
  let settings: SiteSettings | null = null;

  try {
    [product, settings] = await Promise.all([
      sanityFetch<Product>({
        query: PRODUCT_BY_SLUG_QUERY,
        params: { slug },
        tags: ['product'],
      }),
      sanityFetch<SiteSettings>({ query: SETTINGS_QUERY, tags: ['settings'] }),
    ]);
  } catch {
    /* no-op */
  }

  if (!product) notFound();

  const whatsappNumber =
    settings?.whatsapp_numero ?? process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK ?? '51999999999';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-cream/30 mb-10"
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}`} className="hover:text-champagne transition-colors">
            Inicio
          </Link>
          <ChevronRightIcon size={12} className="text-cream/20" />
          <Link href={`/${locale}#catalogo`} className="hover:text-champagne transition-colors capitalize">
            {product.categoria}
          </Link>
          <ChevronRightIcon size={12} className="text-cream/20" />
          <span className="text-cream/50 truncate max-w-[200px]">{product.nombre}</span>
        </nav>

        {/* Product Detail */}
        <FadeInOnScroll>
          <ProductDetailClient
            product={product}
            locale={locale}
            whatsappNumber={whatsappNumber}
          />
        </FadeInOnScroll>
      </div>
    </div>
  );
}
