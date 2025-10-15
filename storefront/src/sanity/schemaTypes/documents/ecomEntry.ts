// schemaTypes/documents/ecomEntry.ts
const ecomEntry = {
  name: 'ecomEntry',
  title: 'Vstup E-shopu',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nadpis',
      type: 'text', // Changed to text for multi-line support
    },
    {
      name: 'rotatingText',
      title: 'Rotující text',
      type: 'text', // Changed to text for multi-line support
    },
    {
      name: 'images',
      title: 'Obrázky',
      description: "horní obrázky: první a třetí foto by měly být vertikální (na výšku) obrázky, druhé foto je horizontální (na šířku). Další dvě fota jsou také horizontální (na šířku).",
      type: 'array',
      of: [{ type: 'image' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      rotatingText: 'rotatingText',
      images: 'images',
    },
    prepare(selection: any) {
      const { title, rotatingText, images } = selection;
      return {
        title: title || 'Vstup E-shopu',
        subtitle: rotatingText || '',
        media: images?.[0], // Show first image from array
      };
    },
  },
}

export default ecomEntry;
