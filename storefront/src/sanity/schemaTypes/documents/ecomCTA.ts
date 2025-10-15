// schemaTypes/documents/ecomCTA.ts
const ecomCTA = {
  name: 'ecomCTA',
  title: 'Výzva k akci E-shopu s obrázky',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nadpis',
      type: 'text', // Changed to text for multi-line support
    },
    {
      name: 'buttonText',
      title: 'Text tlačítka',
      type: 'string',
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
      buttonText: 'buttonText',
      images: 'images',
    },
    prepare(selection: any) {
      const { title, buttonText, images } = selection;
      return {
        title: title || 'Výzva k akci E-shopu',
        subtitle: buttonText || '',
        media: images?.[0], // Show first image from array
      };
    },
  },
}

export default ecomCTA;
