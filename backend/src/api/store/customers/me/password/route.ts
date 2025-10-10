import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

type Body = {
  old_password: string
  new_password: string
}


export const POST = async (
  req: AuthenticatedMedusaRequest<Body>,
  res: MedusaResponse
) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { old_password, new_password } = req.body || ({} as Body)
  if (!old_password || !new_password) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    const auth = req.scope.resolve(Modules.AUTH)
    const customerModule = req.scope.resolve(Modules.CUSTOMER)

    // Load customer for email
    const [customer] = await customerModule.listCustomers({ id: customerId })
    if (!customer?.email) {
      return res.status(400).json({ message: "Customer email not found" })
    }

    // 1. Ověř staré heslo
    try {
      await (auth as any).authenticate("customer.emailpass", {
        entity_id: customer.email,
        password: old_password,
      })
    } catch {
      return res.status(400).json({ message: "Staré heslo není správné" })
    }

    // 2. Spusť resetPassword flow (vygeneruje token a pošle email)
    const resetResult = await (auth as any).resetPassword("customer", "emailpass", { identifier: customer.email })
    if (!resetResult?.token) {
      return res.status(500).json({ message: "Nepodařilo se vygenerovat token pro změnu hesla." })
    }

    // 3. Proveď updateProvider s tokenem (změna hesla)
    await (auth as any).updateProvider("customer", "emailpass", { password: new_password }, resetResult.token)

    return res.json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to change password" })
  }
}
