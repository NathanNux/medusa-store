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
    filters: {
      customer_id: customerId,
    },
    ...req.queryConfig,
  })

  return res.json({ reviews, count, limit: take, offset: skip })
}
