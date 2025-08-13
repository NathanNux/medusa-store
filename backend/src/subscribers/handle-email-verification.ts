import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

export default async function emailVerificationHandler({
  event: { data: { id } },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("CUSTOMER.CREATED SUBSCRIBER TRIGGERED for customer id:", id)

  const customerModuleService = container.resolve(Modules.CUSTOMER)
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const config = container.resolve("configModule")

  // Fetch customer to get email and token
  const customer = await customerModuleService.retrieveCustomer(id)
  const email = customer.email
  const token = customer.metadata?.email_verification_token
  console.log("Customer email:", email)

  const urlPrefix = config.admin.storefrontUrl || "https://storefront.com"

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: "email-verification",
    data: {
      verification_url: `${urlPrefix}/verify-email?token=${token}&email=${email}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "customer.created",
}