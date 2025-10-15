import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import Medusa from "@medusajs/js-sdk"

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
  const config = req.scope.resolve("configModule") as any

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

    // 2. Získej reset token z interní token route (ta umlčí e‑mail a uloží token)
    const backendBase = config?.admin?.backendUrl && config.admin.backendUrl !== "/"
      ? config.admin.backendUrl
      : process.env.BACKEND_URL || "http://localhost:9000"

    const pkHeader = req.headers["x-publishable-api-key"] || req.headers["x-publishable-key"]

    const tokenRes = await fetch(`${backendBase}/store/customers/me/password/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: req.headers.authorization || "",
        ...(pkHeader ? { "x-publishable-api-key": String(pkHeader), "x-publishable-key": String(pkHeader) } : {}),
      },
      body: JSON.stringify({ old_password }),
    })
    if (!tokenRes.ok) {
      const data = await tokenRes.json().catch(() => ({} as any))
      return res.status(tokenRes.status).json({ message: data?.message || "Nepodařilo se získat token." })
    }
    const { token } = await tokenRes.json()

    // 3. Aktualizuj heslo přes JS SDK: sdk.auth.updateProvider("customer", "emailpass", { email, password }, token)
    const pk = (pkHeader as string) || process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
    const sdk = new Medusa({ baseUrl: backendBase, publishableKey: pk })

    try {
      await sdk.auth.updateProvider(
        "customer",
        "emailpass",
        { email: customer.email, password: new_password },
        token
      )
    } catch (e: any) {
      const message = e?.message || "Nepodařilo se změnit heslo."
      // 400 pro očekávané chyby, jinak 500
      return res.status(e?.status || 400).json({ message })
    }

    return res.json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to change password" })
  }
}
