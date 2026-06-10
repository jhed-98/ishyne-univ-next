'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductCard from '@/components/products/ProductCard';
import FadeInOnScroll from '@/components/ui/FadeInOnScroll';
import type { Product } from '@/types';
import { trackEvent } from '@/components/Analytics';

interface CatalogSectionProps {
  products: Product[];
  locale: string;
}

const CATEGORIES = ['all', 'tops', 'faldas', 'vestidos', 'accesorios', 'pantalones'] as const;

export default function CatalogSection({ products, locale }: CatalogSectionProps) {
  const t = useTranslations('catalog');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all'
    ? products
    : products.filter((p) => p.categoria === activeFilter);

  const handleFilter = (cat: string) => {
    setActiveFilter(cat);
    trackEvent('view_item_list', { item_list_name: cat === 'all' ? 'All Products' : cat });
  };

  const filterLabels: Record<string, string> = {
    all: t('filter_all'),
    tops: t('filter_tops'),
    faldas: t('filter_faldas'),
    vestidos: t('filter_vestidos'),
    accesorios: t('filter_accesorios'),
    pantalones: t('filter_pantalones'),
  };

  return (
    <section id="catalogo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeInOnScroll>
        <div className="text-center mb-16">
          <p className="text-rose-gold text-xs tracking-[0.3em] uppercase mb-3">Colección</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-cream mb-4">
            {t('title')}
          </h2>
          <p className="text-cream/50 max-w-md mx-auto">{t('subtitle')}</p>
          <div className="w-16 h-px bg-champagne/50 mx-auto mt-6" />
        </div>
      </FadeInOnScroll>

      {/* Filters */}
      <FadeInOnScroll delay={100}>
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="group" aria-label="Filtros por categoría">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => handleFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-champagne text-black shadow-lg shadow-champagne/10'
                  : 'bg-onyx-light border border-onyx-border text-cream/60 hover:border-rose-gold/40 hover:text-cream/90'
              }`}
              aria-pressed={activeFilter === cat}
            >
              {filterLabels[cat]}
            </button>
          ))}
        </div>
      </FadeInOnScroll>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <FadeInOnScroll>
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✦</p>
            <p className="text-cream/40 font-playfair text-xl">{t('no_products')}</p>
          </div>
        </FadeInOnScroll>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <FadeInOnScroll key={product._id} delay={index * 60} direction="up">
              <ProductCard product={product} locale={locale} priority={index < 4} />
            </FadeInOnScroll>
          ))}
        </div>
      )}
    </section>
  );
}
