import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CartMetadataWorkflow from "../../../../../workflows/packeta-workflow"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id: cartId } = req.params
  const { result } = await CartMetadataWorkflow(req.scope).run({
    input: { cartId },
  })
  res.json({ metadata: result.metadata })
}