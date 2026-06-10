'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl } from '@/sanity/lib/image';
import { TrashIcon, PlusIcon, MinusIcon } from '@/components/icons';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const t = useTranslations('cart');
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const imageUrl = getImageUrl(item.product.imagen, 120, 150);
  const lineTotal = item.precioFinal * item.cantidad;

  return (
    <div className="flex gap-4 p-3 bg-onyx rounded-xl border border-onyx-border group hover:border-onyx-border/80 transition-all">
      {/* Image */}
      <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-onyx-light">
        <Image
          src={imageUrl}
          alt={item.product.nombre}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-cream/90 text-sm font-medium leading-tight truncate pr-2">
              {item.product.nombre}
            </p>
            <p className="text-cream/40 text-xs mt-0.5">
              {t('size')}: <span className="text-rose-gold/80">{item.talla}</span>
            </p>
          </div>
          <button
            onClick={() => removeItem(item.product._id, item.talla)}
            className="text-cream/30 hover:text-red-400 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-red-400/10"
            aria-label={`${t('remove')} ${item.product.nombre}`}
          >
            <TrashIcon size={14} />
          </button>
        </div>

        {/* Price and Quantity */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center border border-onyx-border rounded-full overflow-hidden">
            <button
              onClick={() => updateQuantity(item.product._id, item.talla, item.cantidad - 1)}
              className="w-7 h-7 flex items-center justify-center text-cream/60 hover:text-champagne hover:bg-champagne/10 transition-all"
              aria-label="Disminuir cantidad"
            >
              <MinusIcon size={12} />
            </button>
            <span className="w-7 text-center text-sm text-cream/90 font-medium">
              {item.cantidad}
            </span>
            <button
              onClick={() => updateQuantity(item.product._id, item.talla, item.cantidad + 1)}
              className="w-7 h-7 flex items-center justify-center text-cream/60 hover:text-champagne hover:bg-champagne/10 transition-all"
              aria-label="Aumentar cantidad"
            >
              <PlusIcon size={12} />
            </button>
          </div>

          <p className="text-champagne font-bold text-sm">
            S/ {lineTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
