import { defineField, defineType } from 'sanity';

export const productSchema = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre del Producto',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nombre', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Tops', value: 'tops' },
          { title: 'Faldas', value: 'faldas' },
          { title: 'Vestidos', value: 'vestidos' },
          { title: 'Accesorios', value: 'accesorios' },
          { title: 'Pantalones', value: 'pantalones' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'precio',
      title: 'Precio (S/)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'precio_antes',
      title: 'Precio Anterior (S/) — opcional',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen Principal',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagenes_adicionales',
      title: 'Imágenes Adicionales',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'tallas',
      title: 'Tallas Disponibles',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única'].map((t) => ({
          title: t,
          value: t,
        })),
        layout: 'grid',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'destacado',
      title: '¿Producto Destacado?',
      type: 'boolean',
      initialValue: false,
      description: 'Los productos destacados aparecen en el chatbot y secciones especiales.',
    }),
    defineField({
      name: 'stock',
      title: 'Stock disponible',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'categoria', media: 'imagen' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle?.toUpperCase(), media };
    },
  },
  orderings: [
    { title: 'Precio: Mayor a Menor', name: 'priceDesc', by: [{ field: 'precio', direction: 'desc' }] },
    { title: 'Precio: Menor a Mayor', name: 'priceAsc', by: [{ field: 'precio', direction: 'asc' }] },
    { title: 'Nombre A–Z', name: 'nameAsc', by: [{ field: 'nombre', direction: 'asc' }] },
  ],
});
