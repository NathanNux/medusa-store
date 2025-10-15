// schemaTypes/documents/newsText.ts
const newsText = {
  name: 'newsText',
  title: 'Dovolená',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'text', // Changed from 'string' to 'text' for multi-line support
      description: 'Text pro informace o dovolené, "Dovolená | Novinky"',
    },
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare(selection: any) {
      const { text } = selection;
      return {
        title: 'Text novinek',
        subtitle: text || '',
      };
    },
  },
}

export default newsText;
