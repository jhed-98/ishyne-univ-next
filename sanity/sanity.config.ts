import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  basePath: '/es/admin',
  projectId,
  dataset,
  name: 'ishyne-studio',
  title: 'iShyne — Panel de Administración',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('iShyne CMS')
          .items([
            S.listItem()
              .title('⚙️ Configuración General')
              .child(
                S.document()
                  .schemaType('settings')
                  .documentId('siteSettings')
                  .title('Configuración General')
              ),
            S.divider(),
            S.listItem()
              .title('👗 Productos')
              .child(S.documentTypeList('product').title('Productos')),
            S.listItem()
              .title('🏷️ Campañas')
              .child(S.documentTypeList('campaign').title('Campañas')),
          ]),
    }),
    visionTool(),
  ],
});
