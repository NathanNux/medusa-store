import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetStoreCustomerReviewsSchema = createFindParams()

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: reviews, metadata: { count, take, skip } = { count: 0, take: 10, skip: 0 } } = await query.graph({
    entity: "review",
    fields: [
      "id",
      "title",
      "content",
      "rating",
      "first_name",
      "last_name",
      "status",
      "product_id",
      "created_at",
      "updated_at",
    ],
    filters: {
      customer_id: customerId,
    },
    ...req.queryConfig,
  })

  const safe = Array.isArray(reviews) ? reviews.filter((r: any) => !!r) : []
  // eslint-disable-next-line no-console
  console.log("[Reviews][GET me] actor:", customerId, "count:", count, "returned:", safe.length)
  return res.json({ reviews: safe, count, limit: take, offset: skip })
}
