import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

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
})

type PatchSchema = z.infer<typeof PatchSchema>

export async function PATCH(
  req: AuthenticatedMedusaRequest<PatchSchema>,
  res: MedusaResponse
) {
  const { id } = req.params
  const { title } = req.body || {}

  const service = req.scope.resolve("bundledProduct") as any

  if (title) {
    const updated = await service.updateBundles([{ id, title }])
    return res.json({ bundled_product: updated?.[0] ?? null })
  }

  return res.json({ bundled_product: null })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const service = req.scope.resolve("bundledProduct") as any
  await service.deleteBundles([id])
  return res.json({ id, deleted: true, object: "bundled_product" })
}
