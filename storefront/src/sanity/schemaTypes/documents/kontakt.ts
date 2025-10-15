// schemaTypes/documents/kontakt.ts
const kontakt = {
  name: 'kontakt',
  title: 'Kontakt',
  type: 'document',
  fields: [
    {
      name: 'newsletterTitle',
      title: 'Nadpis newsletteru',
      type: 'text',
    },
    {
      name: 'contactTitle',
      title: 'Nadpis kontakt',
      type: 'text',
    },
    {
      name: 'hashtags',
      title: 'Hashtagy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'pillarImage',
      title: 'Sloupový obrázek',
      type: 'image',
    },
  ],
  preview: {
    select: {
      newsletterTitle: 'newsletterTitle',
      contactTitle: 'contactTitle',
      pillarImage: 'pillarImage',
    },
    prepare(selection: any) {
      const { newsletterTitle, contactTitle, pillarImage } = selection;
      return {
        title: newsletterTitle || contactTitle || 'Kontakt',
        subtitle: 'Newsletter a kontaktní informace',
        media: pillarImage,
      };
    },
  },
}

export default kontakt;
