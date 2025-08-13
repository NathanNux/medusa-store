// ./sanity/deskStructure.ts

import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(S.documentTypeListItems())
