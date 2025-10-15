import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { setPasswordResetSilent, setPasswordResetToken, getPasswordResetToken } from "lib/password-reset-silencer"
import Medusa from "@medusajs/js-sdk"

type Body = {
  old_password?: string
}

// POST /store/customers/me/password/token
// Generates a password reset token for the current user without emailing it.
export const POST = async (
  req: AuthenticatedMedusaRequest<Body>,
  res: MedusaResponse
) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const { old_password } = req.body || {}

  try {
    const auth = req.scope.resolve(Modules.AUTH)
    const customerModule = req.scope.resolve(Modules.CUSTOMER)

    const [customer] = await customerModule.listCustomers({ id: customerId })
    if (!customer?.email) {
      return res.status(400).json({ message: "Customer email not found" })
    }

    // If old_password provided, verify it to avoid token abuse
    if (old_password) {
      try {
        await (auth as any).authenticate("customer.emailpass", {
          entity_id: customer.email,
          password: old_password,
        })
      } catch {
        return res.status(400).json({ message: "Staré heslo není správné" })
      }
    }

    // Silence the subscriber to skip email sending
    setPasswordResetSilent(customer.email)

    // Trigger reset via JS SDK so the event is emitted
  const config = req.scope.resolve("configModule") as any
    const backendBase = config?.admin?.backendUrl && config.admin.backendUrl !== "/"
      ? config.admin.backendUrl
      : process.env.BACKEND_URL || "http://localhost:9000"

  const pkHeader = (req.headers["x-publishable-api-key"] || req.headers["x-publishable-key"]) as string | undefined
  const pk = pkHeader || process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

    const sdk = new Medusa({ baseUrl: backendBase, publishableKey: pk })
    await sdk.auth.resetPassword("customer", "emailpass", { identifier: customer.email })

    // Wait for token to be available from subscriber (max ~5s)
    const started = Date.now()
    let token: string | undefined
    while (Date.now() - started < 10000) {
      token = getPasswordResetToken(customer.email)
      if (token) break
      await new Promise((r) => setTimeout(r, 100))
    }

    if (!token) {
      return res.status(504).json({ message: "Token se nepodařilo získat včas." })
    }

    // Store/refresh TTL and return
    setPasswordResetToken(customer.email, token)
    return res.json({ token })
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to generate token" })
  }
}
