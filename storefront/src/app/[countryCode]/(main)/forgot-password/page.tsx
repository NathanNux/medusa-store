import { Metadata } from "next"

import RequestResetPassword from "@modules/account/templates/forgot-password-page"

export const metadata: Metadata = {
  title: "Zabudnuté heslo",
  description: "Obnovte si heslo pre svoj účet Medusa Store.",
}

export default function ForgotPassword() {
  return <RequestResetPassword />
}
