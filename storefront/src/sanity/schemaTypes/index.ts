import { SchemaPluginOptions } from "sanity"
import productSchema from "./documents/product"
import newsTextSchema from "./documents/newsText"
import newsPopupSchema from "./documents/newsPopup"
import introHeroSchema from "./documents/introHero"
import aboutHeroSchema from "./documents/aboutHero"
import ecomIntroSchema from "./documents/ecomIntro"
import ecomEntrySchema from "./documents/ecomEntry"
import ecomDescSchema from "./documents/ecomDesc"
import ecomCTASchema from "./documents/ecomCTA"
import kurzyIntroSchema from "./documents/kurzyIntro"
import kurzyAboutSchema from "./documents/kurzyAbout"
import kurzyCTASchema from "./documents/kurzyCTA"
import mapaSchema from "./documents/mapa"
import kontaktSchema from "./documents/kontakt"
import mainPageSettingsSchema from "./documents/mainPageSettings"

export const schema: SchemaPluginOptions = {
  types: [
    productSchema,
    newsTextSchema,
    newsPopupSchema,
    introHeroSchema,
    aboutHeroSchema,
    ecomIntroSchema,
    ecomEntrySchema,
    ecomDescSchema,
    ecomCTASchema,
    kurzyIntroSchema,
    kurzyAboutSchema,
    kurzyCTASchema,
    mapaSchema,
    kontaktSchema,
    mainPageSettingsSchema,
  ],
  templates: (templates) => templates.filter(
    (template) => template.schemaType !== "product"
  ),
}