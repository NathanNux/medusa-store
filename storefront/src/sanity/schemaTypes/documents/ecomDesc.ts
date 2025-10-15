// schemaTypes/documents/ecomDesc.ts
const ecomDesc = {
  name: 'ecomDesc',
  title: 'Popis E-shopu',
  type: 'document',
  fields: [
    {
      name: 'maintitle',
      title: 'Hlavní nadpis',
      type: 'object',
      fields: [
        { name: 'title', title: "První Text", type: 'text' }, // Changed to text for multi-line support
      ],
    },
    {
      name: 'inspiration',
      title: 'Inspirace',
      type: 'object',
      fields: [
        { name: 'title1', title: "Nadpis první sekce inspirace", type: 'text', description: 'Nadpis první sekce inspirace (nemusí tam být)' },
        { name: 'content1', title: "Obsah první sekce inspirace", type: 'text', description: 'Obsah první sekce inspirace' },
        { name: 'title2', title: "Nadpis druhé sekce inspirace", type: 'text', description: 'Nadpis druhé sekce inspirace (nemusí tam být)' },
        { name: 'content2', title: "Obsah druhé sekce inspirace", type: 'text', description: 'Obsah druhé sekce inspirace' },
        { name: 'images', title: "Obrázky inspirace", type: 'array', of: [{ type: 'image' }] },
      ],
    },
    {
      name: 'shaping',
      title: 'Tvarování',
      type: 'object',
      fields: [
        { name: 'title', title: "Nadpis tvarování", type: 'text' }, // Changed to text for multi-line support
        { name: 'content1', title: "Obsah první sekce tvarování", type: 'text' },
        { name: 'content2', title: "Obsah druhé sekce tvarování", type: 'text', description: 'Obsah pro rotující text' },
        { name: 'images', title: "Obrázky tvarování", type: 'array', of: [{ type: 'image' }] },
      ],
    },
    {
      name: 'benefits',
      title: 'Výhody',
      type: 'object',
      fields: [
        { name: 'title', title: "Nadpis výhod", type: 'text' }, // Changed to text for multi-line support
        { name: 'content1', title: "Obsah první sekce výhod", type: 'text' },
        { name: 'content2', title: "Obsah druhé sekce výhod", type: 'text' },
        { name: 'images', title: "Obrázky výhod", type: 'array', of: [{ type: 'image' }] },
      ],
    },
  ],
  preview: {
    select: {
      inspirationTitle: 'inspiration.title1',
      shapingTitle: 'shaping.title',
      inspirationImages: 'inspiration.images',
    },
    prepare(selection: any) {
      const { inspirationTitle, shapingTitle, inspirationImages } = selection;
      return {
        title: inspirationTitle || shapingTitle || 'Popis E-shopu',
        subtitle: 'Sekce s inspirací, tvarováním a výhodami',
        media: inspirationImages?.[0], // Show first image from inspiration
      };
    },
  },
}

export default ecomDesc;
