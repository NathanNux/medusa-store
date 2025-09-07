import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { token, email } = req.body as { token?: string; email?: string }

    if (!token || !email) {
      res.status(400).json({ ok: false, message: "Missing token or email." })
      return
    }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  let customer = null as any
  try {
    const customers = await customerModuleService.listCustomers({ email })
    const customer = customers[0] || null

    if (!customer) {
      res.status(404).json({ ok: false, message: "Customer not found." })
      return
    }

    const storedToken = customer.metadata?.email_verification_token
    const expiresAt = customer.metadata?.email_verification_expires_at as string | undefined

    if (!storedToken || storedToken !== token) {
      res.status(400).json({ ok: false, message: "Invalid verification token." })
      return
    }

  const tokenMatches = customer.metadata.email_verification_token === token
  const expiresAt = customer.metadata.email_verification_expires_at
  const isExpired = expiresAt && new Date(expiresAt) < new Date()

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
    // preserve other metadata keys
    await customerModuleService.updateCustomers(customer.id, {
      metadata: newMetadata,
    })

    res.status(200).json({ ok: true, message: "Email verified." })
  } catch (err) {
    console.error("Error in verify-email route:", err)
    res.status(500).json({ ok: false, message: "Internal server error." })
  }

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