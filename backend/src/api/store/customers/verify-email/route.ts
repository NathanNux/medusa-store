import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
<<<<<<< Updated upstream
  const { token, email } = req.body as { token: string; email: string }

  console.log("[VERIFY EMAIL] Incoming request:", { token, email })

    if (!token || !email) {
      res.status(400).json({ ok: false, message: "Missing token or email." })
      return
    }
    if (!token || !email) {
      res.status(400).json({ ok: false, message: "Missing token or email." })
      return
    }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  let customer = null as any
=======
>>>>>>> Stashed changes
  try {
    const { token, email } = req.body as { token?: string; email?: string }

    if (!token || !email) {
      res.status(400).json({ ok: false, message: "Missing token or email." })
      return
    }

    const customerModuleService = req.scope.resolve(Modules.CUSTOMER)

    // Find customer by email
    const customers = await customerModuleService.listCustomers({ email })
    const customer = customers[0] || null

    if (!customer) {
      res.status(404).json({ ok: false, message: "Customer not found." })
      return
    }

<<<<<<< Updated upstream
  const tokenMatches = customer.metadata.email_verification_token === token
  const expiresAt = customer.metadata.email_verification_expires_at
  const isExpired = expiresAt && new Date(expiresAt) < new Date()
=======
    const storedToken = customer.metadata?.email_verification_token
    const expiresAt = customer.metadata?.email_verification_expires_at as string | undefined
>>>>>>> Stashed changes

    if (!storedToken || storedToken !== token) {
      res.status(400).json({ ok: false, message: "Invalid verification token." })
      return
    }

    if (!expiresAt || new Date(expiresAt).getTime() < Date.now()) {
      res.status(400).json({ ok: false, message: "Verification token has expired." })
      return
    }

    // Update customer metadata: mark verified and remove token/expiry
    const newMetadata: Record<string, any> = {
      ...(customer.metadata || {}),
      email_verified: true,
    }

    // Remove token and expiry fields if present
    delete newMetadata.email_verification_token
    delete newMetadata.email_verification_expires_at

<<<<<<< Updated upstream
  try {
    // preserve other metadata keys
=======
>>>>>>> Stashed changes
    await customerModuleService.updateCustomers(customer.id, {
      metadata: newMetadata,
    })

<<<<<<< Updated upstream
  // retrieve updated customer to return to client
  let updatedCustomer = null
  try {
    updatedCustomer = await customerModuleService.retrieveCustomer(customer.id)
    console.log("[VERIFY EMAIL] Updated customer:", updatedCustomer)
  } catch (err) {
    console.log("[VERIFY EMAIL] Error retrieving updated customer:", err)
  }

  res.status(200).json({ ok: true, message: "Email verified successfully.", customer: updatedCustomer })
  }
=======
    res.status(200).json({ ok: true, message: "Email verified." })
  } catch (err) {
    console.error("Error in verify-email route:", err)
    res.status(500).json({ ok: false, message: "Internal server error." })
  }
}
>>>>>>> Stashed changes
