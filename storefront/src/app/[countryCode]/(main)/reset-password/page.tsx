import ResetPasswordForm from "@modules/account/templates/reset-password-page"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Resetovat heslo",
  description: "Resetujte své heslo pro svůj účet Keramická Zahrada.",
}

export default function ResetPassword() {
  return <ResetPasswordForm />
}
