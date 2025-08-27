import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "review",
    fields: ["id", "title", "content", "rating", "status", "product_id", "created_at"],
    filters: {
      customer_id: customerId,
    },
  })

  return res.json({ reviews: data })
}
