// schemaTypes/documents/kurzyAbout.ts
const kurzyAbout = {
  name: 'kurzyAbout',
  title: 'O kurzech',
  type: 'document',
  fields: [
    {
      name: 'section1',
      title: 'Sekce 1',
      type: 'object',
      fields: [
        { name: 'title', type: 'text', title: 'Nadpis' },
        { name: 'content', type: 'text', title: 'Obsah' },
        { name: 'image', type: 'image', title: 'Obrázek (Horizontální)' },
      ],
    },
    {
      name: 'section2',
      title: 'Sekce 2 - Dva obrázky',
      type: 'object',
      fields: [
        { name: 'image1', type: 'image', title: 'První obrázek (Horizontální)' },
        { name: 'image2', type: 'image', title: 'Druhý obrázek (Vertikální)' },
      ],
    },
    {
      name: 'section3',
      title: 'Sekce 3',
      type: 'object',
      fields: [
        { name: 'title', type: 'text', title: 'Nadpis' },
        { name: 'content', type: 'text', title: 'Obsah' },
        { name: 'image', type: 'image', title: 'Obrázek (Horizontální)' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      section1Image: 'section1.image',
    },
    prepare(selection: any) {
      const { section1Title, section3Title, section1Image } = selection;
      return {
        title: section1Title || section3Title || 'O kurzech',
        subtitle: 'Informace o kurzech',
        media: section1Image,
      };
    },
  },
}

export default kurzyAbout;
