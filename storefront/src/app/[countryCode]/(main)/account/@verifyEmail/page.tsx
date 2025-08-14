import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import VerifyEmailReminderPage from "@modules/account/templates/send-email-verification-again-page"

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address for your Medusa Store account.",
}

export default async function VerifyEmail() {
  const customer = await retrieveCustomer().catch(() => null)
  console.log("Customer data:", customer)

  if (!customer) {
    // Optionally render a fallback or redirect
    return <div>No customer found.</div>
  }

  return <VerifyEmailReminderPage customer={{ email: customer.email }} />
}