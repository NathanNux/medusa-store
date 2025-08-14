import VerifyEmailPage from "@modules/account/templates/verify-email-page"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address for your Medusa Store account.",
}

export default function VerifyEmail() {
  return <VerifyEmailPage />
}
