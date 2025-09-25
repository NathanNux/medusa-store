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

    // Load customer for email (provider identity uses email for entity_id in emailpass)
    const [customer] = await customerModule.listCustomers({ id: customerId })
    if (!customer?.email) {
      return res.status(400).json({ message: "Customer email not found" })
    }

    // Verify old password by authenticating
    try {
      await (auth as any).authenticate("customer.emailpass", {
        entity_id: customer.email,
        password: old_password,
      })
    } catch {
      return res.status(400).json({ message: "Staré heslo není správné" })
    }

    // Update password: for emailpass provider, update the auth identity secret
    const providerIdentities = await auth.listProviderIdentities({
      entity_id: customer.email,
    })

    const pi = providerIdentities?.[0]
    if (!pi?.auth_identity_id) {
      return res.status(404).json({ message: "Auth identity not found" })
    }

    await (auth as any).updateAuthIdentities([
      {
        id: pi.auth_identity_id,
        secrets: { password: new_password },
      },
    ])

    return res.json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to change password" })
  }
}
