import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import VerifyEmailReminderPage from "@modules/account/templates/send-email-verification-again-page"

export const metadata: Metadata = {
  title: "Potvrzení e-mailu",
  description: "Ověřte svou e-mailovou adresu pro svůj účet Medusa Store.",
}

export default async function VerifyEmail() {
  const customer = await retrieveCustomer().catch(() => null)
  console.log("Customer data:", customer)

  if (!customer) {
    // Optionally render a fallback or redirect
    return <div>Žádný zákazník nebyl nalezen.</div>
  }

  return <VerifyEmailReminderPage customer={{ email: customer.email }} />
}