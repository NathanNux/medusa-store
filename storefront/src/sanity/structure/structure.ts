// ./sanity/deskStructure.ts

import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Správa Obsahu')
    .items([
      // Settings Section
      S.listItem()
        .title('Nastavení hlavní stránky')
        .child(
          S.list()
            .title('Nastavení zobrazení')
            .items([
              S.documentTypeListItem('mainPageSettings').title('Hlavní stránka'),
            ])
        ),

      // News Section
      S.listItem()
        .title('Novinky')
        .child(
          S.list()
            .title('Sekce novinky')
            .items([
              S.documentTypeListItem('newsText').title('Úvodní stránka'),
              S.documentTypeListItem('newsPopup').title('Pod navbarem'),
            ])
        ),

      // Main Page Content
      S.listItem()
        .title('Obsah na hlavní stránce')
        .child(
          S.list()
            .title('Sekce na hlavní stránce')
            .items([
              // Hero Section
              S.listItem()
                .title('Úvodní sekce')
                .child(
                  S.list()
                    .title('Úvodní sekce')
                    .items([
                      S.documentTypeListItem('introHero').title('Intro Hero sekce'),
                    ])
                ),

              // About Section
              S.listItem()
                .title('O mě')
                .child(
                  S.list()
                    .title('Sekce O mě')
                    .items([
                      S.documentTypeListItem('aboutHero').title('O mě Hero'),
                    ])
                ),

              // Eshop Section
              S.listItem()
                .title('E-shop')
                .child(
                  S.list()
                    .title('Sekce E-shop')
                    .items([
                      S.documentTypeListItem('ecomIntro').title('Úvod E-shopu'),
                      S.documentTypeListItem('ecomEntry').title('Vstup E-shopu'),
                      S.documentTypeListItem('ecomDesc').title('Popis E-shopu'),
                      S.documentTypeListItem('ecomCTA').title('Výzva k akci E-shopu'),
                    ])
                ),

              // Kurzy Section
              S.listItem()
                .title('Kurzy')
                .child(
                  S.list()
                    .title('Sekce kurzů')
                    .items([
                      S.documentTypeListItem('kurzyIntro').title('Úvod kurzů'),
                      S.documentTypeListItem('kurzyAbout').title('O kurzech'),
                      S.documentTypeListItem('kurzyCTA').title('Výzva k akci kurzů'),
                    ])
                ),

              // Info Section
              S.listItem()
                .title('Informace')
                .child(
                  S.list()
                    .title('Sekce informace')
                    .items([
                      S.documentTypeListItem('mapa').title('Mapa'),
                      S.documentTypeListItem('kontakt').title('Kontakt'),
                    ])
                ),
            ])
        ),

      // Other content
      S.divider(),
      S.documentTypeListItem('product').title('Produkty'),
    ])
