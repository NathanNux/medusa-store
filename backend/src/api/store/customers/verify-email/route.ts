import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { token, email } = req.body as { token: string; email: string }

  console.log("[VERIFY EMAIL] Incoming request:", { token, email })

  if (!token || !email) {
    console.log("[VERIFY EMAIL] Missing token or email.")
    res.status(400).json({ message: "Missing token or email." })
    return
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  let customer
  try {
    const customers = await customerModuleService.listCustomers({ email })
    customer = customers[0] || null
    console.log("[VERIFY EMAIL] Retrieved customer:", customer)
  } catch (err) {
    console.log("[VERIFY EMAIL] Error retrieving customer:", err)
    customer = null
  }

  if (!customer || !customer.metadata?.email_verification_token) {
    console.log("[VERIFY EMAIL] No customer or missing verification token.", {
      customer,
    })
    res.status(404).json({ message: "Invalid token or email." })
    return
  }

  const tokenMatches = customer.metadata.email_verification_token === token
  const expiresAt = customer.metadata.email_verification_expires_at
  const isExpired =
    expiresAt && new Date(expiresAt) < new Date()

  console.log("[VERIFY EMAIL] Token matches:", tokenMatches)
  console.log("[VERIFY EMAIL] Token expires at:", expiresAt, "Is expired:", isExpired)

  if (!tokenMatches || isExpired) {
    console.log("[VERIFY EMAIL] Invalid or expired token.", {
      tokenMatches,
      isExpired,
      customerToken: customer.metadata.email_verification_token,
      providedToken: token,
      expiresAt,
    })
    res.status(400).json({ message: "Invalid or expired token." })
    return
  }

  try {
    await customerModuleService.updateCustomers(customer.id, {
      metadata: {
        ...customer.metadata,
        email_verified: true,
        email_verification_token: null,
        email_verification_expires_at: null,
      },
    })
    console.log("[VERIFY EMAIL] Email verified and customer updated:", customer.id)
  } catch (err) {
    console.log("[VERIFY EMAIL] Error updating customer:", err)
    res.status(500).json({ message: "Failed to update customer." })
    return
  }

  res.status(200).json({ message: "Email verified successfully." })
}