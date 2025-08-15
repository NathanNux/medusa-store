import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { Modules } from "@medusajs/framework/utils"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")
  const { id } = req.params

  const { data } = await query.graph({
    entity: "bundle",
    fields: [
      "*",
      "items.*",
      "items.product.*",
    ],
    filters: {
      id,
    },
  })

  res.json({
    bundled_product: data?.[0] ?? null,
  })
}

const PatchSchema = z.object({
  title: z.string().min(1).optional(),
  items: z
    .array(
      z.object({
        product_id: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .optional(),
})

type PatchSchema = z.infer<typeof PatchSchema>

export async function PATCH(
  req: AuthenticatedMedusaRequest<PatchSchema>,
  res: MedusaResponse
) {
  const { id } = req.params
  const { title } = req.body || {}

  const service = req.scope.resolve("bundledProduct") as any
  const query = req.scope.resolve("query")
  const remoteLink = req.scope.resolve("remoteLink") as any

  let updatedEntity: any = null

  if (title) {
    const updated = await service.updateBundles([{ id, title }])
    updatedEntity = updated?.[0] ?? null
  }

  if (Array.isArray(req.body?.items)) {
    // 1) Smazat existující položky balíčku
    const { data: existing } = await query.graph({
      entity: "bundle",
      filters: { id },
      fields: ["items.*"],
    })
    const existingItemIds = (existing?.[0]?.items ?? []).map((it: any) => it.id).filter(Boolean)
    if (existingItemIds.length) {
      await service.deleteBundleItems(existingItemIds, { hardDelete: true })
    }

    // 2) Vytvořit nové položky
    const createdItems = await service.createBundleItems(
      req.body.items.map((it) => ({ bundle_id: id, quantity: it.quantity }))
    )

    // 3) Vytvořit remote linky na produkty
    const links = createdItems.map((created: any, index: number) => ({
      ["bundledProduct"]: { bundle_item_id: created.id },
      [Modules.PRODUCT]: { product_id: req.body.items![index].product_id },
    }))
    if (links.length) {
      await remoteLink.create(links)
    }
  }

  // Vrátit aktuální stav bundlu
  const { data } = await query.graph({
    entity: "bundle",
    fields: ["*", "items.*", "items.product.*"],
    filters: { id },
  })

  return res.json({ bundled_product: data?.[0] ?? updatedEntity })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const service = req.scope.resolve("bundledProduct") as any
  const query = req.scope.resolve("query")

  // Nejprve smažeme položky, aby FK neblokoval smazání bundlu
  const { data: existing } = await query.graph({
    entity: "bundle",
    filters: { id },
    fields: ["items.*"],
  })
  const existingItemIds = (existing?.[0]?.items ?? []).map((it: any) => it.id).filter(Boolean)
  if (existingItemIds.length) {
    await service.deleteBundleItems(existingItemIds, { hardDelete: true })
  }

  await service.deleteBundles([id], { hardDelete: true })
  return res.json({ id, deleted: true, object: "bundled_product" })
}
