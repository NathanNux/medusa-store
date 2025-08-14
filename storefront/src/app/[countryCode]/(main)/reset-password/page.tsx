import ResetPasswordForm from "@modules/account/templates/reset-password-page"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password for your Medusa Store account.",
}

export default function ResetPassword() {
  return <ResetPasswordForm />
}
