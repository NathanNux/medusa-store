"use client"

import { useState } from "react"
import { Button, toast } from "@medusajs/ui"
import { resendVerification } from "@lib/data/customer"

type Props = {
  customer: {
    email: string
  }
}

export default function VerifyEmailReminderPage({ customer }: Props) {
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  console.log("VerifyEmailReminderPage", customer)

    const handleResend = async () => {
        setLoading(true)
        setResent(false)
        const result = await resendVerification(customer.email)
        if (result.success) {
            toast.success(result.message)
            setResent(true)
        } else {
            toast.error(result.message)
        }
        setLoading(false)
    }

  return (
    <section className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-center">
          We’ve sent a verification link to <b>{customer.email}</b>.<br />
          Please check your inbox and click the link to verify your email address.
        </p>
        <p className="text-center text-sm text-gray-500">
          Didn’t get the email? Check your spam folder.<br />
          You can also resend the verification email below.
        </p>
        <Button
          onClick={handleResend}
          disabled={loading}
          variant="secondary"
        >
          {loading ? "Resending..." : resent ? "Email Sent!" : "Resend Verification Email"}
        </Button>
      </div>
    </section>
  )
}