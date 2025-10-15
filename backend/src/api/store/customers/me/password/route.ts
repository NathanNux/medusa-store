import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import bcrypt from "bcryptjs"

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

    // 2. Přímá bezpečná změna hesla bez e‑mailu: aktualizace auth identity
    const providerIdentities = await (auth as any).listProviderIdentities?.({
      entity_id: customer.email,
      provider: "emailpass",
    })

    if (!Array.isArray(providerIdentities) || providerIdentities.length === 0) {
      return res.status(404).json({ message: "Auth identity not found" })
    }

    const hashed = await bcrypt.hash(new_password, 10)

    for (const pi of providerIdentities) {
      if (!pi?.auth_identity_id) continue
      await (auth as any).updateAuthIdentities({
        id: pi.auth_identity_id,
        provider_id: "emailpass",
        provider: "emailpass",
        entity_id: customer.email,
        secrets: { password: hashed },
      })
    }

    return res.json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to change password" })
  }
}
