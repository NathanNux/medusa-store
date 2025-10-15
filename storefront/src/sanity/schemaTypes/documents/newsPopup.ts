// schemaTypes/documents/newsPopup.ts
const newsPopup = {
  name: 'newsPopup',
  title: 'Vyskakovací okno novinek (popup)',
  type: 'document',
  fields: [
    {
      name: 'enabled',
      title: 'Povoleno',
      type: 'boolean',
      description: 'Zda zobrazit vyskakovací okno novinek',
      initialValue: true,
    },
    {
      name: 'text',
      title: 'Text novinek',
      type: 'string',
      description: 'Text, který se zobrazí ve vyskakovacím okně novinek',
      initialValue: 'Dovolena | Novinky',
    },
  ],
  preview: {
    select: {
      title: 'title',
      text: 'text',
    },
    prepare(selection: any) {
      const { title, text } = selection;
      return {
        title: title || 'Novinky Popup',
        subtitle: text || '',
      };
    },
  },
}

export default newsPopup;
