import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
  verifyEmail,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  verifyEmail?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  let content
  if (!customer) {
    content = login
  } else if (!customer.metadata?.email_verified) {
    content = verifyEmail
  } else {
    content = dashboard
  }

  return (
    <AccountLayout customer={customer}>
      {content}
      <Toaster />
    </AccountLayout>
  )
}