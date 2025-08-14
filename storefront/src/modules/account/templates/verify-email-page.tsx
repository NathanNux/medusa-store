"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button, Toaster, toast } from "@medusajs/ui"
import { verifyCustomerEmail } from "@lib/data/customer"

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  const handleVerify = async () => {
    setLoading(true)
    try {
      const result = await verifyCustomerEmail(token, email)
      if (result.ok) {
        toast.success(result.message || "Your email has been verified!")
        setSuccess(true)
      } else {
        toast.error(result.message || "Verification failed.")
      }
    } catch (e) {
      toast.error("Verification failed.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleVerify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Email Verification</h1>
        <p>
          Click the button below to verify your email address.
        </p>
        <Button
          disabled={loading || success}
          variant="primary"
        >
          {loading ? "Verifying..." : success ? "Verified!" : "Verify Email"}
        </Button>
        {success && (
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="secondary" onClick={() => router.push("/account")}>
              Go to My Account
            </Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Go to Store
            </Button>
          </div>
        )}
        <Toaster />
      </div>
    </section>
  )
}