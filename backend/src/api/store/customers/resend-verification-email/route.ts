import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { v4 as uuidv4 } from "uuid"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { email } = req.body as { email: string }

    if (!email) {
      res.status(400).json({ message: "Missing email." })
      return
    }

    const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
    const notificationModuleService = req.scope.resolve(Modules.NOTIFICATION)
    const config = req.scope.resolve("configModule")

    // Find customer by email
    const customers = await customerModuleService.listCustomers({ email })
    const customer = customers[0] || null

    if (!customer) {
      res.status(404).json({ message: "Customer not found." })
      return
    }

    // Generate new token and expiry if missing or expired
    let token = customer.metadata?.email_verification_token
    let expiresAt = customer.metadata?.email_verification_expires_at as string | undefined

    const expired =
      !token ||
      !expiresAt ||
      new Date(expiresAt).getTime() < Date.now()

    if (expired) {
      token = uuidv4()
      expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24h from now

      await customerModuleService.updateCustomers(customer.id, {
        metadata: {
          ...customer.metadata,
          email_verification_token: token,
          email_verification_expires_at: expiresAt,
          email_verified: false,
        },
      })
    }

    const urlPrefix = config.admin?.storefrontUrl || "https://storefront.com"

    await notificationModuleService.createNotifications({
      to: email,
      channel: "email",
      template: "email-verification",
      data: {
        verification_url: `${urlPrefix}/verify-email?token=${token}&email=${email}`,
        email,
      },
    })

    res.status(200).json({ message: "Verification email sent!" })
  } catch (err) {
    console.error("Error in resend-verification-email route:", err)
    res.status(500).json({ message: "Internal server error." })
  }
}