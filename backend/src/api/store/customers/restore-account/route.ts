import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { customer_id } = req.body as { customer_id: string }

  if (!customer_id) {
    return res.status(400).json({ message: "Missing customer_id." })
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)

  try {
    await customerModuleService.restoreCustomers([customer_id])
    return res.status(200).json({ success: true, message: "Customer restored." })
  } catch (e) {
    return res.status(500).json({ success: false, message: "Failed to restore customer.", error: e })
  }
}