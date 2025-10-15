// schemaTypes/documents/ecomIntro.ts
const ecomIntro = {
  name: 'ecomIntro',
  title: 'Úvod E-shopu',
  type: 'document',
  fields: [
    {
      name: 'title1',
      title: 'Část nadpisu 1',
      type: 'text', // Changed to text for multi-line support
    },
    {
      name: 'title2',
      title: 'Část nadpisu 2',
      type: 'text', // Changed to text for multi-line support
    },
    {
      name: 'title3',
      title: 'Část nadpisu 3',
      type: 'text', // Changed to text for multi-line support
    },
    {
      name: 'content1',
      title: 'Část obsahu 1',
      type: 'text',
    },
    {
      name: 'content2',
      title: 'Část obsahu 2',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Obrázek',
      type: 'image',
    },
  ],
  preview: {
    select: {
      title1: 'title',
      content1: 'content1',
      image: 'image',
    },
    prepare(selection: any) {
      const { title1, content1, image } = selection;
      return {
        title: title1 || 'Úvod E-shopu',
        subtitle: content1 || '',
        media: image,
      };
    },
  },
}

export default ecomIntro;
