import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ message: "Missing email." })
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)

  // 1. Find customer by email
  const customers = await customerModuleService.listCustomers({ email })
  const customer = customers[0] as any

  if (!customer) {
    return res.status(404).json({ message: "Customer not found." })
  }

  // 2. Soft delete the customer
  try {
    await customerModuleService.softDeleteCustomers([customer.id])
  } catch (e) {
    return res.status(500).json({ message: "Failed to soft delete customer.", error: e })
  }

  return res.status(200).json({ message: "Customer soft deleted." })
}