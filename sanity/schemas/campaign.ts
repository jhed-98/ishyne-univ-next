import { defineField, defineType } from 'sanity';

export const campaignSchema = defineType({
  name: 'campaign',
  title: 'Campaña',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la Campaña',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descuento',
      title: 'Descuento (%)',
      type: 'number',
      description: 'Ingresa el porcentaje de descuento (ej: 20 para 20%)',
      validation: (Rule) => Rule.required().min(1).max(90),
    }),
    defineField({
      name: 'fecha_inicio',
      title: 'Fecha de Inicio',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fecha_fin',
      title: 'Fecha de Fin',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alcance',
      title: 'Alcance del Descuento',
      type: 'string',
      options: {
        list: [
          { title: 'Toda la Tienda', value: 'all' },
          { title: 'Tops', value: 'tops' },
          { title: 'Faldas', value: 'faldas' },
          { title: 'Vestidos', value: 'vestidos' },
          { title: 'Accesorios', value: 'accesorios' },
          { title: 'Pantalones', value: 'pantalones' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'activa',
      title: '¿Campaña Activa?',
      type: 'boolean',
      initialValue: true,
      description: 'Desactiva manualmente una campaña sin eliminarla.',
    }),
    defineField({
      name: 'banner_textos',
      title: 'Textos del Banner',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: '🇵🇪 Español', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'en', title: '🇺🇸 English', type: 'string' }),
        defineField({ name: 'pt', title: '🇧🇷 Português', type: 'string' }),
      ],
    }),
    defineField({
      name: 'color_hex',
      title: 'Color del Banner (hex)',
      type: 'string',
      initialValue: '#D4AF37',
      description: 'Ej: #D4AF37 para dorado champagne',
    }),
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'descuento', active: 'activa' },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active ? '✅' : '⏸️'} ${title}`,
        subtitle: `${subtitle}% descuento`,
      };
    },
  },
});
