import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ message: "Missing email." })
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  const authModuleService = req.scope.resolve(Modules.AUTH)

  // 1. Find customer by email
  const customers = await customerModuleService.listCustomers({ email })
  const customer = customers[0] as any

  if (!customer) {
    return res.status(404).json({ message: "Customer not found." })
  }

  // 2. Delete provider and auth identities for this email
  try {
    const providerIdentities = await authModuleService.listProviderIdentities({ entity_id: email })
    for (const providerIdentity of providerIdentities) {
      const authIdentityId = providerIdentity.auth_identity_id as string
      await authModuleService.deleteProviderIdentities([providerIdentity.id])
      await authModuleService.deleteAuthIdentities([authIdentityId])
    }
  } catch (e) {
    // continue if not found
  }

  // 3. Delete the guest customer
  try {
    await customerModuleService.deleteCustomers(customer.id)
  } catch (e) {
    return res.status(500).json({ message: "Failed to delete guest customer.", error: e })
  }

  return res.status(200).json({ message: "Guest customer and identities deleted." })
}