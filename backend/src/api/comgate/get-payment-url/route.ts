import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import GetPaymentUrlWorkflow from "../../../workflows/get-payment-url"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id: cartId } = req.params
  const { result } = await GetPaymentUrlWorkflow(req.scope).run()
  res.json({ result })
}