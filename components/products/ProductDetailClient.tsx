"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { useCampaignStore } from "@/store/campaignStore";
import { getImageUrl } from "@/sanity/lib/image";
import { trackEvent } from "@/components/Analytics";
import {
  CartIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  WhatsAppIcon,
} from "@/components/icons";
import type { Product } from "@/types";

interface ProductDetailClientProps {
  product: Product;
  locale: string;
  whatsappNumber: string;
}

export default function ProductDetailClient({
  product,
  locale,
  whatsappNumber,
}: ProductDetailClientProps) {
  const t = useTranslations("product");
  const [selectedTalla, setSelectedTalla] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const applyDiscount = useCampaignStore((s) => s.applyDiscount);
  const discountPercent = useCampaignStore((s) =>
    s.getDiscountPercent(product.categoria),
  );

  const finalPrice = applyDiscount(product.precio, product.categoria);
  const hasDiscount =
    discountPercent > 0 ||
    (product.precio_antes && product.precio_antes > product.precio);
  const savings = hasDiscount ? product.precio - finalPrice : 0;

  const mainImageUrl = getImageUrl(product.imagen, 800, 1000);

  const handleAddToCart = () => {
    if (!selectedTalla) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    addItem(product, selectedTalla, finalPrice);
    openCart();
    setAdded(true);
    trackEvent("add_to_cart", {
      currency: "PEN",
      value: finalPrice * quantity,
      items: [
        {
          item_id: product._id,
          item_name: product.nombre,
          price: finalPrice,
          quantity,
        },
      ],
    });
    setTimeout(() => setAdded(false), 2500);
  };

  const whatsappMsg = selectedTalla
    ? `Hola, me interesa comprar: ${product.nombre} (Talla: ${selectedTalla}) x${quantity} — S/ ${(finalPrice * quantity).toFixed(2)}`
    : `Hola, me interesa el producto: ${product.nombre}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const handleWhatsAppBuyClick = () => {
    trackEvent("whatsapp_click", {
      source: "product_detail",
      item_id: product._id,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Image */}
      <div className="relative">
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-onyx-light border border-onyx-border">
          <Image
            src={mainImageUrl}
            alt={product.nombre}
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-champagne text-black text-sm font-bold px-3 py-1.5 rounded-full">
              -{discountPercent}%
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center space-y-6 py-4">
        {/* Category */}
        <p className="text-rose-gold text-xs tracking-[0.3em] uppercase">
          {product.categoria}
        </p>

        {/* Name */}
        <h1 className="font-playfair text-3xl md:text-4xl text-cream font-bold leading-tight">
          {product.nombre}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-champagne">
            S/ {finalPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xl text-cream/40 line-through">
                S/ {product.precio.toFixed(2)}
              </span>
              <span className="text-sm text-green-400 font-medium">
                {t("save")} S/ {savings.toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-onyx-border" />

        {/* Size Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-cream/80">{t("size")}</p>
            {selectedTalla && (
              <p className="text-sm text-champagne font-semibold">
                {selectedTalla}
              </p>
            )}
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Selección de talla"
          >
            {product.tallas.map((talla) => (
              <button
                key={talla}
                id={`size-btn-${talla}`}
                onClick={() => {
                  setSelectedTalla(talla);
                  setSizeError(false);
                }}
                className={`min-w-[52px] h-12 px-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  selectedTalla === talla
                    ? "border-champagne bg-champagne/10 text-champagne shadow-inner"
                    : "border-onyx-border text-cream/60 hover:border-rose-gold/50 hover:text-cream/90"
                }`}
                aria-pressed={selectedTalla === talla}
              >
                {talla}
              </button>
            ))}
          </div>
          {sizeError && (
            <p
              className="mt-2 text-sm text-red-400 flex items-center gap-1.5"
              role="alert"
            >
              ⚠ {t("size_required")}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <p className="text-sm font-medium text-cream/80 mb-3">
            {t("quantity")}
          </p>
          <div className="flex items-center border border-onyx-border rounded-xl overflow-hidden w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 flex items-center justify-center text-cream/60 hover:text-champagne hover:bg-champagne/10 transition-all"
              aria-label="Disminuir cantidad"
            >
              <MinusIcon size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-cream/95">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-11 h-11 flex items-center justify-center text-cream/60 hover:text-champagne hover:bg-champagne/10 transition-all"
              aria-label="Aumentar cantidad"
            >
              <PlusIcon size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="add-to-cart-btn"
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 ${
              added
                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                : "bg-champagne text-black hover:bg-rose-gold hover:text-black shadow-lg shadow-champagne/10 hover:shadow-rose-gold/20"
            }`}
          >
            {added ? <CheckIcon size={18} /> : <CartIcon size={18} />}
            {added ? t("added") : t("add_to_cart")}
          </button>

          <a
            id="whatsapp-buy-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppBuyClick}
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/10 transition-all font-semibold text-sm"
          >
            <WhatsAppIcon size={18} />
            {t("whatsapp_buy")}
          </a>
        </div>

        {/* Description */}
        {product.descripcion && (
          <>
            <div className="h-px bg-onyx-border" />
            <div>
              <p className="text-sm font-medium text-cream/80 mb-2">
                {t("description")}
              </p>
              <p className="text-cream/50 text-sm leading-relaxed">
                {product.descripcion}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
