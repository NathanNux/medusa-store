// schemaTypes/documents/aboutHero.ts
const aboutHero = {
  name: 'aboutHero',
  title: 'O mě Hero',
  type: 'document',
  fields: [
    {
      name: 'content1',
      title: 'Popis 1',
      type: 'text', // Changed to text for multi-line support
      description: 'První část popisu o mně, např. "jmenuji se..."',
    },
    {
      name: 'content2',
      title: 'Popis 2',
      type: 'text',
      description: 'Druhý část popisu o mně, např. "Vystudovala jsem..."',
    },
    {
      name: 'images',
      title: 'Obrázky',
      type: 'array',
      description: 'Obrázky související s popisem o mně',
      of: [{ type: 'image' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      content1: 'content1',
      content2: 'content2',
      images: 'images',
    },
    prepare(selection: any) {
      const { title, content1, content2, images } = selection;
      return {
        title: title || 'O mě Hero',
        subtitle: content1 || '',
        description: content2 || '',
        media: images?.[0], // Show first image from array
      };
    },
  },
}

export default aboutHero;
