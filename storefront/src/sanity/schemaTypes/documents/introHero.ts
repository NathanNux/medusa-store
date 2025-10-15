// schemaTypes/documents/introHero.ts
const introHero = {
  name: 'introHero',
  title: 'Úvodní Hero',
  type: 'document',
  fields: [
    {
      name: 'title1',
      title: 'Část nadpisu 1',
      type: 'text', // Changed to text for multi-line support
      description: 'První část nadpisu, např. "Lucie"',
    },
    {
      name: 'title2',
      title: 'Část nadpisu 2',
      type: 'text', // Changed to text for multi-line support
      description: 'Druhá část nadpisu, např. "Polanská"',
    },
    {
      name: 'content',
      title: 'Obsah',
      type: 'text',
      description: 'Hlavní obsah s zalomením řádků - stiskněte Enter pro nové řádky',
    },
    {
      name: 'images',
      title: 'Obrázky',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Obrázky pro hero sekci',
    },
  ],
  preview: {
    select: {
      title1: 'title',
      content: 'content',
      images: 'images',
    },
    prepare(selection: any) {
      const { title1, content, images } = selection;
      return {
        title: title1 || 'Úvodní Hero',
        subtitle: content || '',
        media: images?.[0], // Show first image from array
      };
    },
  },
}

export default introHero;
