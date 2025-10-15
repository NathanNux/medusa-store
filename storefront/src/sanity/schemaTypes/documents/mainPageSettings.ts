export default {
  name: 'mainPageSettings',
  title: 'Nastavení hlavní stránky',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Úvodní sekce',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Zobrazit sekci',
          type: 'boolean',
          initialValue: true,
          description: 'Určuje, zda se má zobrazit celá úvodní sekce'
        },
        {
          name: 'introHero',
          title: 'Intro Hero komponenta',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt komponent Hero (úvodní sekce)'
        },
        {
          name: 'aboutHero',
          title: 'About Hero komponenta',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt komponent About (o mně)'
        },
      ],
    },
    {
      name: 'ecomSection',
      title: 'Sekce E-shop',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Zobrazit sekci E-shop',
          type: 'boolean',
          initialValue: true,
          description: 'Určuje, zda se má zobrazit celá sekce e-shopu'
        },
        {
          name: 'intro',
          title: 'E-shop Intro komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt první komponent e-shopu'
        },
        {
          name: 'entry',
          title: 'E-shop Entry komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt druhý komponent e-shopu'
        },
        {
          name: 'desc',
          title: 'E-shop Popis sekce',
          type: 'object',
          fields: [
            {
              name: 'enabled',
              title: 'Zobrazit E-com Desc',
              type: 'boolean',
              initialValue: true,
              description: 'Určuje, zda se má zobrazit sekce popisu e-shopu'
            },
            {
              name: 'inspiration',
              title: 'Inspiration komponent',
              type: 'boolean',
              initialValue: true,
              description: 'Zobrazit/skrýt komponentu inspirace (první část popisu)'
            },
            {
              name: 'shaping',
              title: 'Tvarování komponent',
              type: 'boolean',
              initialValue: true,
              description: 'Zobrazit/skrýt komponentu tvarování (druhá část popisu)'
            },
            {
              name: 'benefits',
              title: 'Výhody komponent',
              type: 'boolean',
              initialValue: true,
              description: 'Zobrazit/skrýt komponentu výhod (třetí část popisu)'
            },
          ],
        },
        {
          name: 'cta',
          title: 'E-shop CTA komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt výzvu k akci e-shopu'
        },
      ],
    },
    {
      name: 'kurzySection',
      title: 'Sekce Kurzy',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Zobrazit sekci Kurzy',
          type: 'boolean',
          initialValue: true,
          description: 'Určuje, zda se má zobrazit celá sekce kurzů'
        },
        {
          name: 'intro',
          title: 'Kurzy Intro komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt úvodní komponentu kurzů'
        },
        {
          name: 'about',
          title: 'Kurzy About komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt komponentu o kurzech (část s informacemi o kurzech)'
        },
        {
          name: 'cta',
          title: 'Kurzy CTA komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt výzvu k akci kurzů'
        },
      ],
    },
    {
      name: 'infoSection',
      title: 'Sekce Informace',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Zobrazit sekci Informace',
          type: 'boolean',
          initialValue: true,
          description: 'Určuje, zda se má zobrazit celá sekce informací'
        },
        {
          name: 'mapa',
          title: 'Mapa komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt komponentu mapy (otevírcí doba, adresa, atd.)'
        },
        {
          name: 'kontakt',
          title: 'Kontakt komponent',
          type: 'boolean',
          initialValue: true,
          description: 'Zobrazit/skrýt komponentu kontakt'
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      heroEnabled: 'heroSection.enabled',
      ecomEnabled: 'ecomSection.enabled',
      kurzyEnabled: 'kurzySection.enabled',
      infoEnabled: 'infoSection.enabled',
    },
    prepare(selection: any) {
      // Only show which sections are enabled, never raw text, slider, or image values
      const { heroEnabled, ecomEnabled, kurzyEnabled, infoEnabled } = selection;
      const enabledSections = [heroEnabled && 'Hero', ecomEnabled && 'E-shop', kurzyEnabled && 'Kurzy', infoEnabled && 'Info'].filter(Boolean);
      const subtitle = enabledSections.length > 0 ? `Povolené sekce: ${enabledSections.join(', ')}` : 'Žádné sekce nejsou povoleny';
      return {
        title: 'Nastavení hlavní stránky',
        subtitle,
      };
    },
  },
}
