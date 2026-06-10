import { groq } from 'next-sanity';

// ─── Product Queries ───────────────────────────────────────────────────────────

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    nombre,
    slug,
    categoria,
    precio,
    precio_antes,
    descripcion,
    imagen,
    tallas,
    destacado,
    stock
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[_type == "product" && categoria == $categoria] | order(_createdAt desc) {
    _id,
    nombre,
    slug,
    categoria,
    precio,
    precio_antes,
    imagen,
    tallas,
    destacado,
    stock
  }
`;

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    nombre,
    slug,
    categoria,
    precio,
    precio_antes,
    descripcion,
    imagen,
    imagenes_adicionales,
    tallas,
    destacado,
    stock
  }
`;

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && destacado == true][0...6] {
    _id,
    nombre,
    slug,
    precio,
    imagen
  }
`;

export const ALL_PRODUCT_SLUGS_QUERY = groq`
  *[_type == "product"] { "slug": slug.current }
`;

// ─── Campaign Queries ──────────────────────────────────────────────────────────

export const ACTIVE_CAMPAIGNS_QUERY = groq`
  *[_type == "campaign" && activa == true] | order(_updatedAt desc) {
    _id,
    nombre,
    descuento,
    fecha_inicio,
    fecha_fin,
    alcance,
    activa,
    banner_textos,
    color_hex
  }
`;

// ─── Settings Query ────────────────────────────────────────────────────────────

export const SETTINGS_QUERY = groq`
  *[_type == "settings"][0] {
    whatsapp_numero,
    whatsapp_saludo,
    ga4_id,
    redes_sociales
  }
`;
