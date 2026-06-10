# iShyne — Tienda Online de Moda Femenina

> **"Brilla siempre"** — Lima, Perú 🇵🇪

Plataforma e-commerce de lujo construida con **Next.js 16 + Tailwind CSS v4 + Sanity.io**.

---

## 🚀 Puesta en Marcha Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.local.example .env.local
```
Edita `.env.local` con tus credenciales de Sanity (ver instrucciones abajo).

### 3. Iniciar en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) → redirige automáticamente a `/es`.

---

## ⚙️ Configuración de Sanity.io

### Crear tu proyecto Sanity (primera vez)

1. Ve a [sanity.io/manage](https://sanity.io/manage)
2. Crea un nuevo proyecto → anota el **Project ID**
3. En `.env.local`, completa:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
4. En Sanity → **API** → **Tokens** → crea un token con permisos de lectura
5. Agrega el token a `.env.local`:
   ```
   SANITY_API_TOKEN=tu-token-aqui
   ```
6. En Sanity → **API** → **CORS Origins** → agrega `http://localhost:3000`

### Panel de Administración
Accede a `http://localhost:3000/es/admin` para gestionar:
- **Productos**: crear, editar, eliminar prendas con imágenes, tallas y precios
- **Campañas**: programar descuentos por fecha con textos en 3 idiomas
- **Configuración**: número de WhatsApp, ID de GA4, redes sociales

---

## 📦 Stack Técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.x | Framework (App Router) |
| React | 19.x | UI |
| Tailwind CSS | 4.x | Estilos (CSS-first) |
| Sanity.io | 3.x | CMS Headless |
| next-intl | 4.x | i18n (es/en/pt) |
| Zustand | 5.x | Estado global (carrito) |
| next-themes | — | Dark/Light mode sin FOUC |
| framer-motion | — | Animaciones |

---

## 🌐 Idiomas Disponibles

| Ruta | Idioma |
|---|---|
| `/es` | Español (por defecto) |
| `/en` | English |
| `/pt` | Português |

---

## 📁 Estructura del Proyecto

```
ishyne/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          ← Layout con Header, Footer, Cart, Chatbot
│   │   ├── page.tsx            ← Portada (Hero + Catálogo)
│   │   ├── nosotros/           ← Página "Sobre Nosotras"
│   │   ├── productos/[slug]/   ← Detalle de producto
│   │   └── admin/[[...tool]]/  ← Sanity Studio
│   ├── api/revalidate/         ← Webhook ISR on-demand
│   ├── globals.css             ← Tema Tailwind v4 + animaciones
│   └── layout.tsx              ← Root layout (fonts, ThemeProvider)
├── components/
│   ├── cart/                   ← CartDrawer, CartItem, CartSummary
│   ├── chatbot/                ← ChatbotWidget (reglas + sessionStorage)
│   ├── home/                   ← HeroSection, BenefitsBar
│   ├── icons/                  ← SVG icons como componentes React
│   ├── layout/                 ← Header, Footer, CampaignBanner
│   ├── products/               ← ProductCard, CatalogSection, ProductDetailClient
│   ├── ui/                     ← FadeInOnScroll
│   └── whatsapp/               ← WhatsAppFAB
├── i18n/
│   ├── messages/               ← es.json, en.json, pt.json
│   ├── routing.ts
│   └── request.ts
├── sanity/
│   ├── schemas/                ← product, campaign, settings
│   ├── lib/                    ← client, queries, image
│   └── sanity.config.ts
├── store/
│   ├── cartStore.ts            ← Zustand + localStorage persist
│   └── campaignStore.ts        ← Zustand + lógica de fechas
└── types/index.ts              ← Tipos TypeScript globales
```

---

## 🎨 Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `onyx` | `#0D0608` | Fondo principal (dark) |
| `champagne` | `#D4AF37` | Acento dorado, CTAs |
| `rose-gold` | `#C8956C` | Acento secundario |
| `cream` | `#FAF6F1` | Texto principal |

---

## 🛒 Flujo de Compra

1. **Catálogo** → Cliente selecciona producto → clic en card
2. **Detalle** → Selecciona talla + cantidad → "Agregar al carrito"
3. **Cart Drawer** → Revisa items → "Finalizar por WhatsApp"
4. **WhatsApp** → Mensaje pre-armado con productos, tallas y total

---

## 📊 Google Analytics 4

1. Crea una propiedad GA4 en [analytics.google.com](https://analytics.google.com)
2. Copia el **ID de medición** (formato `G-XXXXXXXXXX`)
3. En el Panel Admin (`/es/admin`) → **Configuración General** → pega el ID
4. Los eventos registrados automáticamente:
   - `view_item_list` — al filtrar el catálogo
   - `add_to_cart` — al agregar producto
   - `begin_checkout` — al iniciar WhatsApp checkout
   - `whatsapp_click` — clics en botones de WhatsApp

---

## 🔔 ISR / Revalidación Automática

Para que los cambios en Sanity se reflejen en el frontend sin redeploy:

1. En Sanity → **API** → **Webhooks** → crear nuevo webhook
2. URL: `https://tu-dominio.com/api/revalidate?secret=TU_CLAVE`
3. Trigger: `Create`, `Update`, `Delete` en todos los documentos
4. La clave debe coincidir con `REVALIDATE_SECRET` en `.env.local`

---

## 🚀 Deploy en Vercel

```bash
# 1. Instala Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Agrega las env vars en el dashboard de Vercel
# NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
# SANITY_API_TOKEN, REVALIDATE_SECRET
```

---

*© 2024 iShyne. Lima, Perú 🇵🇪*
