// schemaTypes/documents/kurzyCTA.ts
const kurzyCTA = {
  name: 'kurzyCTA',
  title: 'Výzva k akci kurzů',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nadpis',
      type: 'text',
    },
    {
      name: 'content',
      title: 'Obsah',
      type: 'text',
    },
    {
      name: 'images',
      title: 'Obrázky',
      type: 'array',
      of: [{ type: 'image' }],
    },
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare(selection: any) {
      const { title, content, images } = selection;
      return {
        title: title || 'Výzva k akci kurzů',
        subtitle: content || '',
        media: images?.[0], // Show first image from array
      };
    },
  },
}

export default kurzyCTA;
