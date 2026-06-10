import type { SanityImageSource } from '@sanity/image-url';

export interface SanityImage {
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface Product {
  _id: string;
  nombre: string;
  slug: { current: string };
  categoria: 'tops' | 'faldas' | 'vestidos' | 'accesorios' | 'pantalones';
  precio: number;
  precio_antes?: number;
  descripcion?: string;
  imagen: SanityImageSource;
  imagenes_adicionales?: SanityImageSource[];
  tallas: string[];
  destacado: boolean;
  stock: number;
}

export interface Campaign {
  _id: string;
  nombre: string;
  descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  alcance: 'all' | 'tops' | 'faldas' | 'vestidos' | 'accesorios' | 'pantalones';
  activa: boolean;
  banner_textos: { es: string; en?: string; pt?: string };
  color_hex: string;
}

export interface SiteSettings {
  whatsapp_numero: string;
  whatsapp_saludo: { es: string; en?: string; pt?: string };
  ga4_id?: string;
  redes_sociales?: { instagram?: string; tiktok?: string };
}

export interface CartItem {
  product: Product;
  talla: string;
  cantidad: number;
  precioFinal: number; // after campaign discount
}

export type Locale = 'es' | 'en' | 'pt';
