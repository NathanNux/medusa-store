import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const email = req.query.email as string
  if (!email) {
    res.status(400).json({ error: "Email is required" })
    return
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  const customers = await customerModuleService.listCustomers({ email })

  if (!customers.length) {
    res.status(404).json({ customer: null })
  } else {
    res.json({ customer: customers[0] })
  }
}