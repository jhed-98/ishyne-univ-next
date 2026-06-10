"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { useCampaignStore } from "@/store/campaignStore";
import { getImageUrl } from "@/sanity/lib/image";
import { trackEvent } from "@/components/Analytics";
import type { Product } from "@/types";
import { CartIcon, CheckIcon } from "@/components/icons";

interface ProductCardProps {
  product: Product;
  locale: string;
  priority?: boolean;
}

export default function ProductCard({
  product,
  locale,
  priority = false,
}: ProductCardProps) {
  const t = useTranslations("catalog");
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const applyDiscount = useCampaignStore((s) => s.applyDiscount);
  const discountPercent = useCampaignStore((s) =>
    s.getDiscountPercent(product.categoria),
  );

  const imageUrl = getImageUrl(product.imagen, 600, 750);
  const finalPrice = applyDiscount(product.precio, product.categoria);
  const hasDiscount =
    discountPercent > 0 ||
    (product.precio_antes && product.precio_antes > product.precio);
  const savings = hasDiscount ? product.precio - finalPrice : 0;

  const defaultTalla = product.tallas?.[0] ?? "Única";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product, defaultTalla, finalPrice);
    openCart();
    setAdded(true);
    trackEvent("add_to_cart", {
      currency: "PEN",
      value: finalPrice,
      items: [
        { item_id: product._id, item_name: product.nombre, price: finalPrice },
      ],
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group relative bg-onyx-light border border-onyx-border rounded-2xl overflow-hidden card-luxury-hover hover:shadow-xl shadow-sm">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-champagne text-black text-[11px] font-bold px-2 py-1 rounded-full">
          -{discountPercent}%
        </div>
      )}
      {product.destacado && (
        <div className="absolute top-3 right-3 z-10 bg-rose-gold/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full tracking-wide">
          ✦ DESTACADO
        </div>
      )}

      {/* Image */}
      <Link
        href={`/${locale}/productos/${product.slug.current}`}
        className="block relative aspect-[3/4] overflow-hidden bg-onyx"
      >
        <Image
          src={imageUrl}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-onyx/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <span className="text-cream text-sm font-medium tracking-widest uppercase border border-cream/60 px-6 py-2 rounded-full backdrop-blur-sm">
            {t("view_detail")}
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[11px] text-rose-gold/70 uppercase tracking-widest font-medium">
            {product.categoria}
          </p>
          <Link href={`/${locale}/productos/${product.slug.current}`}>
            <h3 className="font-playfair text-cream/95 font-medium mt-0.5 hover:text-champagne transition-colors line-clamp-2">
              {product.nombre}
            </h3>
          </Link>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 items-baseline gap-x-2 gap-y-1 md:flex md:items-baseline md:gap-2">
          {/* Precio Final - Ocupa toda la fila superior en mobile si es necesario, o se alinea a la izquierda */}
          <span className="text-lg font-bold text-champagne col-span-2 md:col-span-1 whitespace-nowrap">
            S/ {finalPrice.toFixed(2)}
          </span>

          {/* Precios de descuento que se mostrarán en una segunda línea en mobile */}
          <div className="flex items-center gap-2 col-span-2 md:flex md:items-baseline md:gap-2">
            {hasDiscount && (
              <span className="text-sm text-cream/40 line-through Richmond whitespace-nowrap">
                S/ {product.precio.toFixed(2)}
              </span>
            )}
            {savings > 0 && (
              <span className="text-xs text-green-400/80 whitespace-nowrap">
                -S/ {savings.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add */}
        {product.stock > 0 ? (
          <button
            id={`quick-add-${product._id}`}
            onClick={handleQuickAdd}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              added
                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                : "bg-onyx border border-onyx-border text-cream/70 hover:bg-champagne/10 hover:border-champagne/40 hover:text-champagne"
            }`}
          >
            {added ? (
              <>
                <CheckIcon size={16} />
                ¡Agregado!
              </>
            ) : (
              <>
                <CartIcon size={16} />
                {t("add_to_cart")}
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl text-sm text-center text-cream/30 border border-onyx-border">
            {t("out_of_stock")}
          </div>
        )}
      </div>
    </article>
  );
}
