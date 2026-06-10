import { defineField, defineType } from 'sanity';

export const settingsSchema = defineType({
  name: 'settings',
  title: 'Configuración General',
  type: 'document',
  // Single document — only one instance allowed
  fields: [
    defineField({
      name: 'whatsapp_numero',
      title: 'Número de WhatsApp',
      type: 'string',
      description: 'Incluye código de país sin +. Ej: 51987654321',
      validation: (Rule) => Rule.required().regex(/^\d{10,15}$/, { name: 'número válido' }),
    }),
    defineField({
      name: 'whatsapp_saludo',
      title: 'Mensaje de Saludo WhatsApp',
      type: 'object',
      description: 'Este texto aparece al inicio del mensaje enviado a WhatsApp.',
      fields: [
        defineField({ name: 'es', title: '🇵🇪 Español', type: 'string', initialValue: 'Hola, me interesa hacer un pedido:' }),
        defineField({ name: 'en', title: '🇺🇸 English', type: 'string', initialValue: "Hello, I'd like to place an order:" }),
        defineField({ name: 'pt', title: '🇧🇷 Português', type: 'string', initialValue: 'Olá, gostaria de fazer um pedido:' }),
      ],
    }),
    defineField({
      name: 'ga4_id',
      title: 'Google Analytics 4 — ID de Medición',
      type: 'string',
      description: 'Formato: G-XXXXXXXXXX. Déjalo vacío para desactivar Analytics.',
      validation: (Rule) => Rule.custom((value: string | undefined) => {
        if (!value) return true; // campo opcional, vacío es válido
        return /^G-[A-Z0-9]+$/.test(value) ? true : 'Formato inválido. Usa G-XXXXXXXXXX';
      }),
    }),
    defineField({
      name: 'redes_sociales',
      title: 'Redes Sociales',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram (@usuario)', type: 'string' }),
        defineField({ name: 'tiktok', title: 'TikTok (@usuario)', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: '⚙️ Configuración de iShyne' };
    },
  },
});
