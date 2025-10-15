import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { isPasswordResetSilent, setPasswordResetToken } from "lib/password-reset-silencer"

export default async function resetPasswordTokenHandler({
  event: { data: {
    entity_id: email,
    token,
    actor_type,
  } },
  container,
}: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
  const notificationModuleService = container.resolve(
    Modules.NOTIFICATION
  )
  const config = container.resolve("configModule")

  let urlPrefix = config.admin.storefrontUrl || "https://storefront.com"
  // WIP - add here the url prefix for the storefront or admin or add a config variable
  // to the config module

  if (actor_type === "customer") {
    urlPrefix = config.admin.storefrontUrl || "https://storefront.com"
  } else {
    const backendUrl = config.admin.backendUrl !== "/" ? config.admin.backendUrl :
      "http://localhost:9000"
    const adminPath = config.admin.path
    urlPrefix = `${backendUrl}${adminPath}`
  }

  // Always store token so internal flows can consume it
  if (token && email) {
    setPasswordResetToken(email, token)
  }

  // If silent mode is enabled for this email, do not send email
  if (isPasswordResetSilent(email)) {
    return
  }

  await notificationModuleService.createNotifications({
    to: email,
    channel: "email",
    template: "password-reset",
    data: {
      reset_url: `${urlPrefix}/reset-password?token=${token}&email=${email}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}