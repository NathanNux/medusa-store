// schemaTypes/documents/mapa.ts
export default {
  name: 'mapa',
  title: 'Mapa',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Hlavní Nadpis',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Adresa',
      type: 'string',
    },
    {
      name: 'mapLink',
      title: 'Odkaz na mapu',
      type: 'url',
    },
    {
      name: 'titleSection',
      title: 'Nadpis Sekce',
      type: 'string',
    },
    {
      name: 'openingHours',
      title: 'Otevírací doba',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'backgroundImage',
      title: 'Pozadí obrázek',
      type: 'image',
    },
  ],
  preview: {
    select: {
      title: 'title',
      address: 'address',
      backgroundImage: 'backgroundImage',
    },
    prepare(selection: any) {
      const { title, address, backgroundImage } = selection;
      return {
        title: title || 'Mapa',
        subtitle: address || '',
        media: backgroundImage,
      };
    },
  },
}
