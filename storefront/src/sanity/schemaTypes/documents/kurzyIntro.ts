// schemaTypes/documents/kurzyIntro.ts
const kurzyIntro = {
  name: 'kurzyIntro',
  title: 'Úvod kurzů',
  type: 'document',
  fields: [
    {
      name: 'images',
      title: 'Obrázky (Všechny obrázky by měly být vertikální/orientované pro animaci odhalení)',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'content',
      title: 'Obsahový text',
      type: 'text',
      description: 'Hlavní obsahový text, který se zobrazuje v úvodní sekci',
    },
  ],
  preview: {
    select: {
      content: 'content',
      images: 'images',
    },
    prepare(selection: any) {
      const { content, images } = selection;
      return {
        title: 'Úvod kurzů',
        subtitle: content || '',
        media: images?.[0], // Show first image from array
      };
    },
  },
}

export default kurzyIntro;
